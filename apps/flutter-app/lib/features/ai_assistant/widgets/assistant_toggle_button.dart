import 'package:flutter/material.dart';

class AssistantToggleButton extends StatelessWidget {
  const AssistantToggleButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Open Peggy assistant',
      button: true,
      child: FloatingActionButton(
        onPressed: () => Scaffold.of(context).openEndDrawer(),
        tooltip: 'Open Peggy assistant',
        child: const Icon(Icons.smart_toy_outlined),
      ),
    );
  }
}
