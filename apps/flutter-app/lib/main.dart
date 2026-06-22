import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'app.dart';
import 'core/router/app_router.dart';
import 'features/auth/providers/auth_provider.dart';
import 'features/dashboard/providers/dashboard_provider.dart';
import 'features/medication/providers/medication_provider.dart';
import 'features/appointments/providers/appointment_provider.dart';
import 'features/symptoms/providers/symptom_provider.dart';
import 'features/accessibility/providers/accessibility_provider.dart';
import 'features/emergency/providers/emergency_provider.dart';
import 'features/caretaker/providers/caretaker_provider.dart';
import 'features/profile/providers/profile_provider.dart';
import 'features/ai_assistant/providers/ai_assistant_provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  // Single auth instance shared between the provider tree and the router's
  // redirect guard, so a restored session lands the user on the dashboard.
  final auth = AuthProvider(prefs);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: auth),
        ChangeNotifierProvider(create: (_) => DashboardProvider()),
        ChangeNotifierProvider(create: (_) => MedicationProvider()),
        ChangeNotifierProvider(create: (_) => AppointmentProvider()),
        ChangeNotifierProvider(create: (_) => SymptomProvider()),
        ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
        ChangeNotifierProvider(create: (_) => EmergencyProvider()),
        ChangeNotifierProvider(create: (_) => CaretakerProvider()),
        ChangeNotifierProvider(create: (_) => ProfileProvider()),
        ChangeNotifierProvider(create: (_) => AiAssistantProvider()),
      ],
      child: CareConnectApp(router: AppRouter.create(auth)),
    ),
  );
}
