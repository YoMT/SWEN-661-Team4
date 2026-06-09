import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../widgets/signup_form.dart';

class SignupScreen extends StatelessWidget {
  const SignupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        title: const Text('Create Account'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/'),
          tooltip: 'Back',
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 16),
              const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.favorite_outline, color: AppColors.primary, size: 28),
                  SizedBox(width: 10),
                  Flexible(
                    child: Text('CareConnect',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.text)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text('Create your caregiver account',
                  style: TextStyle(fontSize: 15, color: AppColors.textMuted)),
              const SizedBox(height: 32),
              const SignupForm(),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Already have an account?',
                      style: TextStyle(fontSize: 14, color: AppColors.textMuted)),
                  TextButton(
                    onPressed: () => context.go('/login'),
                    child: const Text('Sign in',
                        style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.primary)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
