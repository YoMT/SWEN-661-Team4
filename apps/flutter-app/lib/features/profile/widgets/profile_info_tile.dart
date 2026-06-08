import 'package:flutter/material.dart';

class ProfileInfoTile extends StatelessWidget {
  final String label;
  final String value;

  const ProfileInfoTile({super.key, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(label, style: Theme.of(context).textTheme.bodyMedium),
      trailing: Text(value, style: Theme.of(context).textTheme.bodyLarge),
      contentPadding: EdgeInsets.zero,
    );
  }
}
