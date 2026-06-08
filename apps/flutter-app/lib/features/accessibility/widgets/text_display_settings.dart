import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';
import '../models/accessibility_model.dart';
import '../../../core/theme/app_colors.dart';

class TextDisplaySettings extends StatelessWidget {
  const TextDisplaySettings({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AccessibilityProvider>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Text size',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
        const SizedBox(height: 12),
        for (final level in TextSizeLevel.values)
          _TextSizeTile(
            level: level,
            isSelected: provider.textSize == level,
            onTap: () => provider.setTextSize(level),
          ),
      ],
    );
  }
}

class _TextSizeTile extends StatelessWidget {
  final TextSizeLevel level;
  final bool isSelected;
  final VoidCallback onTap;

  static const _labels = {
    TextSizeLevel.standard: 'Standard',
    TextSizeLevel.large: 'Large',
    TextSizeLevel.largest: 'Largest',
  };

  static const _sampleSizes = {
    TextSizeLevel.standard: 16.0,
    TextSizeLevel.large: 20.0,
    TextSizeLevel.largest: 24.0,
  };

  const _TextSizeTile({required this.level, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '${_labels[level]} text size',
      selected: isSelected,
      button: true,
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 120),
          margin: const EdgeInsets.only(bottom: 8),
          height: 56,
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.borderSubtle,
              width: 1.5,
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Text(
                'Aa',
                style: TextStyle(
                  fontSize: _sampleSizes[level],
                  fontWeight: FontWeight.w600,
                  color: isSelected ? Colors.white : AppColors.text,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  _labels[level]!,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: isSelected ? Colors.white : AppColors.text,
                  ),
                ),
              ),
              if (isSelected)
                const Icon(Icons.check, color: Colors.white, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}
