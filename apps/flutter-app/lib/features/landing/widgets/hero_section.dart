import 'package:flutter/material.dart';

class HeroSection extends StatelessWidget {
  const HeroSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: Image.asset(
        'assets/images/hero_photo.jpg',
        fit: BoxFit.cover,
        width: double.infinity,
        height: double.infinity,
        semanticLabel: 'A caregiver and elderly woman sharing a warm moment',
      ),
    );
  }
}
