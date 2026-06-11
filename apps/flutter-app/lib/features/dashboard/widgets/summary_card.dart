import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../medication/providers/medication_provider.dart';
import '../../appointments/providers/appointment_provider.dart';
import '../../symptoms/providers/symptom_provider.dart';
import '../../../core/theme/app_colors.dart';

class SummaryCard extends StatelessWidget {
  const SummaryCard({super.key});

  @override
  Widget build(BuildContext context) {
    final meds = context.watch<MedicationProvider>();
    final appts = context.watch<AppointmentProvider>();
    final symptoms = context.watch<SymptomProvider>();

    final nextAppt = appts.nextAppointment;
    final timeStr = nextAppt != null
        ? '${nextAppt.dateTime.hour > 12 ? nextAppt.dateTime.hour - 12 : nextAppt.dateTime.hour}:${nextAppt.dateTime.minute.toString().padLeft(2, '0')} ${nextAppt.dateTime.hour >= 12 ? 'PM' : 'AM'}'
        : 'None';

    return Row(
      children: [
        Expanded(
          child: _StatTile(
            icon: Icons.medication_outlined,
            value: '${meds.givenDoses} of ${meds.totalDoses}',
            label: 'Doses\ntoday',
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _StatTile(
            icon: Icons.calendar_month_outlined,
            value: timeStr,
            label: 'Next visit',
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _StatTile(
            icon: Icons.show_chart,
            value: symptoms.overallStatus,
            label: 'Symptoms',
          ),
        ),
      ],
    );
  }
}

class _StatTile extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _StatTile({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderSubtle, width: 1.5),
      ),
      child: Column(
        children: [
          Icon(icon, size: 20, color: AppColors.primary),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text),
            textAlign: TextAlign.center,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: AppColors.textMuted, height: 1.3),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
