import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

// Intentionally empty — dashboard layout moved inline to DashboardScreen.
// Kept as a no-op widget so existing imports don't break.
class QuickActionsBar extends StatelessWidget {
  const QuickActionsBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _Chip(icon: Icons.accessibility_new_outlined, label: 'Accessibility', route: '/accessibility'),
        const SizedBox(width: 10),
        _Chip(icon: Icons.assignment_outlined, label: 'Provider Report', route: '/report'),
        const SizedBox(width: 10),
        _Chip(icon: Icons.settings_outlined, label: 'Settings', route: '/profile'),
      ],
    );
  }
}

class _Chip extends StatelessWidget {
  final IconData icon;
  final String label;
  final String route;

  const _Chip({required this.icon, required this.label, required this.route});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: () => context.go(route),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 6),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppColors.borderSubtle, width: 1.5),
          ),
          child: Column(
            children: [
              Icon(icon, color: AppColors.primary, size: 22),
              const SizedBox(height: 4),
              Text(label,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted, height: 1.3)),
            ],
          ),
        ),
      ),
    );
  }
}
