import 'package:flutter/material.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';

class EditProfileForm extends StatefulWidget {
  const EditProfileForm({super.key});

  @override
  State<EditProfileForm> createState() => _EditProfileFormState();
}

class _EditProfileFormState extends State<EditProfileForm> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _bloodTypeController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _bloodTypeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          AppTextField(label: 'Full Name', controller: _nameController),
          const SizedBox(height: 16),
          AppTextField(label: 'Phone', controller: _phoneController, keyboardType: TextInputType.phone),
          const SizedBox(height: 16),
          AppTextField(label: 'Blood Type', controller: _bloodTypeController),
          const SizedBox(height: 24),
          AppButton(label: 'Save Changes', onPressed: () {}, width: double.infinity),
        ],
      ),
    );
  }
}
