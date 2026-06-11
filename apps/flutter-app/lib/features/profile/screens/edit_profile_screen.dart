import 'package:flutter/material.dart';
import '../widgets/edit_profile_form.dart';
import '../../ai_assistant/widgets/assistant_toggle_button.dart';
import '../../ai_assistant/widgets/assistant_drawer.dart';

class EditProfileScreen extends StatelessWidget {
  const EditProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profile')),
      floatingActionButton: const AssistantToggleButton(),
      endDrawer: const AssistantDrawer(),
      body: const SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: EditProfileForm(),
      ),
    );
  }
}
