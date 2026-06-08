import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'app.dart';
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

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
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
      child: const CareConnectApp(),
    ),
  );
}
