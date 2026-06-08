import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../appointments/providers/appointment_provider.dart';
import '../../../core/theme/app_colors.dart';

class UpcomingAppointmentCard extends StatelessWidget {
  const UpcomingAppointmentCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Emergency contacts button
        Semantics(
          label: 'Emergency contacts',
          button: true,
          child: GestureDetector(
            onTap: () => context.go('/emergency'),
            child: Container(
              width: double.infinity,
              height: 56,
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.error.withValues(alpha: 0.6), width: 1.5),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.phone_outlined, color: AppColors.error, size: 20),
                  SizedBox(width: 10),
                  Text('Emergency contacts',
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.error)),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),
        const Align(
          alignment: Alignment.centerLeft,
          child: Text('Manage care',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
        ),
        const SizedBox(height: 12),
        _ManageCareRow(
          icon: Icons.calendar_month_outlined,
          title: 'Appointments',
          subtitle: _appointmentSubtitle(context),
          onTap: () => context.go('/appointments'),
        ),
        const SizedBox(height: 10),
        _ManageCareRow(
          icon: Icons.show_chart,
          title: 'Symptom Log',
          subtitle: 'Last entry · yesterday',
          onTap: () => context.go('/symptoms'),
        ),
      ],
    );
  }

  String _appointmentSubtitle(BuildContext context) {
    final appt = context.watch<AppointmentProvider>().nextAppointment;
    if (appt == null) return 'No upcoming appointments';
    final h = appt.dateTime.hour;
    final m = appt.dateTime.minute.toString().padLeft(2, '0');
    final ampm = h >= 12 ? 'PM' : 'AM';
    final h12 = h > 12 ? h - 12 : (h == 0 ? 12 : h);
    return '${appt.doctorName} — today, $h12:$m $ampm';
  }
}

class _ManageCareRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _ManageCareRow({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: title,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderSubtle, width: 1.5),
          ),
          child: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.surfaceAlt,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: AppColors.primary, size: 20),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        style: const TextStyle(
                            fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.text)),
                    Text(subtitle,
                        style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: AppColors.textMuted, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}
