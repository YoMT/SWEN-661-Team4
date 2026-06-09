# generate_coverage_report.ps1
# Runs flutter test --coverage, parses lcov.info, and writes
# docs/coverage_report.md and docs/coverage_report.docx.
#
# Usage:
#   powershell -File scripts\generate_coverage_report.ps1
#   powershell -File scripts\generate_coverage_report.ps1 -SkipTests
#   powershell -File scripts\generate_coverage_report.ps1 -ThresholdPct 75

param(
    [double]$ThresholdPct = 60.0,
    [switch]$SkipTests
)

$ProjectDir = Split-Path -Parent $PSScriptRoot
$LcovFile   = Join-Path $ProjectDir 'coverage\lcov.info'
$DocsDir    = Join-Path $ProjectDir 'docs'
$MdPath     = Join-Path $DocsDir 'coverage_report.md'
$DocxPath   = Join-Path $DocsDir 'coverage_report.docx'

# ── Section B: Run flutter test --coverage ──────────────────────────────────
if (-not $SkipTests) {
    Write-Host 'Running flutter test --coverage ...'
    Push-Location $ProjectDir
    flutter test --coverage
    Pop-Location
}

if (-not (Test-Path $LcovFile)) {
    Write-Error 'coverage\lcov.info not found. Run without -SkipTests first.'
    exit 1
}

# ── Section C: Parse lcov.info ───────────────────────────────────────────────
$lcovLines = Get-Content $LcovFile

$records  = @()
$curFile  = ''
$curLF    = 0
$curLH    = 0

