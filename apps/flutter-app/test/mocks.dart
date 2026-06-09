import 'package:mocktail/mocktail.dart';
import 'package:care_connect/features/auth/providers/auth_provider.dart';
import 'package:care_connect/features/medication/providers/medication_provider.dart';
import 'package:care_connect/features/caretaker/providers/caretaker_provider.dart';
import 'package:care_connect/features/dashboard/providers/dashboard_provider.dart';
import 'package:care_connect/features/appointments/providers/appointment_provider.dart';
import 'package:care_connect/features/profile/providers/profile_provider.dart';
import 'package:care_connect/features/ai_assistant/providers/ai_assistant_provider.dart';

class MockAuthProvider extends Mock implements AuthProvider {}

class MockMedicationProvider extends Mock implements MedicationProvider {}

class MockCaretakerProvider extends Mock implements CaretakerProvider {}

class MockDashboardProvider extends Mock implements DashboardProvider {}

class MockAppointmentProvider extends Mock implements AppointmentProvider {}

class MockProfileProvider extends Mock implements ProfileProvider {}

class MockAiAssistantProvider extends Mock implements AiAssistantProvider {}
