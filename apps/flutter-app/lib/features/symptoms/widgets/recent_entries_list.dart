import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/symptom_provider.dart';
import '../../../core/theme/app_colors.dart';

class RecentEntriesList extends StatelessWidget {
  const RecentEntriesList({super.key});

  String _timeAgo(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }

  @override
  Widget build(BuildContext context) {
    final logs = context.watch<SymptomProvider>().logs;
    if (logs.isEmpty) {
      return const Text('No entries yet',
          style: TextStyle(fontSize: 14, color: AppColors.textMuted));
    }
    return Column(
      children: logs.take(5).map((log) {
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(10),
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
                child: const Icon(Icons.show_chart, color: AppColors.primary, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(log.symptom.name[0].toUpperCase() + log.symptom.name.substring(1),
                        style: const TextStyle(
                            fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.text)),
                    Text(
                      'Severity ${log.severity}/5${log.note != null ? ' · ${log.note}' : ''}',
                      style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              Text(_timeAgo(log.createdAt),
                  style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
            ],
          ),
        );
      }).toList(),
    );
  }
}
