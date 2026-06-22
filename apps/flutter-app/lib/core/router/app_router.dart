import 'package:go_router/go_router.dart';

import '../../features/auth/providers/auth_provider.dart';
import '../../features/landing/screens/landing_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/signup_screen.dart';
import '../../features/dashboard/screens/dashboard_screen.dart';

import '../../features/medication/screens/medication_list_screen.dart';
import '../../features/medication/screens/medication_form_screen.dart';

import '../../features/appointments/screens/appointment_screen.dart';
import '../../features/appointments/screens/new_appointment_screen.dart';
import '../../features/appointments/screens/video_visit_screen.dart';
import '../../features/appointments/screens/reschedule_screen.dart';

import '../../features/symptoms/screens/symptom_log_screen.dart';
import '../../features/accessibility/screens/accessibility_screen.dart';
import '../../features/emergency/screens/emergency_contact_screen.dart';

import '../../features/caretaker/screens/caretaker_notes_screen.dart';
import '../../features/caretaker/screens/provider_report_screen.dart';

import '../../features/profile/screens/profile_screen.dart';
import '../../features/profile/screens/edit_profile_screen.dart';

import '../../shared/widgets/main_scaffold.dart';

class AppRouter {
  static const _publicRoutes = {'/', '/login', '/signup'};

  /// Builds the app router with an auth-aware redirect, mirroring the mobile
  /// app's `(auth)` vs `(tabs)` route gating. Unauthenticated users are kept on
  /// the public routes; authenticated users are sent into the app shell.
  static GoRouter create(AuthProvider auth) => GoRouter(
    initialLocation: '/',
    refreshListenable: auth,
    redirect: (context, state) {
      final loggedIn = auth.isAuthenticated;
      final isPublic = _publicRoutes.contains(state.matchedLocation);
      if (!loggedIn && !isPublic) return '/login';
      if (loggedIn && isPublic) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (ctx, state) => const LandingScreen()),

      GoRoute(path: '/login', builder: (ctx, state) => const LoginScreen()),

      GoRoute(path: '/signup', builder: (ctx, state) => const SignupScreen()),

      ShellRoute(
        builder: (ctx, state, child) => MainScaffold(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (ctx, state) => const DashboardScreen(),
          ),

          GoRoute(
            path: '/medications',
            builder: (ctx, state) => const MedicationListScreen(),
          ),

          GoRoute(
            path: '/medications/new',
            builder: (ctx, state) => const MedicationFormScreen(),
          ),

          GoRoute(
            path: '/appointments',
            builder: (ctx, state) => const AppointmentScreen(),
            routes: [
              GoRoute(
                path: 'new',
                builder: (ctx, state) => const NewAppointmentScreen(),
              ),
              GoRoute(
                path: 'video',
                builder: (ctx, state) => const VideoVisitScreen(),
              ),
              GoRoute(
                path: 'reschedule',
                builder: (ctx, state) => const RescheduleScreen(),
              ),
            ],
          ),

          GoRoute(
            path: '/symptoms',
            builder: (ctx, state) => const SymptomLogScreen(),
          ),

          GoRoute(
            path: '/accessibility',
            builder: (ctx, state) => const AccessibilityScreen(),
          ),

          GoRoute(
            path: '/emergency',
            builder: (ctx, state) => const EmergencyContactScreen(),
          ),

          // NEW PROVIDER REPORT SCREEN
          GoRoute(
            path: '/report',
            builder: (ctx, state) => const ProviderReportScreen(),
          ),

          // KEEP EXISTING CARETAKER NOTES SCREEN
          GoRoute(
            path: '/caretaker-notes',
            builder: (ctx, state) => const CaretakerNotesScreen(),
          ),

          GoRoute(
            path: '/profile',
            builder: (ctx, state) => const ProfileScreen(),
          ),

          GoRoute(
            path: '/profile/edit',
            builder: (ctx, state) => const EditProfileScreen(),
          ),
        ],
      ),
    ],
  );
}
