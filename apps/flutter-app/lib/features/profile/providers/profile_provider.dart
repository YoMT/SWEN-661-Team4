import 'package:flutter/foundation.dart';
import '../models/profile_model.dart';
import '../../../core/data/seeds.dart';

class ProfileProvider extends ChangeNotifier {
  ProfileModel profile = Seeds.profile();
  bool isLoading = false;

  Future<void> update(ProfileModel updated) async {
    profile = updated;
    notifyListeners();
  }
}
