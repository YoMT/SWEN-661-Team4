import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/medication_model.dart';
import '../providers/medication_provider.dart';
import '../../accessibility/providers/accessibility_provider.dart';
import '../../../core/theme/app_colors.dart';

class MedicationCard extends StatelessWidget {
  final MedicationModel medication;

  const MedicationCard({super.key, required this.medication});

  Color get _statusColor => switch (medication.status) {
        DoseStatus.dueNow => AppColors.warning,
        DoseStatus.given => AppColors.success,
        DoseStatus.missed => AppColors.error,
        DoseStatus.upcoming => AppColors.borderStrong,
      };

  String get _statusLabel => switch (medication.status) {
        DoseStatus.dueNow => 'Due now',
        DoseStatus.given => 'Given',
        DoseStatus.missed => 'Missed',
        DoseStatus.upcoming => 'Upcoming',
      };

  Future<void> _markTaken(BuildContext context) async {
    final a11y = context.read<AccessibilityProvider>();
    if (a11y.confirmActions) {
      final ok = await _confirm(context);
      if (!ok) return;
    }
    if (context.mounted) {
      await context.read<MedicationProvider>().markAsTaken(medication.id);
    }
  }

  Future<bool> _confirm(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Mark as taken?'),
            content: Text('${medication.name} ${medication.dosage} — ${medication.scheduledTime}'),
            actions: [
              TextButton(
                style: TextButton.styleFrom(minimumSize: const Size(88, 52)),
                onPressed: () => Navigator.pop(ctx, false),
                child: const Text('Cancel'),
              ),
              const SizedBox(width: 80),
              FilledButton(
                style: FilledButton.styleFrom(minimumSize: const Size(88, 52)),
                onPressed: () => Navigator.pop(ctx, true),
                child: const Text('Confirm'),
              ),
            ],
          ),
        ) ??
        false;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderSubtle, width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.surfaceAlt,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.medication, color: AppColors.primary, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${medication.name} ${medication.dosage}',
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
                    Text(medication.instruction,
                        style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
                  ],
                ),
              ),
              Text(medication.scheduledTime,
                  style: const TextStyle(
                      fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 10),
          // Status badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: _statusColor.withValues(alpha: 0.18),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.schedule, size: 12, color: _statusColor),
                const SizedBox(width: 4),
                Text(_statusLabel,
                    style: TextStyle(
                        fontSize: 12, fontWeight: FontWeight.w600, color: _statusColor)),
              ],
            ),
          ),
          // Mark as taken button (only for non-given)
          if (medication.status != DoseStatus.given) ...[
            const SizedBox(height: 12),
            Semantics(
              label: 'Mark ${medication.name} as taken',
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: FilledButton.icon(
                  onPressed: medication.canMarkTaken ? () => _markTaken(context) : null,
                  icon: const Icon(Icons.check, size: 18),
                  label: const Text('Mark as taken'),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
