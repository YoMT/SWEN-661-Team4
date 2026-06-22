import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

// Spinner ≤1 rev/sec per Pillar 4, no pulsing ring.
class LoadingIndicator extends StatelessWidget {
  final double size;
  final String? message;

  const LoadingIndicator({super.key, this.size = 32, this.message});

  @override
  Widget build(BuildContext context) {
    // Announced to screen readers as a single "Loading" (or message) node,
    // matching the mobile app's progressbar role + label.
    return Semantics(
      label: message ?? 'Loading',
      container: true,
      child: ExcludeSemantics(
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: size,
                height: size,
                child: const CircularProgressIndicator(
                  strokeWidth: 3,
                  color: AppColors.primary,
                  strokeCap: StrokeCap.round,
                ),
              ),
              if (message != null) ...[
                const SizedBox(height: 16),
                Text(message!, style: const TextStyle(fontSize: 15, color: AppColors.textMuted)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
