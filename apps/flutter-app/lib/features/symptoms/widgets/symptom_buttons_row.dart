import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/symptom_log_model.dart';
import '../providers/symptom_provider.dart';
import '../../accessibility/providers/accessibility_provider.dart';
import '../../../core/theme/app_colors.dart';

class SymptomButtonsRow extends StatelessWidget {
  const SymptomButtonsRow({super.key});

  static const _symptoms = [
    (type: SymptomType.pain, icon: Icons.show_chart, label: 'Pain'),
    (type: SymptomType.dizzy, icon: Icons.rotate_right, label: 'Dizzy'),
    (type: SymptomType.breath, icon: Icons.favorite_outline, label: 'Breath'),
    (type: SymptomType.tired, icon: Icons.person_outline, label: 'Tired'),
    (type: SymptomType.nausea, icon: Icons.warning_amber_outlined, label: 'Nausea'),
    (type: SymptomType.other, icon: Icons.add, label: 'Other'),
  ];

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SymptomProvider>();
    final tileH = context.watch<AccessibilityProvider>().symptomTileHeight;

    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      childAspectRatio: 120 / tileH,
      children: _symptoms.map((s) {
        final selected = provider.selectedSymptom == s.type;
        return Semantics(
          label: s.label,
          selected: selected,
          button: true,
          child: GestureDetector(
            onTap: () => context.read<SymptomProvider>().selectSymptom(s.type),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 120),
              decoration: BoxDecoration(
                color: selected ? AppColors.primary : AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: selected ? AppColors.primary : AppColors.borderSubtle,
                  width: 1.5,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(s.icon,
                      size: 28,
                      color: selected ? Colors.white : AppColors.primary),
                  const SizedBox(height: 6),
                  Text(s.label,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: selected ? Colors.white : AppColors.text,
                      )),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
