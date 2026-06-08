import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/symptom_provider.dart';
import '../../../core/theme/app_colors.dart';

class SeveritySelector extends StatelessWidget {
  const SeveritySelector({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SymptomProvider>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('How severe? (${provider.severity} of 5)',
            style: const TextStyle(
                fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
        const SizedBox(height: 14),
        // Number button row — 56×56 per spec (stepper alternative)
        Row(
          children: List.generate(5, (i) {
            final val = i + 1;
            final selected = provider.severity == val;
            return Expanded(
              child: Padding(
                padding: EdgeInsets.only(right: i < 4 ? 8 : 0),
                child: Semantics(
                  label: 'Severity $val',
                  selected: selected,
                  button: true,
                  child: GestureDetector(
                    onTap: () => context.read<SymptomProvider>().setSeverity(val),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 120),
                      height: 56,
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
