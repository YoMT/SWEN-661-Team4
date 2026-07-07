<#
.SYNOPSIS
  Build the CareConnect desktop Windows installer and generate its package report.

.DESCRIPTION
  Wraps the known-good Windows packaging flow. electron-builder's NSIS step fails
  in-place because pnpm's deep .pnpm/app-builder-lib@... path pushes an NSIS
  include file past Windows' 260-char MAX_PATH. Since apps/desktop has no workspace
  dependencies, this builds from a short throwaway path ($BuildRoot, default
  C:\ccbuild) where the path stays under the limit, captures the full build log,
  copies the artifacts back into apps/desktop/dist/, then runs report-package.ps1.

  Notes:
   - The installer is unsigned; Windows Defender may lock/deny writing the freshly
     built .exe into the project tree, so the copy-back is best-effort and the
     installer remains available under $BuildRoot\dist regardless.
   - ASCII-only on purpose (Windows PowerShell 5.1 reads BOM-less files as the
     system code page).

.EXAMPLE
  powershell -File scripts/build-win-installer.ps1
#>
[CmdletBinding()]
param(
  [string]$BuildRoot = 'C:\ccbuild'
)

$ErrorActionPreference = 'Stop'
$AppDir  = Split-Path -Parent $PSScriptRoot          # apps/desktop
$DistDir = Join-Path $AppDir 'dist'
$log     = Join-Path $BuildRoot 'dist\build.log'

if ($BuildRoot -eq $AppDir) { throw 'BuildRoot must differ from the app directory.' }
Write-Host "==> Packaging from short path: $BuildRoot"

# 1. Fresh copy of the app source (no node_modules/out/dist/coverage/.git)
if (Test-Path $BuildRoot) { Get-ChildItem $BuildRoot -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Force -Path $BuildRoot | Out-Null
Write-Host '==> Copying source...'
& robocopy $AppDir $BuildRoot /E /XD node_modules out dist coverage .git /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with code $LASTEXITCODE" }

# 2. Ensure corepack can resolve pnpm inside the standalone copy. Insert the
#    packageManager line via text edit (no JSON round-trip) and write without a
#    BOM - corepack rejects a BOM'd package.json.
$pkgPath = Join-Path $BuildRoot 'package.json'
$raw = Get-Content $pkgPath -Raw
if ($raw -notmatch '"packageManager"') {
  $raw = $raw -replace '("version":\s*"[^"]*",)', "`$1`r`n  `"packageManager`": `"pnpm@9.0.0`","
  [System.IO.File]::WriteAllText($pkgPath, $raw, (New-Object System.Text.UTF8Encoding($false)))
}

# 3. Install + build. Write output to the log with Out-File (which CONSUMES the
#    stream) rather than Tee-Object - streaming a native build's thousands of
#    lines back up the pipeline can get the run truncated under automation.
#    EAP=Continue so pnpm's stderr warnings (wrapped as ErrorRecords in Windows
#    PowerShell) don't abort the run; we check $LASTEXITCODE explicitly.
New-Item -ItemType Directory -Force -Path (Split-Path $log -Parent) | Out-Null
Push-Location $BuildRoot
$prevEap = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
try {
  Write-Host '==> Installing dependencies (corepack pnpm install)...'
  & corepack pnpm install 2>&1 | Out-File -FilePath $log -Encoding utf8
  if ($LASTEXITCODE -ne 0) { throw "pnpm install failed (exit $LASTEXITCODE). See $log" }
  Write-Host '==> Building Windows installer (corepack pnpm build:win)...'
  & corepack pnpm build:win 2>&1 | Out-File -FilePath $log -Encoding utf8 -Append
  if ($LASTEXITCODE -ne 0) { throw "pnpm build:win failed (exit $LASTEXITCODE). See $log" }
  Write-Host '==> Build finished.'
} finally {
  $ErrorActionPreference = $prevEap
  Pop-Location
}

$setup = Get-ChildItem (Join-Path $BuildRoot 'dist') -Filter '*-setup.exe' -File -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $setup) { throw "Build did not produce an installer. See $log" }
Write-Host "==> Installer built: $($setup.FullName)"

# 4. Copy artifacts back into apps/desktop/dist. The big unsigned .exe may be
#    denied by Defender/Controlled-Folder-Access; that is non-fatal - it stays
#    under $BuildRoot\dist. Small metadata + the report always copy.
New-Item -ItemType Directory -Force -Path $DistDir | Out-Null
foreach ($n in @("$($setup.Name)", "$($setup.Name).blockmap", 'latest.yml', 'builder-debug.yml', 'build.log')) {
  $src = Join-Path $BuildRoot "dist\$n"
  if (-not (Test-Path $src)) { continue }
  try { Copy-Item $src $DistDir -Force -ErrorAction Stop }
  catch { Write-Warning "Could not copy $n into dist ($($_.Exception.Message)). It remains at $src" }
}
Write-Host "==> Copied available artifacts to $DistDir"

# 5. Generate the report. Point it at whichever dist actually holds the installer
#    (the build dir if the exe could not be copied into the repo).
$reportDist = if (Test-Path (Join-Path $DistDir $setup.Name)) { $DistDir } else { Join-Path $BuildRoot 'dist' }
& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'report-package.ps1') -DistDir $reportDist -LogPath $log
if ($reportDist -ne $DistDir) {
  foreach ($n in 'PACKAGE_REPORT.md', 'PACKAGE_REPORT.docx') {
    $src = Join-Path $reportDist $n
    if (Test-Path $src) { Copy-Item $src $DistDir -Force -ErrorAction SilentlyContinue }
  }
  Write-Host "==> Report copied to $DistDir (installer remains at $reportDist)"
}

# 6. Best-effort cleanup (the top-level folder itself may be protected). Skipped
#    when the installer could not be copied into the repo, so it is not lost.
if ($reportDist -eq $DistDir) {
  Get-ChildItem $BuildRoot -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}
Write-Host '==> Done.'
