import 'package:flutter/material.dart';

class DosageSelector extends StatefulWidget {
  const DosageSelector({super.key});

  @override
  State<DosageSelector> createState() => _DosageSelectorState();
}

class _DosageSelectorState extends State<DosageSelector> {
  String _unit = 'mg';

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextFormField(
            decoration: const InputDecoration(labelText: 'Dosage', border: OutlineInputBorder()),
            onChanged: (_) {},
          ),
        ),
        const SizedBox(width: 8),
        DropdownButton<String>(
          value: _unit,
          items: ['mg', 'ml', 'mcg', 'tablet', 'capsule']
              .map((u) => DropdownMenuItem(value: u, child: Text(u)))
              .toList(),
          onChanged: (v) => setState(() => _unit = v ?? _unit),
        ),
      ],
    );
  }
}
