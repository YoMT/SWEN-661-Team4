import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'features/accessibility/providers/accessibility_provider.dart';
import 'shared/widgets/global_error_toast.dart';

class CareConnectApp extends StatelessWidget {
  const CareConnectApp({super.key, required this.router});

  final GoRouter router;

  @override
  Widget build(BuildContext context) {
    final accessibility = context.watch<AccessibilityProvider>();
    return MaterialApp.router(
      title: 'CareConnect',
      theme: accessibility.highContrast
          ? AppTheme.lightHighContrast
          : AppTheme.light,
      darkTheme: accessibility.highContrast
          ? AppTheme.darkHighContrast
          : AppTheme.dark,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
      // Respond to in-app text size setting (Pillar 1 / spec §3.2) and overlay
      // the app-wide error toast above every route.
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(
            context,
          ).copyWith(textScaler: TextScaler.linear(accessibility.textScale)),
          child: Stack(
            textDirection: TextDirection.ltr,
            children: [child!, const GlobalErrorToast()],
          ),
        );
      },
    );
  }
}
