import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class JoinVideoButton extends StatelessWidget {
  const JoinVideoButton({super.key});

  @override
  Widget build(BuildContext context) {
    return FilledButton.icon(
      onPressed: () => context.go('/appointments/video'),
      icon: const Icon(Icons.videocam, size: 16),
      label: const Text('Join'),
    );
  }
}
