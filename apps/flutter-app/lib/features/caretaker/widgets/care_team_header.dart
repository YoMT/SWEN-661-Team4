import 'package:flutter/material.dart';

class CareTeamHeader extends StatelessWidget {
  const CareTeamHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Theme.of(context).colorScheme.primaryContainer,
      child: Row(
        children: [
          const Icon(Icons.people_outline),
          const SizedBox(width: 8),
          Text('Your Care Team', style: Theme.of(context).textTheme.titleMedium),
        ],
      ),
    );
  }
}
