import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class RescheduleButton extends StatelessWidget {
  const RescheduleButton({super.key});

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () => context.go('/appointments/reschedule'),
      child: const Text('Reschedule'),
    );
  }
}
