import 'package:flutter/foundation.dart';
import '../models/profile_model.dart';

class ProfileProvider extends ChangeNotifier {
  ProfileModel profile = ProfileModel(
    id: '1',
    name: 'Bobby Washington',
    email: 'bobby@example.com',
    phone: '(404) 555-0100',
    careeName: 'Eleanor Reyes',
    bloodType: 'B+',
    createdAt: DateTime(2024, 1, 1),
    updatedAt: DateTime.now(),
  );
  bool isLoading = false;

  Future<void> update(ProfileModel updated) async {
    profile = updated;
    notifyListeners();
  }
}
