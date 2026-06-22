import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:care_connect/features/auth/providers/auth_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() => SharedPreferences.setMockInitialValues({}));

  test('valid demo credentials authenticate and persist the session',
      () async {
    final prefs = await SharedPreferences.getInstance();
    final auth = AuthProvider(prefs);
    expect(auth.isAuthenticated, isFalse);

    final ok = await auth.login('demo@careconnect.com', 'demo123');
    expect(ok, isTrue);
    expect(auth.isAuthenticated, isTrue);

    // A fresh provider backed by the same store restores the session on start.
    final restored = AuthProvider(prefs);
    expect(restored.isAuthenticated, isTrue);
    expect(restored.currentUser?.email, 'demo@careconnect.com');
  });

  test('invalid credentials neither authenticate nor persist', () async {
    final prefs = await SharedPreferences.getInstance();
    final auth = AuthProvider(prefs);

    final ok = await auth.login('demo@careconnect.com', 'wrong-password');
    expect(ok, isFalse);
    expect(auth.isAuthenticated, isFalse);
    expect(auth.errorMessage, isNotNull);

    expect(AuthProvider(prefs).isAuthenticated, isFalse);
  });

  test('logout clears the persisted session', () async {
    final prefs = await SharedPreferences.getInstance();
    final auth = AuthProvider(prefs);
    await auth.login('demo@careconnect.com', 'demo123');

    await auth.logout();

    expect(auth.isAuthenticated, isFalse);
    expect(AuthProvider(prefs).isAuthenticated, isFalse);
  });

  test('without prefs the provider works in-memory (no persistence)', () async {
    final auth = AuthProvider();
    final ok = await auth.login('demo@careconnect.com', 'demo123');
    expect(ok, isTrue);
    expect(auth.isAuthenticated, isTrue);
  });
}
