#Requires -Version 5
# run-e2e.ps1 — Run all Expo Go E2E flows with ADB bundle-reload between each.
# Usage: .\scripts\run-e2e.ps1
# From repo root: powershell -File scripts\run-e2e.ps1

$adb     = "C:\Users\Traveler\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$maestro = "C:\maestro\bin\maestro.bat"
$flowDir = "C:\Training\figmaProject\CareConnect\apps\mobile\e2e\flows-exponent"

$flows = @(
    "auth-login.yaml",
    "auth-signup.yaml",
    "dashboard-navigation.yaml",
    "medication-add.yaml",
    "symptom-log.yaml",
    "profile-journey.yaml"
)

function Start-CareConnect {
    # Force-stop Expo Go to clear React Navigation state.
    & $adb shell am force-stop host.exp.exponent
    Start-Sleep -Seconds 1
    # Dismiss any system-level overlay (e.g. Google Play Services error dialogs, SOS screens)
    # that persist across app force-stops. BACK dismisses modals; HOME returns to launcher.
    & $adb shell input keyevent 4   | Out-Null  # KEYCODE_BACK
    Start-Sleep -Milliseconds 500
    & $adb shell input keyevent 3   | Out-Null  # KEYCODE_HOME
    Start-Sleep -Seconds 1
    & $adb shell am start -a android.intent.action.VIEW -d "exp://10.0.2.2:8081" host.exp.exponent | Out-Null
    Start-Sleep -Seconds 15
}

$results = [ordered]@{}
$total   = $flows.Count

Write-Host ""
Write-Host "CareConnect E2E Suite ($total flows)"
Write-Host ("=" * 40)

foreach ($flow in $flows) {
    Write-Host ""
    Write-Host ">>> $flow"

    # Fresh bundle load for each flow
    Start-CareConnect

    $output = & $maestro test "$flowDir\$flow" 2>&1
    $passed = $LASTEXITCODE -eq 0
    $results[$flow] = $passed

    if ($passed) {
        Write-Host "[PASSED] $flow" -ForegroundColor Green
    } else {
        Write-Host "[FAILED] $flow" -ForegroundColor Red
        # Show last 5 lines of Maestro output for quick context
        $output | Select-Object -Last 5 | ForEach-Object { Write-Host "  $_" }
    }
}

# ── Summary ────────────────────────────────────────────────────────────────────
$passCount = ($results.Values | Where-Object { $_ }).Count
$failCount = $total - $passCount

Write-Host ""
Write-Host ("=" * 40)
Write-Host "Results: $passCount/$total passed"
foreach ($flow in $results.Keys) {
    $icon = if ($results[$flow]) { "[PASSED]" } else { "[FAILED]" }
    Write-Host "  $icon $flow"
}
Write-Host ""

if ($failCount -gt 0) { exit 1 } else { exit 0 }
