import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  /// [prefs] enables session persistence (mirrors the mobile app's
  /// expo-secure-store token). When null (e.g. in widget tests) the provider
  /// behaves as an in-memory session.
  AuthProvider([this._prefs]) {
    _restoreSession();
  }

  final SharedPreferences? _prefs;
  static const String _userKey = 'cc_auth_user';

  bool isLoading = false;
  String? errorMessage;
  UserModel? _currentUser;

  UserModel? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;

  void _restoreSession() {
    final raw = _prefs?.getString(_userKey);
    if (raw == null) return;
    try {
      final m = jsonDecode(raw) as Map<String, dynamic>;
      _currentUser = UserModel(
        id: m['id'] as String,
        name: m['name'] as String,
        email: m['email'] as String,
        createdAt: DateTime.parse(m['createdAt'] as String),
        updatedAt: DateTime.parse(m['updatedAt'] as String),
      );
    } catch (_) {
      _currentUser = null;
    }
  }

  Future<void> _persistSession() async {
    final user = _currentUser;
    if (user == null) {
      await _prefs?.remove(_userKey);
    } else {
      await _prefs?.setString(_userKey, jsonEncode(user.toJson()));
    }
  }

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
      await _persistSession();
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
      await _persistSession();
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
    await _persistSession();
    notifyListeners();
  }
}
