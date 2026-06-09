# CareConnect Line Coverage Report

**Generated:** 2026-06-09 14:45
**Project:** `apps/flutter-app` (package: `care_connect`)
**Threshold:** 60%

---

## Overall Result: PASS

| Metric | Value |
|---|---|
| Lines found (LF) | 1669 |
| Lines hit (LH) | 1131 |
| Line coverage | **67.8%** |
| Threshold | 60% |
| Result | **PASS** |



---

## Per-Feature Breakdown

| Feature | Lines Hit | Lines Found | Coverage % |
|---|---|---|---|
| core | 0 | 14 | 0% |
| features/accessibility | 99 | 141 | 70.2% |
| features/ai_assistant | 80 | 116 | 69% |
| features/appointments | 78 | 161 | 48.4% |
| features/auth | 102 | 167 | 61.1% |
| features/caretaker | 96 | 139 | 69.1% |
| features/dashboard | 162 | 193 | 83.9% |
| features/emergency | 88 | 145 | 60.7% |
| features/landing | 51 | 65 | 78.5% |
| features/medication | 139 | 216 | 64.4% |
| features/profile | 79 | 98 | 80.6% |
| features/symptoms | 108 | 148 | 73% |
| shared | 49 | 66 | 74.2% |

---

## Per-File Detail

