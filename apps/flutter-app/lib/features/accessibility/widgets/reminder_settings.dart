import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';
import '../../../core/theme/app_colors.dart';

class ReminderSettings extends StatelessWidget {
  const ReminderSettings({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AccessibilityProvider>();
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderSubtle, width: 1.5),
      ),
      child: Column(
        children: [
          Semantics(
            toggled: provider.highContrast,
            label: 'High contrast',
            child: SwitchListTile(
              title: const Text('High contrast',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: AppColors.text)),
              subtitle: const Text('Stronger borders & text',
                  style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
              value: provider.highContrast,
              onChanged: (_) => provider.toggleHighContrast(),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(12))),
            ),
          ),
          const Divider(height: 1, color: AppColors.borderSubtle),
          Semantics(
            toggled: provider.reduceMotion,
            label: 'Reduce motion',
            child: SwitchListTile(
              title: const Text('Reduce motion',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: AppColors.text)),
              subtitle: const Text('Fade only · on by default',
                  style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
              value: provider.reduceMotion,
              onChanged: (_) => provider.toggleReduceMotion(),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            ),
          ),
          const Divider(height: 1, color: AppColors.borderSubtle),
          Semantics(
            toggled: provider.readAloud,
            label: 'Read aloud',
            child: SwitchListTile(
              title: const Text('Read aloud',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: AppColors.text)),
              subtitle: const Text('Speak labels & reminders',
                  style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
              value: provider.readAloud,
              onChanged: (_) => provider.toggleReadAloud(),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(12))),
            ),
          ),
        ],
      ),
    );
  }
}
