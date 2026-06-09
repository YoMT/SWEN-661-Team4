import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/profile/screens/profile_screen.dart';
import 'package:care_connect/features/profile/screens/edit_profile_screen.dart';
import 'package:care_connect/features/profile/providers/profile_provider.dart';
import 'package:care_connect/features/profile/models/profile_model.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'mocks.dart';

ProfileModel _fakeProfile({
  String name = 'Bobby Washington',
  String email = 'bobby@example.com',
  String? careeName = 'Eleanor Reyes',
}) {
  return ProfileModel(
    id: '1',
    name: name,
    email: email,
    phone: '(404) 555-0100',
    careeName: careeName,
    bloodType: 'B+',
    createdAt: DateTime(2024, 1, 1),
    updatedAt: DateTime(2024, 6, 1),
  );
}

Widget _buildProfileSubject(MockProfileProvider mockProfile) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<ProfileProvider>.value(value: mockProfile),
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
    ],
    child: const MaterialApp(home: ProfileScreen()),
  );
}

Widget _buildEditSubject() {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
    ],
    child: const MaterialApp(home: EditProfileScreen()),
  );
}

void main() {
  group('ProfileScreen — MockProfileProvider', () {
    late MockProfileProvider mockProfile;

    setUp(() {
      mockProfile = MockProfileProvider();
      when(() => mockProfile.profile).thenReturn(_fakeProfile());
      when(() => mockProfile.isLoading).thenReturn(false);
    });

    testWidgets('renders Profile app bar', (tester) async {
      await tester.pumpWidget(_buildProfileSubject(mockProfile));
      await tester.pumpAndSettle();
      expect(find.text('Profile'), findsOneWidget);
    });

    testWidgets('shows caregiver name from mock', (tester) async {
      await tester.pumpWidget(_buildProfileSubject(mockProfile));
      await tester.pumpAndSettle();
      expect(find.text('Bobby Washington'), findsWidgets);
    });

    testWidgets('shows Caregiver role label', (tester) async {
      await tester.pumpWidget(_buildProfileSubject(mockProfile));
      await tester.pumpAndSettle();
      expect(find.text('Caregiver'), findsOneWidget);
    });

    testWidgets('shows Caring for section when careeName is set', (tester) async {
      await tester.pumpWidget(_buildProfileSubject(mockProfile));
      await tester.pumpAndSettle();
      expect(find.text('Caring for', skipOffstage: false), findsOneWidget);
    });

    testWidgets('shows care recipient name', (tester) async {
      await tester.pumpWidget(_buildProfileSubject(mockProfile));
      await tester.pumpAndSettle();
      expect(find.text('Eleanor Reyes', skipOffstage: false), findsOneWidget);
    });

    testWidgets('hides Caring for section when careeName is null', (tester) async {
      when(() => mockProfile.profile).thenReturn(_fakeProfile(careeName: null));
      await tester.pumpWidget(_buildProfileSubject(mockProfile));
      await tester.pumpAndSettle();
      expect(find.text('Caring for'), findsNothing);
    });
  });

  group('EditProfileScreen', () {
    testWidgets('renders Edit Profile app bar', (tester) async {
      await tester.pumpWidget(_buildEditSubject());
      await tester.pumpAndSettle();
      expect(find.text('Edit Profile'), findsOneWidget);
    });

    testWidgets('renders Save Changes button', (tester) async {
      await tester.pumpWidget(_buildEditSubject());
      await tester.pumpAndSettle();
      expect(find.text('Save Changes', skipOffstage: false), findsOneWidget);
    });
  });
}
