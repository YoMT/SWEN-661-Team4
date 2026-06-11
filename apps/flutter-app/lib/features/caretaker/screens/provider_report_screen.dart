import 'package:flutter/material.dart';
import '../models/care_report_model.dart';
import '../../ai_assistant/widgets/assistant_drawer.dart';
import '../../ai_assistant/widgets/assistant_toggle_button.dart';

class ProviderReportScreen extends StatelessWidget {
  const ProviderReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final report = CareReport(
      patientName: 'Gloria Washington',
      totalDoses: 30,
      takenDoses: 28,
      missedDoses: 2,
      symptomSummary: 'Mild tremor observed. Mobility stable.',
      nextAppointment: 'June 15, 2026 - Neurology Clinic',
    );

    return Scaffold(
      appBar: AppBar(title: const Text('Provider Report')),
      floatingActionButton: const AssistantToggleButton(),
      endDrawer: const AssistantDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            Text(
              'Care Report for ${report.patientName}',
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 20),

            _ReportCard(
              title: 'Medication Adherence',
              value: '${report.adherenceRate.toStringAsFixed(1)}%',
              icon: Icons.medication,
            ),

            _ReportCard(
              title: 'Doses Taken',
              value: '${report.takenDoses} of ${report.totalDoses}',
              icon: Icons.check_circle,
            ),

            _ReportCard(
              title: 'Missed Doses',
              value: '${report.missedDoses}',
              icon: Icons.warning,
            ),

            _ReportCard(
              title: 'Symptom Summary',
              value: report.symptomSummary,
              icon: Icons.health_and_safety,
            ),

            _ReportCard(
              title: 'Next Appointment',
              value: report.nextAppointment,
              icon: Icons.calendar_month,
            ),

            const SizedBox(height: 24),

            SizedBox(
              height: 64,
              child: ElevatedButton.icon(
                onPressed: () => _showShareConfirmation(context),
                icon: const Icon(Icons.share),
                label: const Text(
                  'Share with Care Team',
                  style: TextStyle(fontSize: 18),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  static void _showShareConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Share Report'),
        content: const Text(
          'Do you want to share this report with the care team?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          const SizedBox(width: 80),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Report shared with care team.'),
                  duration: Duration(seconds: 30),
                ),
              );
            },
            child: const Text('Share'),
          ),
        ],
      ),
    );
  }
}

class _ReportCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;

  const _ReportCard({
    required this.title,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        minVerticalPadding: 20,
        leading: Icon(icon, size: 32),
        title: Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Text(value, style: const TextStyle(fontSize: 16)),
        ),
      ),
    );
  }
}
