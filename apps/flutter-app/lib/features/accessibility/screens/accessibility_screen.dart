import 'package:flutter/material.dart';
import '../widgets/text_display_settings.dart';
import '../widgets/steadiness_settings.dart';
import '../widgets/reminder_settings.dart';
import '../../../core/theme/app_colors.dart';

class AccessibilityScreen extends StatelessWidget {
  const AccessibilityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(title: const Text('Accessibility')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          TextDisplaySettings(),
          SizedBox(height: 8),
          _SectionHeader('Display & motion'),
          SteadinessSettings(),
          SizedBox(height: 8),
          _SectionHeader('Steadiness'),
          ReminderSettings(),
          SizedBox(height: 24),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader(this.title);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(title,
          style: const TextStyle(
              fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
    );
  }
}
