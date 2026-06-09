import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/medication_provider.dart';
import '../models/medication_model.dart';
import '../widgets/medication_card.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/widgets/loading_indicator.dart';

class MedicationListScreen extends StatelessWidget {
  const MedicationListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<MedicationProvider>();
    final total = provider.totalDoses;
    final given = provider.givenDoses;
    final progress = total == 0 ? 0.0 : given / total;
    final bySlot = provider.byTimeSlot;
    final orderedSlots = DoseTimeSlot.values.where(bySlot.containsKey).toList();

    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        title: const Text('Medications'),
        actions: [
          Semantics(
            label: 'Add medication',
            child: IconButton(
              icon: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.add, color: Colors.white, size: 20),
              ),
              onPressed: () => context.go('/medications/new'),
              tooltip: 'Add medication',
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          if (provider.errorMessage != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, size: 16, color: AppColors.error),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(provider.errorMessage!,
                        style: const TextStyle(fontSize: 14, color: AppColors.error)),
                  ),
                ],
              ),
            ),
          if (provider.isLoading)
            const Expanded(child: LoadingIndicator())
          else if (provider.medications.isEmpty)
            Expanded(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.medication_outlined, size: 64, color: AppColors.borderStrong),
                    const SizedBox(height: 16),
                    const Text('No medications added',
                        style: TextStyle(fontSize: 16, color: AppColors.textMuted)),
                    const SizedBox(height: 20),
                    FilledButton.icon(
                      onPressed: () => context.go('/medications/new'),
                      icon: const Icon(Icons.add),
                      label: const Text('Add medication'),
                    ),
                  ],
                ),
              ),
            )
          else
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Today's doses progress
                  Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderSubtle, width: 1.5),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    const Text("Today's doses",
                        style: TextStyle(
                            fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.text)),
                    const Spacer(),
                    Text('$given of $total given',
                        style: const TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.success)),
                  ],
                ),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 8,
                    backgroundColor: AppColors.borderSubtle,
                    valueColor: const AlwaysStoppedAnimation<Color>(AppColors.success),
                  ),
                ),
                const SizedBox(height: 6),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    '${total - given} remaining · next at ${provider.nextDue?.scheduledTime ?? 'none'}',
                    style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Medications grouped by time slot
          for (final slot in orderedSlots) ...[
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                children: [
                  Icon(_slotIcon(slot), size: 16, color: AppColors.textMuted),
                  const SizedBox(width: 6),
                  Text(
                    '${slot.label} · ${bySlot[slot]!.first.scheduledTime}',
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textMuted),
                  ),
                ],
              ),
            ),
            for (final med in bySlot[slot]!) ...[
              MedicationCard(medication: med),
              const SizedBox(height: 10),
            ],
            const SizedBox(height: 10),
          ],
                ],
              ),
            ),
          ],
        ),
    );
  }

  IconData _slotIcon(DoseTimeSlot slot) => switch (slot) {
        DoseTimeSlot.morning => Icons.wb_sunny_outlined,
        DoseTimeSlot.afternoon => Icons.schedule,
        DoseTimeSlot.evening => Icons.nightlight_outlined,
        DoseTimeSlot.night => Icons.bedtime_outlined,
      };
}
