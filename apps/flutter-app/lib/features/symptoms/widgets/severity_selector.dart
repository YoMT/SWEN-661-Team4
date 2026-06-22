import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/symptom_provider.dart';
import '../../accessibility/providers/accessibility_provider.dart';
import '../../../core/theme/app_colors.dart';

class SeveritySelector extends StatelessWidget {
  const SeveritySelector({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SymptomProvider>();
    // Wrap so the 10 targets flow onto a second row instead of shrinking below
    // the accessible touch size (Pillar 1: large interactive targets).
    final size = context.watch<AccessibilityProvider>().minTouchTarget;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('How severe? (${provider.severity} of 10)',
            style: const TextStyle(
                fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
        const SizedBox(height: 14),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: List.generate(10, (i) {
            final val = i + 1;
            final selected = provider.severity == val;
            return Semantics(
              label: 'Severity $val',
              inMutuallyExclusiveGroup: true,
              checked: selected,
              button: true,
              child: GestureDetector(
                onTap: () => context.read<SymptomProvider>().setSeverity(val),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 120),
                  width: size,
                  height: size,
                  decoration: BoxDecoration(
                    color: selected ? AppColors.primary : AppColors.surface,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: selected ? AppColors.primary : AppColors.borderSubtle,
                      width: 1.5,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      '$val',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: selected ? Colors.white : AppColors.text,
                      ),
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
        const SizedBox(height: 6),
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Mild', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
            Text('Severe', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
          ],
        ),
      ],
    );
  }
}