foreach ($ln in $lcovLines) {
    if     ($ln -match '^SF:(.+)$')    { $curFile = $Matches[1]; $curLF = 0; $curLH = 0 }
    elseif ($ln -match '^LF:(\d+)$')   { $curLF = [int]$Matches[1] }
    elseif ($ln -match '^LH:(\d+)$')   { $curLH = [int]$Matches[1] }
    elseif ($ln -eq 'end_of_record' -and $curFile -ne '') {
        # Normalise path separators; strip absolute prefix down to lib/...
        $rel = $curFile.Replace('\', '/') -replace '^.+/lib/', 'lib/'

        if     ($rel -match '^lib/features/([^/]+)/') { $grp = "features/$($Matches[1])" }
        elseif ($rel -match '^lib/core/')              { $grp = 'core' }
        elseif ($rel -match '^lib/shared/')            { $grp = 'shared' }
        else                                           { $grp = 'root' }

        $pct = if ($curLF -gt 0) { [math]::Round($curLH / $curLF * 100.0, 1) } else { [double]0 }
        $records += [PSCustomObject]@{ File=$rel; Group=$grp; LF=$curLF; LH=$curLH; Pct=$pct }
        $curFile = ''
    }
}

if ($records.Count -eq 0) {
    Write-Error 'No records parsed from lcov.info — file may be empty or malformed.'
    exit 1
}

# Overall totals via explicit loop (avoids Measure-Object quirks in PS 5.1)
$totalLF = 0; $totalLH = 0
foreach ($r in $records) { $totalLF += $r.LF; $totalLH += $r.LH }

$overallPct = if ($totalLF -gt 0) { [math]::Round($totalLH / $totalLF * 100.0, 1) } else { [double]0 }
if ($overallPct -ge $ThresholdPct) { $passLabel = 'PASS' } else { $passLabel = 'FAIL' }

# Per-feature aggregation
$featureData = @{}
foreach ($r in $records) {
    if (-not $featureData.ContainsKey($r.Group)) {
        $featureData[$r.Group] = @{ LF=0; LH=0 }
    }
    $featureData[$r.Group].LF += $r.LF
    $featureData[$r.Group].LH += $r.LH
}
$featureGroups = $featureData.Keys | Sort-Object | ForEach-Object {
    $k   = $_
    $gLF = $featureData[$k].LF
    $gLH = $featureData[$k].LH
    $gPct = if ($gLF -gt 0) { [math]::Round($gLH / $gLF * 100.0, 1) } else { [double]0 }
    [PSCustomObject]@{ Feature=$k; LH=$gLH; LF=$gLF; Pct=$gPct }
}

$filesSorted = $records | Sort-Object File
$generatedAt = Get-Date -Format 'yyyy-MM-dd HH:mm'

# ── Section D: Write docs/coverage_report.md ────────────────────────────────
if (-not (Test-Path $DocsDir)) { New-Item -ItemType Directory -Force $DocsDir | Out-Null }

if ($passLabel -eq 'FAIL') {
    $failBlock = "> **WARNING:** Coverage $overallPct% is below the ${ThresholdPct}% threshold. Report is informational only."
} else {
    $failBlock = ''
}

$featureMdRows = ($featureGroups | ForEach-Object {
    "| $($_.Feature) | $($_.LH) | $($_.LF) | $($_.Pct)% |"
}) -join "`n"

$fileMdRows = ($filesSorted | ForEach-Object {
    "| $($_.File) | $($_.Pct)% | $($_.LH) / $($_.LF) |"
}) -join "`n"

$md = @"
# CareConnect Line Coverage Report

**Generated:** $generatedAt
**Project:** ``apps/flutter-app`` (package: ``care_connect``)
**Threshold:** ${ThresholdPct}%

---

## Overall Result: $passLabel

| Metric | Value |
|---|---|
| Lines found (LF) | $totalLF |
| Lines hit (LH) | $totalLH |
| Line coverage | **$overallPct%** |
| Threshold | ${ThresholdPct}% |
| Result | **$passLabel** |

$failBlock

---

## Per-Feature Breakdown

| Feature | Lines Hit | Lines Found | Coverage % |
|---|---|---|---|
$featureMdRows

---

## Per-File Detail

| File | Coverage % | Lines Hit / Found |
|---|---|---|
$fileMdRows

---

## How to Re-Run

``````powershell
cd "C:\Training\figmaProject\CareConnect\apps\flutter-app"
powershell -File scripts\generate_coverage_report.ps1

# Skip test re-run (re-parse existing lcov.info):
powershell -File scripts\generate_coverage_report.ps1 -SkipTests
``````
"@

Set-Content -Path $MdPath -Value $md -Encoding UTF8
Write-Host "  Markdown report -> $MdPath"

# ── Section E: Write docs/coverage_report.docx via Word COM ─────────────────
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc  = $word.Documents.Add()
    $doc.PageSetup.TopMargin    = 72
    $doc.PageSetup.BottomMargin = 72
    $doc.PageSetup.LeftMargin   = 72
    $doc.PageSetup.RightMargin  = 72

    function Add-Heading([string]$text, [int]$level) {
        $p = $doc.Content.Paragraphs.Add()
        $p.Range.Text = $text
        $p.Style = $doc.Styles.Item("Heading $level")
        $p.Range.InsertParagraphAfter()
    }
    function Add-Body([string]$text) {
        $p = $doc.Content.Paragraphs.Add()
        $p.Range.Text = $text
        $p.Style = $doc.Styles.Item('Normal')
        $p.Range.InsertParagraphAfter()
    }
    function Add-Blank() {
        $p = $doc.Content.Paragraphs.Add()
        $p.Range.InsertParagraphAfter()
    }

    # Title
    $tp = $doc.Content.Paragraphs.Add()
    $tp.Range.Text = 'CareConnect Line Coverage Report'
    $tp.Style = $doc.Styles.Item('Title')
    $tp.Range.InsertParagraphAfter()

    Add-Body "Generated: $generatedAt   |   Project: apps/flutter-app   |   Threshold: ${ThresholdPct}%"
    Add-Blank

    Add-Heading "Overall Result: $passLabel" 1
    Add-Body "Lines Found (LF):  $totalLF"
    Add-Body "Lines Hit   (LH):  $totalLH"
    Add-Body "Line Coverage:     $overallPct%"
    Add-Body "Threshold:         ${ThresholdPct}%"
    Add-Body "Result:            $passLabel"
    if ($passLabel -eq 'FAIL') {
        Add-Body "WARNING: Coverage $overallPct% is below the ${ThresholdPct}% threshold. Report is informational only."
    }
    Add-Blank

    # Per-feature table
    Add-Heading 'Per-Feature Breakdown' 1
    $ftCount = @($featureGroups).Count
    $ftTable = $doc.Tables.Add($doc.Content.Paragraphs.Add().Range, $ftCount + 1, 4)
    $ftTable.Borders.Enable = $true
    $ftTable.Cell(1,1).Range.Text = 'Feature'
    $ftTable.Cell(1,2).Range.Text = 'Lines Hit'
    $ftTable.Cell(1,3).Range.Text = 'Lines Found'
    $ftTable.Cell(1,4).Range.Text = 'Coverage %'
    for ($c = 1; $c -le 4; $c++) { $ftTable.Cell(1,$c).Range.Bold = $true }
    $r = 2
    foreach ($fg in $featureGroups) {
        $ftTable.Cell($r,1).Range.Text = $fg.Feature
        $ftTable.Cell($r,2).Range.Text = "$($fg.LH)"
        $ftTable.Cell($r,3).Range.Text = "$($fg.LF)"
        $ftTable.Cell($r,4).Range.Text = "$($fg.Pct)%"
        $r++
    }
    Add-Blank

    # Per-file table
    Add-Heading 'Per-File Detail' 1
    $pfCount = @($filesSorted).Count
    $pfTable = $doc.Tables.Add($doc.Content.Paragraphs.Add().Range, $pfCount + 1, 3)
    $pfTable.Borders.Enable = $true
    $pfTable.Cell(1,1).Range.Text = 'File'
    $pfTable.Cell(1,2).Range.Text = 'Coverage %'
    $pfTable.Cell(1,3).Range.Text = 'Lines Hit / Found'
    for ($c = 1; $c -le 3; $c++) { $pfTable.Cell(1,$c).Range.Bold = $true }
    $r = 2
    foreach ($f in $filesSorted) {
        $pfTable.Cell($r,1).Range.Text = $f.File
        $pfTable.Cell($r,2).Range.Text = "$($f.Pct)%"
        $pfTable.Cell($r,3).Range.Text = "$($f.LH) / $($f.LF)"
        $r++
    }
    Add-Blank

    Add-Heading 'How to Re-Run' 1
    Add-Body 'From apps\flutter-app directory:'
    Add-Body '  powershell -File scripts\generate_coverage_report.ps1'
    Add-Body 'Re-parse existing lcov.info (skip re-running tests):'
    Add-Body '  powershell -File scripts\generate_coverage_report.ps1 -SkipTests'

    $doc.SaveAs2($DocxPath, 16)
    $doc.Close()
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    Write-Host "  DOCX report     -> $DocxPath"
}
catch {
    Write-Warning "Word COM failed: $_"
    Write-Warning 'DOCX report skipped. Markdown report was still written.'
}

# ── Summary ──────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host "Result: $passLabel  ($overallPct% / threshold ${ThresholdPct}%)"
Write-Host "Files parsed:  $($records.Count)"
Write-Host "Lines found:   $totalLF"
Write-Host "Lines hit:     $totalLH"
