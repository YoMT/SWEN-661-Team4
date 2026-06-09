import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../medication/providers/medication_provider.dart';
import '../../medication/models/medication_model.dart';
import '../../accessibility/providers/accessibility_provider.dart';
import '../../../core/theme/app_colors.dart';

class MedicationReminderCard extends StatelessWidget {
  const MedicationReminderCard({super.key});

  Future<void> _markTaken(BuildContext context, String id) async {
    final a11y = context.read<AccessibilityProvider>();
    if (a11y.confirmActions) {
      final confirmed = await _showConfirm(context);
      if (!confirmed) return;
    }
    if (context.mounted) {
      await context.read<MedicationProvider>().markAsTaken(id);
    }
  }

  Future<bool> _showConfirm(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Mark as taken?'),
            content: const Text('This will record the dose as given.'),
            actions: [
              // ≥80px separation between Cancel and Confirm (Pillar 2)
              TextButton(
                onPressed: () => Navigator.pop(ctx, false),
                style: TextButton.styleFrom(minimumSize: const Size(88, 52)),
                child: const Text('Cancel'),
              ),
              const SizedBox(width: 80),
              FilledButton(
                onPressed: () => Navigator.pop(ctx, true),
                style: FilledButton.styleFrom(minimumSize: const Size(88, 52)),
                child: const Text('Confirm'),
              ),
            ],
          ),
        ) ??
        false;
  }

  @override
  Widget build(BuildContext context) {
    final meds = context.watch<MedicationProvider>();
    final next = meds.nextDue;

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
              const Text('Up next',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
              const Spacer(),
              if (next?.status == DoseStatus.dueNow)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.warning.withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.schedule, size: 13, color: AppColors.onWarning),
                      const SizedBox(width: 4),
                      Text('Due now',
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppColors.onWarning)),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          if (next == null)
            const Text('All doses taken for now.  ✓',
                style: TextStyle(fontSize: 15, color: AppColors.textMuted))
          else ...[
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
                      Text('${next.name} ${next.dosage}',
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
                      Text(next.instruction,
                          style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
                    ],
                  ),
                ),
                Flexible(
                  child: Text(next.scheduledTime,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textMuted)),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Semantics(
              label: 'Mark ${next.name} as taken',
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: FilledButton.icon(
                  onPressed: () => _markTaken(context, next.id),
                  icon: const Icon(Icons.check, size: 20),
                  label: const Text('Mark as taken',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                ),
              ),
            ),
          ],
          const SizedBox(height: 4),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () => context.go('/medications'),
              child: const Text('View all medications',
                  style: TextStyle(fontSize: 13, color: AppColors.primary)),
            ),
          ),
        ],
      ),
    );
  }
}
