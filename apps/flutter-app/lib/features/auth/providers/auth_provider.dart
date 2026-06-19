import 'package:flutter/foundation.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  bool isLoading = false;
  String? errorMessage;
  UserModel? _currentUser;

  UserModel? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;

  Future<bool> login(String email, String password) async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
      await Future.delayed(const Duration(milliseconds: 800));
      if (email.isEmpty || password.isEmpty) {
        errorMessage = 'Please enter your email and password.';
        return false;
      }
      if (email != 'demo@careconnect.com' || password != 'demo123') {
        errorMessage = 'Invalid email or password.';
        return false;
      }
      _currentUser = UserModel(
        id: 'u1',
        name: 'Alex Johnson',
        email: email,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      return true;
    } catch (e) {
      errorMessage = 'Sign in failed. Please try again.';
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> signup(String name, String email, String password) async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
      await Future.delayed(const Duration(milliseconds: 800));
      if (email.isEmpty || password.isEmpty || name.isEmpty) {
        errorMessage = 'Please fill in all fields.';
        return false;
      }
      _currentUser = UserModel(
        id: '1',
        name: name,
        email: email,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      return true;
    } catch (e) {
      errorMessage = 'Sign up failed. Please try again.';
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _currentUser = null;
    notifyListeners();
  }
}