| File | Coverage % | Lines Hit / Found |
|---|---|---|
| lib/core/theme/app_colors.dart | 0% | 0 / 1 |
| lib/core/utils/validators.dart | 0% | 0 / 13 |
| lib/features/accessibility/models/accessibility_model.dart | 17.6% | 3 / 17 |
| lib/features/accessibility/providers/accessibility_provider.dart | 26.7% | 8 / 30 |
| lib/features/accessibility/screens/accessibility_screen.dart | 100% | 9 / 9 |
| lib/features/accessibility/widgets/reminder_settings.dart | 87.5% | 21 / 24 |
| lib/features/accessibility/widgets/steadiness_settings.dart | 92.3% | 24 / 26 |
| lib/features/accessibility/widgets/text_display_settings.dart | 97.1% | 34 / 35 |
| lib/features/ai_assistant/models/chat_message_model.dart | 0% | 0 / 1 |
| lib/features/ai_assistant/providers/ai_assistant_provider.dart | 17.6% | 3 / 17 |
| lib/features/ai_assistant/screens/ai_assistant_screen.dart | 92.9% | 13 / 14 |
| lib/features/ai_assistant/widgets/assistant_panel.dart | 81.8% | 18 / 22 |
| lib/features/ai_assistant/widgets/assistant_toggle_button.dart | 100% | 6 / 6 |
| lib/features/ai_assistant/widgets/chat_bubble.dart | 0% | 0 / 10 |
| lib/features/ai_assistant/widgets/chat_input_field.dart | 71.4% | 15 / 21 |
| lib/features/ai_assistant/widgets/typing_indicator.dart | 100% | 25 / 25 |
| lib/features/appointments/models/appointment_model.dart | 7.7% | 1 / 13 |
| lib/features/appointments/providers/appointment_provider.dart | 64% | 32 / 50 |
| lib/features/appointments/screens/appointment_screen.dart | 63.3% | 19 / 30 |
| lib/features/appointments/screens/new_appointment_screen.dart | 100% | 7 / 7 |
| lib/features/appointments/screens/reschedule_screen.dart | 100% | 8 / 8 |
| lib/features/appointments/screens/video_visit_screen.dart | 100% | 8 / 8 |
| lib/features/appointments/widgets/appointment_card.dart | 0% | 0 / 41 |
| lib/features/appointments/widgets/join_video_button.dart | 75% | 3 / 4 |
| lib/features/auth/models/user_model.dart | 0% | 0 / 10 |
| lib/features/auth/providers/auth_provider.dart | 0% | 0 / 32 |
| lib/features/auth/screens/login_screen.dart | 92.6% | 25 / 27 |
| lib/features/auth/screens/signup_screen.dart | 85.7% | 12 / 14 |
| lib/features/auth/widgets/login_form.dart | 77.4% | 41 / 53 |
| lib/features/auth/widgets/signup_form.dart | 77.4% | 24 / 31 |
| lib/features/caretaker/models/care_report_model.dart | 100% | 4 / 4 |
| lib/features/caretaker/models/caretaker_note_model.dart | 0% | 0 / 9 |
| lib/features/caretaker/providers/caretaker_provider.dart | 0% | 0 / 17 |
| lib/features/caretaker/screens/caretaker_notes_screen.dart | 95.2% | 60 / 63 |
| lib/features/caretaker/screens/provider_report_screen.dart | 69.6% | 32 / 46 |
| lib/features/dashboard/providers/dashboard_provider.dart | 0% | 0 / 6 |
| lib/features/dashboard/screens/dashboard_screen.dart | 93.3% | 28 / 30 |
| lib/features/dashboard/widgets/medication_reminder_card.dart | 68.3% | 41 / 60 |
| lib/features/dashboard/widgets/quick_actions_bar.dart | 95.2% | 20 / 21 |
| lib/features/dashboard/widgets/summary_card.dart | 100% | 31 / 31 |
| lib/features/dashboard/widgets/upcoming_appointment_card.dart | 93.3% | 42 / 45 |
| lib/features/emergency/models/emergency_contact_model.dart | 30.8% | 4 / 13 |
| lib/features/emergency/providers/emergency_provider.dart | 27.3% | 6 / 22 |
| lib/features/emergency/screens/emergency_contact_screen.dart | 65.1% | 54 / 83 |
| lib/features/emergency/widgets/contact_card.dart | 88.9% | 24 / 27 |
| lib/features/landing/screens/landing_screen.dart | 76.7% | 46 / 60 |
| lib/features/landing/widgets/hero_section.dart | 100% | 5 / 5 |
| lib/features/medication/models/medication_model.dart | 19.4% | 7 / 36 |
| lib/features/medication/providers/medication_provider.dart | 44.1% | 15 / 34 |
| lib/features/medication/screens/medication_form_screen.dart | 100% | 7 / 7 |
| lib/features/medication/screens/medication_list_screen.dart | 94% | 47 / 50 |
| lib/features/medication/widgets/dosage_selector.dart | 86.7% | 13 / 15 |
| lib/features/medication/widgets/medication_card.dart | 66.1% | 41 / 62 |
| lib/features/medication/widgets/schedule_picker.dart | 75% | 9 / 12 |
| lib/features/profile/models/profile_model.dart | 7.7% | 1 / 13 |
| lib/features/profile/providers/profile_provider.dart | 0% | 0 / 3 |
| lib/features/profile/screens/edit_profile_screen.dart | 100% | 4 / 4 |
| lib/features/profile/screens/profile_screen.dart | 93.4% | 57 / 61 |
| lib/features/profile/widgets/edit_profile_form.dart | 100% | 17 / 17 |
| lib/features/symptoms/models/symptom_log_model.dart | 11.1% | 1 / 9 |
| lib/features/symptoms/providers/symptom_provider.dart | 28.1% | 9 / 32 |
| lib/features/symptoms/screens/symptom_log_screen.dart | 95.5% | 21 / 22 |
| lib/features/symptoms/widgets/recent_entries_list.dart | 100% | 28 / 28 |
| lib/features/symptoms/widgets/save_log_button.dart | 45.5% | 5 / 11 |
| lib/features/symptoms/widgets/severity_selector.dart | 96% | 24 / 25 |
| lib/features/symptoms/widgets/symptom_buttons_row.dart | 95.2% | 20 / 21 |
| lib/shared/models/base_model.dart | 100% | 1 / 1 |
| lib/shared/widgets/app_button.dart | 66.7% | 30 / 45 |
| lib/shared/widgets/app_text_field.dart | 90% | 18 / 20 |

---

## How to Re-Run

```powershell
cd "C:\Training\figmaProject\CareConnect\apps\flutter-app"
powershell -File scripts\generate_coverage_report.ps1

# Skip test re-run (re-parse existing lcov.info):
powershell -File scripts\generate_coverage_report.ps1 -SkipTests
```
