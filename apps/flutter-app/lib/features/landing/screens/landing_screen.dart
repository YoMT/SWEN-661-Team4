import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/widgets/app_button.dart';
import '../widgets/hero_section.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isTablet = MediaQuery.of(context).size.width >= 600;

    return Scaffold(
      backgroundColor: const Color(0xFFF5EFE6),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: isTablet ? _buildWideLayout(context) : _buildNarrowLayout(context),
        ),
      ),
    );
  }

  Widget _buildTopBar(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(Icons.favorite_outline, color: Colors.white, size: 20),
        ),
        const SizedBox(width: 10),
        const Flexible(
          child: Text(
            'CareConnect',
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
              color: AppColors.text,
            ),
          ),
        ),
        const Spacer(),
        TextButton(
          onPressed: () => context.go('/login'),
          child: const Text('Sign in'),
        ),
      ],
    );
  }

  Widget _buildBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.favorite_outline, size: 14, color: AppColors.primary),
          SizedBox(width: 6),
          Text('Made for caregivers', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildHeadline({TextAlign align = TextAlign.start}) {
    return RichText(
      textAlign: align,
      text: const TextSpan(
        style: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: AppColors.text,
          height: 1.2,
        ),
        children: [
          TextSpan(text: 'A '),
          TextSpan(
            text: 'gentle helping hand',
            style: TextStyle(color: Color(0xFF6B4522)),
          ),
          TextSpan(text: '\nthrough every day.'),
        ],
      ),
    );
  }

  Widget _buildAiButton({bool withSubtitle = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.add, color: Colors.white, size: 18),
              SizedBox(width: 6),
              Text('Ask CareConnect',
                  style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
              SizedBox(width: 6),
              CircleAvatar(radius: 4, backgroundColor: Colors.greenAccent),
            ],
          ),
          if (withSubtitle) ...[
            const SizedBox(height: 2),
            const Text(
              'AI helper · here any time',
              style: TextStyle(color: Colors.white70, fontSize: 11),
            ),
          ],
        ],
      ),
    );
  }

  // Two-column layout for tablet / web
  Widget _buildWideLayout(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 24),
        _buildTopBar(context),
        const SizedBox(height: 16),
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Left column: text + CTAs (scrolls on short windows)
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildBadge(),
                      const SizedBox(height: 20),
                      _buildHeadline(),
                      const SizedBox(height: 16),
                      const Text(
                        'Keep track of medicines, visits, and little moments — without the worry. We\'ll remember the details so you don\'t have to.',
                        style: TextStyle(fontSize: 16, color: AppColors.textMuted, height: 1.5),
                      ),
                      const SizedBox(height: 24),
                      AppButton(
                        label: 'Get started — it\'s free',
                        icon: Icons.arrow_forward,
                        onPressed: () => context.go('/signup'),
                        width: double.infinity,
                      ),
                      const SizedBox(height: 12),
                      AppButton(
                        label: 'I already have an account',
                        variant: AppButtonVariant.outline,
                        onPressed: () => context.go('/login'),
                        width: double.infinity,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 24),
              // Right column: photo + AI button bottom-right
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Expanded(child: HeroSection()),
                    const SizedBox(height: 16),
                    _buildAiButton(withSubtitle: true),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Stacked layout for mobile
  Widget _buildNarrowLayout(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 24),
        _buildTopBar(context),
        const SizedBox(height: 16),
        _buildBadge(),
        const SizedBox(height: 20),
        _buildHeadline(),
        const SizedBox(height: 16),
        const Text(
          'Keep track of medicines, visits, and little\nmoments — without the worry.',
          style: TextStyle(fontSize: 16, color: AppColors.textMuted, height: 1.5),
        ),
        const SizedBox(height: 24),
        const Expanded(child: HeroSection()),
        const SizedBox(height: 24),
        AppButton(
          label: 'Get started — it\'s free',
          icon: Icons.arrow_forward,
          onPressed: () => context.go('/signup'),
          width: double.infinity,
        ),
        const SizedBox(height: 12),
        AppButton(
          label: 'I already have an account',
          variant: AppButtonVariant.outline,
          onPressed: () => context.go('/login'),
          width: double.infinity,
        ),
        const SizedBox(height: 24),
        Center(child: _buildAiButton()),
        const SizedBox(height: 24),
      ],
    );
  }
}
