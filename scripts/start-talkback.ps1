#Requires -Version 5
# start-talkback.ps1 — Enable TalkBack and launch CareConnect in Expo Go.
# Usage: .\scripts\start-talkback.ps1
# From repo root: powershell -File scripts\start-talkback.ps1

$adb = "C:\Users\Traveler\AppData\Local\Android\Sdk\platform-tools\adb.exe"

# ── Resolve connected device serial ───────────────────────────────────────────
# Skip the "List of devices attached" header; match only lines with status "device"
$serial = & $adb devices |
    Select-Object -Skip 1 |
    Where-Object { $_ -match "^\S+\s+device$" } |
    ForEach-Object { ($_ -split "\s+")[0] } |
    Select-Object -First 1

if (-not $serial) {
    Write-Host "[ERROR] No Android device/emulator found. Start one via AVD Manager first." -ForegroundColor Red
    exit 1
}
Write-Host "Using device: $serial"

# ── Enable TalkBack ────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Enabling TalkBack..." -ForegroundColor Cyan
& $adb -s $serial shell settings put secure enabled_accessibility_services `
    "com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService"
& $adb -s $serial shell settings put secure accessibility_enabled 1
Write-Host "[OK] TalkBack enabled" -ForegroundColor Green

# ── Launch CareConnect in Expo Go ──────────────────────────────────────────────
Write-Host ""
Write-Host "Launching CareConnect in Expo Go..." -ForegroundColor Cyan

& $adb -s $serial shell am force-stop host.exp.exponent
Start-Sleep -Seconds 1
& $adb -s $serial shell input keyevent 4   | Out-Null  # KEYCODE_BACK — dismiss overlays
Start-Sleep -Milliseconds 500
& $adb -s $serial shell input keyevent 3   | Out-Null  # KEYCODE_HOME
Start-Sleep -Seconds 1
& $adb -s $serial shell am start -a android.intent.action.VIEW -d "exp://10.0.2.2:8081" host.exp.exponent | Out-Null
Write-Host "Waiting for bundle to load (15 s)..."
Start-Sleep -Seconds 15

# ── TalkBack gesture cheat-sheet ───────────────────────────────────────────────
Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Yellow
Write-Host " TalkBack Gesture Reference" -ForegroundColor Yellow
Write-Host ("=" * 50) -ForegroundColor Yellow
Write-Host "  Swipe right        Next focusable element"
Write-Host "  Swipe left         Previous focusable element"
Write-Host "  Double-tap         Activate focused element"
Write-Host "  Swipe up then down Scroll down"
Write-Host "  Swipe down then up Scroll up"
Write-Host "  Two-finger swipe   Scroll without changing focus"
Write-Host "  L-shape (right+up) Back gesture"
Write-Host ""
Write-Host "  Run 'pnpm talkback:off' when done to disable TalkBack."
Write-Host ("=" * 50) -ForegroundColor Yellow
Write-Host ""
