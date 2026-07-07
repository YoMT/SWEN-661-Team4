<#
.SYNOPSIS
  Generate a deployment-package report (Markdown + DOCX) for the CareConnect
  desktop Windows build.

.DESCRIPTION
  Reads the electron-builder output in the dist directory and gathers:
    - Build metadata (product, version, target, timestamps, tool versions)
    - File list + sizes
    - Checksums (SHA-256/512) + integrity check against latest.yml
    - Code-signing status (Get-AuthenticodeSignature)
    - Warnings/errors parsed from the build log (if available)
  Emits <OutName>.md then converts it to <OutName>.docx by reusing the repo's
  branded converter (Documentation/md_to_docx.py). Read-only except for writing
  the two report files.

  This script is intentionally ASCII-only: Windows PowerShell 5.1 reads a BOM-less
  file as the system code page, so non-ASCII bytes would be mis-decoded.

.EXAMPLE
  powershell -File scripts/report-package.ps1
  powershell -File scripts/report-package.ps1 -DistDir C:\ccbuild\dist -LogPath C:\ccbuild\dist\build.log
#>
[CmdletBinding()]
param(
  [string]$DistDir,
  [string]$LogPath,
  [string]$OutName = 'PACKAGE_REPORT'
)

$ErrorActionPreference = 'Stop'

# ---- Paths -----------------------------------------------------------------
$AppDir  = Split-Path -Parent $PSScriptRoot          # apps/desktop
$RepoDir = (Resolve-Path (Join-Path $AppDir '..\..')).Path
if (-not $DistDir) { $DistDir = Join-Path $AppDir 'dist' }
$resolved = Resolve-Path $DistDir -ErrorAction SilentlyContinue
if (-not $resolved) { throw "Dist directory not found ($DistDir). Build the installer first." }
$DistDir = $resolved.Path
if (-not $LogPath) {
  $default = Join-Path $DistDir 'build.log'
  if (Test-Path $default) { $LogPath = $default }
}

$builderYml = Join-Path $AppDir 'electron-builder.yml'
$pkgJson    = Join-Path $AppDir 'package.json'
$latestYml  = Join-Path $DistDir 'latest.yml'

# ---- Helpers ---------------------------------------------------------------
function Format-Size([long]$bytes) {
  if ($bytes -ge 1GB) { return ('{0:N2} GB' -f ($bytes / 1GB)) }
  if ($bytes -ge 1MB) { return ('{0:N2} MB' -f ($bytes / 1MB)) }
  if ($bytes -ge 1KB) { return ('{0:N1} KB' -f ($bytes / 1KB)) }
  return "$bytes B"
}

function Get-YamlValue([string]$file, [string]$key) {
  # Lightweight top-level/simple key reader (PowerShell has no YAML parser).
  if (-not (Test-Path $file)) { return $null }
  $pattern = '^\s*' + [regex]::Escape($key) + ':\s*(.+?)\s*$'
  $m = Select-String -Path $file -Pattern $pattern | Select-Object -First 1
  if ($m) { return $m.Matches[0].Groups[1].Value.Trim(@("'", '"')) }
  return $null
}

function Get-Sha512Base64([string]$file) {
  $sha = [System.Security.Cryptography.SHA512]::Create()
  try {
    $fs = [System.IO.File]::OpenRead($file)
    try { return [Convert]::ToBase64String($sha.ComputeHash($fs)) } finally { $fs.Dispose() }
  } finally { $sha.Dispose() }
}

$sb = [System.Text.StringBuilder]::new()
function W([string]$line = '') { [void]$sb.AppendLine($line) }

# ---- Gather: metadata ------------------------------------------------------
$productName    = Get-YamlValue $builderYml 'productName'
$appId          = Get-YamlValue $builderYml 'appId'
$executableName = Get-YamlValue $builderYml 'executableName'
$version        = Get-YamlValue $latestYml 'version'
$releaseDate    = Get-YamlValue $latestYml 'releaseDate'
$latestSha512   = Get-YamlValue $latestYml 'sha512'
$latestSize     = Get-YamlValue $latestYml 'size'

$pkg = $null
if (Test-Path $pkgJson) { $pkg = Get-Content $pkgJson -Raw | ConvertFrom-Json }
if (-not $version -and $pkg) { $version = $pkg.version }
$electronVer     = if ($pkg) { $pkg.devDependencies.electron } else { $null }
$builderVerRange = if ($pkg) { $pkg.devDependencies.'electron-builder' } else { $null }

# electron-builder resolved version from the log, when present
$logText = if ($LogPath -and (Test-Path $LogPath)) { Get-Content $LogPath -Raw } else { $null }
$builderVer = $null
if ($logText) {
  $m = [regex]::Match($logText, 'electron-builder\s+version=([\d\.]+)')
  if ($m.Success) { $builderVer = $m.Groups[1].Value }
}
if (-not $builderVer) { $builderVer = "$builderVerRange (declared)" }

