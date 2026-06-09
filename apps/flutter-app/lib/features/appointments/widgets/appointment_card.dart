import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/appointment_model.dart';
import '../../../core/theme/app_colors.dart';

class AppointmentCard extends StatelessWidget {
  final AppointmentModel appointment;

  const AppointmentCard({super.key, required this.appointment});

  String _formatDateTime(DateTime dt) {
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    final now = DateTime.now();
    final isToday = dt.year == now.year && dt.month == now.month && dt.day == now.day;
    final h = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final m = dt.minute.toString().padLeft(2, '0');
    final ampm = dt.hour >= 12 ? 'PM' : 'AM';
    if (isToday) return 'Today · $h:$m $ampm';
    final wd = weekdays[dt.weekday - 1];
    return '$wd ${months[dt.month - 1]} ${dt.day} · $h:$m $ampm';
  }

  @override
  Widget build(BuildContext context) {
    final isVideo = appointment.type == AppointmentType.video;
    return Semantics(
      label: '${appointment.doctorName}, ${appointment.specialty}, ${_formatDateTime(appointment.dateTime)}',
      child: Container(
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
                const Icon(Icons.calendar_month_outlined, size: 16, color: AppColors.textMuted),
                const SizedBox(width: 6),
                Flexible(
                  child: Text(_formatDateTime(appointment.dateTime),
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
                ),
                const Spacer(),
                // Type badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isVideo
                        ? AppColors.primary.withValues(alpha: 0.12)
                        : AppColors.success.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isVideo ? Icons.videocam_outlined : Icons.place_outlined,
                        size: 13,
                        color: isVideo ? AppColors.primary : AppColors.success,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        isVideo ? 'Video' : 'In person',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: isVideo ? AppColors.primary : AppColors.success,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(appointment.doctorName,
                style: const TextStyle(
                    fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
            Text(appointment.location,
                style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
            if (isVideo) ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: OutlinedButton.icon(
                  onPressed: () => context.go('/appointments/video'),
                  icon: const Icon(Icons.videocam, size: 18),
                  label: const Text('Join video visit'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
