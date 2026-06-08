import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../features/accessibility/providers/accessibility_provider.dart';

class MainScaffold extends StatelessWidget {
  final Widget child;

  const MainScaffold({super.key, required this.child});

  static const _navItems = [
    (icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Home', route: '/dashboard'),
    (icon: Icons.medication_outlined, activeIcon: Icons.medication, label: 'Meds', route: '/medications'),
    (icon: Icons.calendar_month_outlined, activeIcon: Icons.calendar_month, label: 'Schedule', route: '/appointments'),
    (icon: Icons.monitor_heart_outlined, activeIcon: Icons.monitor_heart, label: 'Symptoms', route: '/symptoms'),
    (icon: Icons.person_outline, activeIcon: Icons.person, label: 'Profile', route: '/profile'),
  ];

  int _selectedIndex(BuildContext context) {
    final loc = GoRouterState.of(context).uri.path;
    for (int i = 0; i < _navItems.length; i++) {
      if (loc.startsWith(_navItems[i].route)) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final a11y = context.watch<AccessibilityProvider>();
    final navHeight = a11y.navItemHeight;

    return Scaffold(
      body: child,
      bottomNavigationBar: Semantics(
        label: 'Main navigation',
        child: NavigationBar(
          height: navHeight,
          selectedIndex: _selectedIndex(context),
          onDestinationSelected: (i) => context.go(_navItems[i].route),
          destinations: _navItems
              .map((item) => NavigationDestination(
                    icon: Icon(item.icon),
                    selectedIcon: Icon(item.activeIcon),
                    label: item.label,
                    tooltip: item.label,
                  ))
              .toList(),
        ),
      ),
    );
  }
}
