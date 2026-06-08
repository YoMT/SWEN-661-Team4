import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/appointment_provider.dart';
import '../widgets/appointment_card.dart';
import '../../../core/theme/app_colors.dart';

class AppointmentScreen extends StatelessWidget {
  const AppointmentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppointmentProvider>();
    final today = provider.todayAppointments;
    final upcoming = provider.upcomingAppointments;

    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        title: const Text('Appointments'),
        actions: [
          Semantics(
            label: 'Add appointment',
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
              onPressed: () => context.go('/appointments/new'),
              tooltip: 'Add appointment',
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: (today.isEmpty && upcoming.isEmpty)
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.calendar_month_outlined, size: 64, color: AppColors.borderStrong),
                  const SizedBox(height: 16),
                  const Text('No appointments scheduled',
                      style: TextStyle(fontSize: 16, color: AppColors.textMuted)),
                  const SizedBox(height: 20),
                  FilledButton.icon(
                    onPressed: () => context.go('/appointments/new'),
                    icon: const Icon(Icons.add),
                    label: const Text('Book appointment'),
                  ),
                ],
              ),
            )
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (today.isNotEmpty) ...[
                  const Text('Today',
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
                  const SizedBox(height: 12),
                  ...today.map((a) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: AppointmentCard(appointment: a),
                      )),
                  const SizedBox(height: 8),
                ],
                if (upcoming.isNotEmpty) ...[
                  const Text('Upcoming',
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
                  const SizedBox(height: 12),
                  ...upcoming.map((a) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: AppointmentCard(appointment: a),
                      )),
                ],
              ],
            ),
    );
  }
}
