import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';
import '../../../core/theme/app_colors.dart';

class SteadinessSettings extends StatelessWidget {
  const SteadinessSettings({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AccessibilityProvider>();
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderSubtle, width: 1.5),
      ),
      child: Material(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        clipBehavior: Clip.antiAlias,
        child: Column(
        children: [
          _ToggleTile(
            title: 'Tremor Mode',
            subtitle: 'Larger targets · 60px floor',
            value: provider.tremorMode,
            onChanged: (_) => provider.toggleTremorMode(),
            isFirst: true,
          ),
          const Divider(height: 1, color: AppColors.borderSubtle),
          _ToggleTile(
            title: 'Confirm important actions',
            subtitle: 'Two-step confirm for dose marking',
            value: provider.confirmActions,
            onChanged: (_) => provider.toggleConfirmActions(),
            isFirst: false,
          ),
        ],
        ),
      ),
    );
  }
}

class _ToggleTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;
  final bool isFirst;

  const _ToggleTile({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
    required this.isFirst,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      toggled: value,
      label: title,
      child: SwitchListTile(
        title: Text(title,
            style: const TextStyle(
                fontSize: 15, fontWeight: FontWeight.w500, color: AppColors.text)),
        subtitle: Text(subtitle,
            style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
        value: value,
        onChanged: onChanged,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        shape: isFirst
            ? const RoundedRectangleBorder(
                borderRadius: BorderRadius.vertical(top: Radius.circular(12)))
            : null,
      ),
    );
  }
}
