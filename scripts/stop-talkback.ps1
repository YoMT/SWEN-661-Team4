#Requires -Version 5
# stop-talkback.ps1 — Disable TalkBack on the connected Android emulator.
# Usage: .\scripts\stop-talkback.ps1
# From repo root: powershell -File scripts\stop-talkback.ps1

$adb = "C:\Users\Traveler\AppData\Local\Android\Sdk\platform-tools\adb.exe"

$serial = & $adb devices |
    Select-Object -Skip 1 |
    Where-Object { $_ -match "^\S+\s+device$" } |
    ForEach-Object { ($_ -split "\s+")[0] } |
    Select-Object -First 1

if (-not $serial) {
    Write-Host "[ERROR] No Android device/emulator found." -ForegroundColor Red
    exit 1
}
Write-Host "Using device: $serial"

Write-Host ""
Write-Host "Disabling TalkBack..." -ForegroundColor Cyan
& $adb -s $serial shell settings put secure enabled_accessibility_services ""
& $adb -s $serial shell settings put secure accessibility_enabled 0
Write-Host "[OK] TalkBack disabled" -ForegroundColor Green
Write-Host ""
