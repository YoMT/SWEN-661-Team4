import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/caretaker_provider.dart';
import '../../medication/providers/medication_provider.dart';
import '../../symptoms/providers/symptom_provider.dart';
import '../../appointments/providers/appointment_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/widgets/loading_indicator.dart';

class CaretakerNotesScreen extends StatelessWidget {
  const CaretakerNotesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final caretaker = context.watch<CaretakerProvider>();
    final meds = context.watch<MedicationProvider>();
    final symptoms = context.watch<SymptomProvider>();
    final appts = context.watch<AppointmentProvider>();

    final adherencePct = meds.totalDoses == 0
        ? 0
        : (meds.givenDoses / meds.totalDoses * 100).round();

    if (caretaker.isLoading) {
      return Scaffold(
        backgroundColor: AppColors.bg,
        appBar: AppBar(title: const Text('Provider Report')),
        body: const LoadingIndicator(),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(title: const Text('Provider Report')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (caretaker.errorMessage != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, size: 16, color: AppColors.error),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(caretaker.errorMessage!,
                        style: const TextStyle(fontSize: 14, color: AppColors.error)),
                  ),
                ],
              ),
            ),
          // Period selector stub
          Container(
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.borderSubtle, width: 1.5),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: const Row(
              children: [
                Icon(Icons.calendar_month_outlined, size: 18, color: AppColors.textMuted),
                SizedBox(width: 8),
                Text('Last 30 days',
                    style: TextStyle(fontSize: 15, color: AppColors.text)),
                Spacer(),
                Icon(Icons.keyboard_arrow_down, color: AppColors.textMuted),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Medication adherence
          _ReportCard(
            title: 'Medication adherence',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text('$adherencePct%',
                        style: const TextStyle(
                            fontSize: 32, fontWeight: FontWeight.bold, color: AppColors.success)),
                    const SizedBox(width: 10),
                    Text('${meds.givenDoses} of ${meds.totalDoses} doses',
                        style: const TextStyle(fontSize: 14, color: AppColors.textMuted)),
                  ],
                ),
                const SizedBox(height: 16),
                // Mock bar chart
                SizedBox(
                  height: 80,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      for (final pct in [0.6, 0.75, 0.5, 0.85, 0.7, 0.8, 0.9, 1.0])
                        Expanded(
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 2),
                            height: 80 * pct,
                            decoration: BoxDecoration(
                              color: pct == 1.0 ? AppColors.success : AppColors.borderSubtle,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Symptoms
          _ReportCard(
            title: 'Symptoms reported',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${symptoms.logs.length} entries',
                    style: const TextStyle(fontSize: 14, color: AppColors.textMuted)),
                const SizedBox(height: 16),
                SizedBox(
                  height: 60,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      for (final pct in [0.3, 0.5, 0.4, 0.6, 0.3, 0.5, 0.7, 0.9])
                        Expanded(
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 2),
                            height: 60 * pct,
                            decoration: BoxDecoration(
                              color: pct == 0.9 ? AppColors.primary : AppColors.borderSubtle,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Appointments
          _ReportCard(
            title: 'Appointments',
            child: Text(
              '${appts.todayAppointments.length} attended · ${appts.upcomingAppointments.length} upcoming · 0 missed',
              style: const TextStyle(fontSize: 14, color: AppColors.textMuted),
            ),
          ),

          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: OutlinedButton.icon(
              icon: const Icon(Icons.share_outlined),
              label: const Text('Share with provider'),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Share report — coming soon')),
                );
              },
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _ReportCard extends StatelessWidget {
  final String title;
  final Widget child;

  const _ReportCard({required this.title, required this.child});

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
          Text(title,
              style: const TextStyle(
                  fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}
