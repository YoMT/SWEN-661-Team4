import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/validators.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = context.read<AuthProvider>();
    final ok = await auth.login(_emailController.text.trim(), _passwordController.text);
    if (mounted && ok) context.go('/dashboard');
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle, width: 1.5),
      ),
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Sign in',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.text)),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Email address',
              hint: 'you@example.com',
              controller: _emailController,
              validator: Validators.email,
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Password',
              hint: 'Enter your password',
              controller: _passwordController,
              validator: Validators.password,
              obscureText: _obscurePassword,
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                  color: AppColors.textMuted,
                ),
                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
              ),
            ),
            if (auth.errorMessage != null) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.error_outline, size: 16, color: AppColors.error),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(auth.errorMessage!,
                        style: const TextStyle(fontSize: 14, color: AppColors.error)),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 20),
            AppButton(
              label: 'Sign In',
              onPressed: _submit,
              isLoading: auth.isLoading,
              width: double.infinity,
              semanticLabel: 'Sign in to your CareConnect account',
            ),
            const SizedBox(height: 12),
            const Divider(),
            const SizedBox(height: 12),
            AppButton(
              label: 'Sign in with Biometrics',
              variant: AppButtonVariant.outline,
              icon: Icons.lock_outline,
              onPressed: () async {
                final auth = context.read<AuthProvider>();
                final router = GoRouter.of(context);
                final ok = await auth.login('demo@careconnect.app', 'biometric');
                if (mounted && ok) router.go('/dashboard');
              },
              width: double.infinity,
              semanticLabel: 'Sign in using biometric authentication',
            ),
            const SizedBox(height: 8),
            Center(
              child: TextButton(
                onPressed: () {},
                child: const Text('Forgot password?',
                    style: TextStyle(fontSize: 15, color: AppColors.primary)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
