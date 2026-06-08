import 'package:flutter/material.dart';
import '../models/profile_model.dart';

class ProfileHeader extends StatelessWidget {
  final ProfileModel profile;

  const ProfileHeader({super.key, required this.profile});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CircleAvatar(
          radius: 48,
          backgroundImage: profile.photoUrl != null ? NetworkImage(profile.photoUrl!) : null,
          child: profile.photoUrl == null ? Text(profile.name[0].toUpperCase(), style: const TextStyle(fontSize: 32)) : null,
        ),
        const SizedBox(height: 12),
        Text(profile.name, style: Theme.of(context).textTheme.headlineMedium),
        Text(profile.email, style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
