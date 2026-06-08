import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../../../core/utils/validators.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';

class SignupForm extends StatefulWidget {
  const SignupForm({super.key});

  @override
  State<SignupForm> createState() => _SignupFormState();
}

class _SignupFormState extends State<SignupForm> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = context.read<AuthProvider>();
    final ok = await auth.signup(_nameController.text.trim(), _emailController.text.trim(), _passwordController.text);
    if (mounted && ok) context.go('/dashboard');
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Form(
      key: _formKey,
      child: Column(
        children: [
          AppTextField(label: 'Full Name', controller: _nameController, validator: (v) => Validators.required(v, fieldName: 'Name')),
          const SizedBox(height: 16),
          AppTextField(label: 'Email', controller: _emailController, validator: Validators.email, keyboardType: TextInputType.emailAddress),
          const SizedBox(height: 16),
          AppTextField(
            label: 'Password',
            controller: _passwordController,
            validator: Validators.password,
            obscureText: _obscurePassword,
            suffixIcon: IconButton(
              icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
              onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
            ),
          ),
          if (auth.errorMessage != null) ...[
            const SizedBox(height: 12),
            Text(auth.errorMessage!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
          ],
          const SizedBox(height: 24),
          AppButton(label: 'Create Account', onPressed: _submit, isLoading: auth.isLoading, width: double.infinity),
        ],
      ),
    );
  }
}
