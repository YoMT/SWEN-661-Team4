import 'package:flutter/material.dart';

class SchedulePicker extends StatefulWidget {
  const SchedulePicker({super.key});

  @override
  State<SchedulePicker> createState() => _SchedulePickerState();
}

class _SchedulePickerState extends State<SchedulePicker> {
  final List<TimeOfDay> _times = [];

  Future<void> _addTime() async {
    final picked = await showTimePicker(context: context, initialTime: TimeOfDay.now());
    if (picked != null) setState(() => _times.add(picked));
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Schedule', style: Theme.of(context).textTheme.titleMedium),
        ..._times.map((t) => ListTile(leading: const Icon(Icons.access_time), title: Text(t.format(context)))),
        TextButton.icon(onPressed: _addTime, icon: const Icon(Icons.add), label: const Text('Add time')),
      ],
    );
  }
}
