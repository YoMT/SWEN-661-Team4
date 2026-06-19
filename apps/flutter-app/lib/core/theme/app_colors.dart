import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Core semantic roles — Team 4 / CareConnect design system
  static const Color bg = Color(0xFFF8F9FA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color text = Color(0xFF1A1A1A);
  static const Color textMuted = Color(0xFF595959);
  static const Color borderSubtle = Color(0xFFE0E0E0);
  static const Color borderStrong = Color(0xFF6B6B6B);
  static const Color primary = Color(0xFF2E5C8A);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color success = Color(0xFF4A7C59);
  static const Color onSuccess = Color(0xFFFFFFFF);
  static const Color warning = Color(0xFFD4A574);
  static const Color onWarning = Color(0xFF1A1A1A); // amber needs dark text
  static const Color error = Color(0xFFB34040);
  static const Color onError = Color(0xFFFFFFFF);
  static const Color surfaceAlt = Color(0xFFEBF0F6); // light primary tint

  // Aliases kept for backward compat with existing stubs
  static const Color background = bg;
  static const Color textPrimary = text;
  static const Color textSecondary = textMuted;
  static const Color divider = borderSubtle;
}