# Locate the installer
$installer = Get-ChildItem -Path $DistDir -Filter '*-setup.exe' -File -ErrorAction SilentlyContinue | Select-Object -First 1
$genTime = Get-Date
$installerName = if ($installer) { $installer.Name } else { '(missing - build not present)' }
$installerTime = if ($installer) { $installer.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss K') } else { 'n/a' }

W "# Deployment Package Report - $productName (Windows)"
W
W "_Generated $($genTime.ToString('yyyy-MM-dd HH:mm:ss K')) by ``scripts/report-package.ps1``._"
W
W '---'
W
W '## 1. Build metadata'
W
W '| Field | Value |'
W '| --- | --- |'
W "| Product name | $productName |"
W "| App ID | ``$appId`` |"
W "| Executable | ``$executableName.exe`` |"
W "| Version | $version |"
W '| Target | NSIS installer, x64 |'
W "| Installer artifact | ``$installerName`` |"
W "| Release date (latest.yml) | $releaseDate |"
W "| Installer file time | $installerTime |"
W "| Electron | $electronVer |"
W "| electron-builder | $builderVer |"
W "| Build host | $env:COMPUTERNAME ($env:PROCESSOR_ARCHITECTURE) |"
W

# ---- Gather: files ---------------------------------------------------------
W '## 2. Files and sizes'
W
W '| File | Size | Modified |'
W '| --- | --- | --- |'
$files = Get-ChildItem -Path $DistDir -File | Sort-Object Name
foreach ($f in $files) {
  W "| ``$($f.Name)`` | $(Format-Size $f.Length) | $($f.LastWriteTime.ToString('yyyy-MM-dd HH:mm')) |"
}
$unpacked = Join-Path $DistDir 'win-unpacked'
if (Test-Path $unpacked) {
  $uFiles = Get-ChildItem $unpacked -Recurse -File -ErrorAction SilentlyContinue
  $uSize  = ($uFiles | Measure-Object Length -Sum).Sum
  $uExe   = Get-ChildItem $unpacked -Filter '*.exe' -File -ErrorAction SilentlyContinue | Select-Object -First 1
  W "| ``win-unpacked/`` *(folder, $($uFiles.Count) files)* | $(Format-Size $uSize) | - |"
  if ($uExe) { W "| ``win-unpacked/$($uExe.Name)`` | $(Format-Size $uExe.Length) | $($uExe.LastWriteTime.ToString('yyyy-MM-dd HH:mm')) |" }
}
W

# ---- Gather: checksums -----------------------------------------------------
W '## 3. Checksums'
W
W '| File | SHA-256 | SHA-512 (Base64) |'
W '| --- | --- | --- |'
foreach ($f in ($files | Where-Object { $_.Extension -in '.exe', '.blockmap' })) {
  $sha256 = (Get-FileHash -Path $f.FullName -Algorithm SHA256).Hash.ToLower()
  $sha512b64 = Get-Sha512Base64 $f.FullName
  W "| ``$($f.Name)`` | ``$sha256`` | ``$sha512b64`` |"
}
W
# Integrity check against latest.yml (what the auto-updater verifies)
if ($installer -and $latestSha512) {
  $calc = Get-Sha512Base64 $installer.FullName
  $sizeOk = (-not $latestSize) -or ([long]$latestSize -eq $installer.Length)
  $hashOk = $calc -eq $latestSha512
  $verdict = if ($hashOk -and $sizeOk) { '**PASS**' } else { '**FAIL**' }
  W "**Integrity check vs ``latest.yml``:** $verdict"
  W
  W '| Check | Expected (latest.yml) | Actual | Result |'
  W '| --- | --- | --- | --- |'
  W "| SHA-512 | ``$latestSha512`` | ``$calc`` | $(if ($hashOk) { 'match' } else { 'MISMATCH' }) |"
  W "| Size (bytes) | $latestSize | $($installer.Length) | $(if ($sizeOk) { 'match' } else { 'MISMATCH' }) |"
} else {
  W '_Integrity check skipped - installer or latest.yml not present._'
}
W

# ---- Gather: signing -------------------------------------------------------
W '## 4. Code-signing status'
W
$targets = @()
if ($installer) { $targets += $installer.FullName }
if (Test-Path $unpacked) {
  $uExe = Get-ChildItem $unpacked -Filter '*.exe' -File -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($uExe) { $targets += $uExe.FullName }
}
if ($targets.Count -eq 0) {
  W '_No executables found to check._'
} else {
  W '| Artifact | Status | Signer |'
  W '| --- | --- | --- |'
  $anySigned = $false
  foreach ($t in $targets) {
    $sig = Get-AuthenticodeSignature $t
    $rel = Split-Path $t -Leaf
    $signer = if ($sig.SignerCertificate) { $anySigned = $true; $sig.SignerCertificate.Subject } else { '-' }
    W "| ``$rel`` | $($sig.Status) | $signer |"
  }
  W
  if (-not $anySigned) {
    W '> **UNSIGNED** - no code-signing certificate configured. Windows SmartScreen will warn on first run. Configure ``win.certificateFile`` / ``certificateSubjectName`` in ``electron-builder.yml`` (plus a code-signing certificate) to sign releases.'
  }
}
W

# ---- Gather: warnings/errors ----------------------------------------------
W '## 5. Build warnings and errors'
W
if ($logText) {
  # Skip PowerShell's own error-stream decoration: when native stderr is merged
  # with 2>&1, pnpm/npm warnings get wrapped as ErrorRecords, adding noise lines
  # (CategoryInfo / FullyQualifiedErrorId / "+ ..." / "At line:") that would
  # otherwise be miscounted as build errors.
  $psNoise = 'CategoryInfo|FullyQualifiedErrorId|RemoteException|^\s*\+ |^At (line|C:)'
  $hits = Get-Content $LogPath |
    Where-Object { $_ -notmatch $psNoise } |
    Where-Object { $_ -match '(?i)(warning|warn|error|ELIFECYCLE|failed)' }
  $uniq = $hits | ForEach-Object { $_.Trim() } | Where-Object { $_ } | Select-Object -Unique
  $errCount  = ($uniq | Where-Object { $_ -match '(?i)(error|ELIFECYCLE|failed)' }).Count
  $warnCount = $uniq.Count - $errCount
  W "Parsed from ``$(Split-Path $LogPath -Leaf)`` - **$warnCount warning(s)**, **$errCount error(s)**."
  W
  if ($uniq.Count -gt 0) {
    W '```'
    foreach ($line in ($uniq | Select-Object -First 60)) { W $line }
    if ($uniq.Count -gt 60) { W "... (+$($uniq.Count - 60) more)" }
    W '```'
  } else {
    W '_No warning/error lines found in the log._'
  }
} else {
  W '_No build log captured for this run._ Re-run packaging via ``scripts/build-win-installer.ps1`` (or ``pnpm package:win:report``) to capture ``dist/build.log``.'
  $bdbg = Join-Path $DistDir 'builder-debug.yml'
  if ((Test-Path $bdbg) -and ((Get-Content $bdbg -Raw) -match 'C:\\ccbuild')) {
    W
    W '> Note: ``builder-debug.yml`` shows this build ran from the ``C:\ccbuild`` short-path directory - the documented workaround for the Windows 260-char path limit that otherwise breaks the NSIS step.'
  }
}
W

# ---- Notes -----------------------------------------------------------------
W '## Notes'
W
W '- **Signing:** installer is unsigned (no certificate configured).'
$pubUrl = Get-YamlValue $builderYml 'url'
if ($pubUrl) { W "- **Auto-update:** ``publish.url`` is ``$pubUrl`` (placeholder - not a live update server)." }
W '- **Location:** ``apps/desktop/dist/`` is gitignored, so this report is a per-build artifact. Copy the ``.docx`` into ``Documentation/`` if a tracked record is wanted.'
W

# ---- Write markdown --------------------------------------------------------
$mdPath   = Join-Path $DistDir "$OutName.md"
$docxPath = Join-Path $DistDir "$OutName.docx"
[System.IO.File]::WriteAllText($mdPath, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Wrote $mdPath"

# ---- Convert to DOCX (reuse repo converter) --------------------------------
$docDir = Join-Path $RepoDir 'Documentation'
$pyOk = $false
$py = Get-Command py -ErrorAction SilentlyContinue
if ($py) {
  $code = @"
import sys
sys.path.insert(0, r'$docDir')
from pathlib import Path
from md_to_docx import convert
convert(Path(r'$mdPath'), Path(r'$docxPath'))
"@
  $tmp = Join-Path $env:TEMP ("md2docx_" + [guid]::NewGuid().ToString('N') + '.py')
  [System.IO.File]::WriteAllText($tmp, $code, (New-Object System.Text.UTF8Encoding($false)))
  try {
    & py $tmp
    if ($LASTEXITCODE -eq 0 -and (Test-Path $docxPath)) { $pyOk = $true }
  } catch { Write-Warning "DOCX conversion failed: $_" }
  finally { Remove-Item $tmp -Force -ErrorAction SilentlyContinue }
}
if ($pyOk) {
  Write-Host "Wrote $docxPath"
} else {
  Write-Warning "Could not produce DOCX (need 'py' + python-docx). Markdown report is available at $mdPath"
}

Write-Host ""
Write-Host "Deployment package report complete."
