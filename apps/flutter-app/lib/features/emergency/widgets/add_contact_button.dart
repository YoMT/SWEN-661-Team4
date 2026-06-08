import 'package:flutter/material.dart';

class AddContactButton extends StatelessWidget {
  const AddContactButton({super.key});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.person_add_outlined),
      tooltip: 'Add Contact',
      onPressed: () {
        // TODO: show add contact dialog
      },
    );
  }
}
