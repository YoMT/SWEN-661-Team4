import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/emergency/models/emergency_contact_model.dart';

EmergencyContactModel _contact(String name) {
  final now = DateTime(2024, 1, 1);
  return EmergencyContactModel(
    id: '1',
    createdAt: now,
    updatedAt: now,
    name: name,
    phone: '555-0100',
    relationship: 'Child',
  );
}

void main() {
  group('EmergencyContactModel.initials', () {
    test('two-word name → first letters uppercased', () {
      expect(_contact('Alice Johnson').initials, 'AJ');
    });

    test('single name → first letter only', () {
      expect(_contact('Bob').initials, 'B');
    });

    test('empty name → question mark fallback', () {
      expect(_contact('').initials, '?');
    });

    test('three-word name → uses first and last word', () {
      expect(_contact('Mary Ann Lee').initials, 'ML');
    });

    test('name is uppercased regardless of input case', () {
      expect(_contact('alice jones').initials, 'AJ');
    });
  });
}
