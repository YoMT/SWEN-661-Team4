import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../features/accessibility/providers/accessibility_provider.dart';
import '../../core/theme/app_colors.dart';

enum AppButtonVariant { primary, secondary, outline, text, danger }

class AppButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double? height;
  final String? semanticLabel;

  const AppButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height,
    this.semanticLabel,
  });

  @override
  State<AppButton> createState() => _AppButtonState();
}

class _AppButtonState extends State<AppButton> {
  DateTime? _lastTap;

  // 600ms debounce on primary actions — Pillar 3
  bool _canTap() {
    if (widget.variant == AppButtonVariant.text) return true;
    final now = DateTime.now();
    if (_lastTap != null && now.difference(_lastTap!) < const Duration(milliseconds: 600)) {
      return false;
    }
    _lastTap = now;
    return true;
  }

  void _handlePress() {
    if (!_canTap()) return;
    widget.onPressed?.call();
  }

  @override
  Widget build(BuildContext context) {
    final a11y = context.watch<AccessibilityProvider>();
    final h = widget.height ?? a11y.primaryButtonHeight;

    final child = widget.isLoading
        ? SizedBox(
            width: 22,
            height: 22,
            child: CircularProgressIndicator(
              strokeWidth: 2.5,
              color: widget.variant == AppButtonVariant.primary ||
                      widget.variant == AppButtonVariant.danger
                  ? Colors.white
                  : AppColors.primary,
            ),
          )
        : widget.icon != null
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(widget.icon, size: 20),
                  const SizedBox(width: 10),
                  Flexible(
                    child: Text(
                      widget.label,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              )
            : Text(widget.label);

    final callback = widget.isLoading ? null : _handlePress;

    Widget button;
    switch (widget.variant) {
      case AppButtonVariant.secondary:
        button = FilledButton.tonal(
          onPressed: callback,
          style: FilledButton.styleFrom(minimumSize: Size(double.infinity, h)),
          child: child,
        );
      case AppButtonVariant.outline:
        button = OutlinedButton(
          onPressed: callback,
          style: OutlinedButton.styleFrom(minimumSize: Size(double.infinity, h)),
          child: child,
        );
      case AppButtonVariant.text:
        button = TextButton(onPressed: callback, child: child);
      case AppButtonVariant.danger:
        button = FilledButton(
          onPressed: callback,
          style: FilledButton.styleFrom(
            backgroundColor: AppColors.error,
            foregroundColor: Colors.white,
            minimumSize: Size(double.infinity, h),
          ),
          child: child,
        );
      case AppButtonVariant.primary:
        button = FilledButton(
          onPressed: callback,
          style: FilledButton.styleFrom(minimumSize: Size(double.infinity, h)),
          child: child,
        );
    }

    return Semantics(
      label: widget.semanticLabel ?? widget.label,
      button: true,
      child: widget.width != null ? SizedBox(width: widget.width, child: button) : button,
    );
  }
}
