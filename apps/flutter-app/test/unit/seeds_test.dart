import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/core/data/seeds.dart';
import 'package:care_connect/features/medication/models/medication_model.dart';

void main() {
  group('Seeds parity with mobile mock-api', () {
    test('care recipient and demo account match the mobile fixtures', () {
      expect(Seeds.careeName, 'Margaret Johnson');
      expect(Seeds.demoUserName, 'Alex Johnson');
      expect(Seeds.demoEmail, 'demo@careconnect.com');
    });

    test('three medications including the ones Peggy references', () {
      final meds = Seeds.medications();
      expect(meds.length, 3);
      expect(
        meds.map((m) => m.name),
        containsAll(['Metoprolol', 'Lisinopril', 'Atorvastatin']),
      );
      expect(meds.firstWhere((m) => m.name == 'Metoprolol').status,
          DoseStatus.given);
      expect(meds.firstWhere((m) => m.name == 'Lisinopril').status,
          DoseStatus.dueNow);
    });

    test('two appointments, two contacts, two caretaker notes', () {
      expect(Seeds.appointments().length, 2);
      expect(Seeds.emergencyContacts().length, 2);
      expect(Seeds.caretakerNotes().length, 2);
    });

    test('the second caretaker note already has a reply', () {
      expect(Seeds.caretakerNotes()[1].replyContent, isNotNull);
    });

    test('profile is Alex Johnson caring for Margaret Johnson', () {
      final p = Seeds.profile();
      expect(p.name, 'Alex Johnson');
      expect(p.email, 'demo@careconnect.com');
      expect(p.careeName, 'Margaret Johnson');
      expect(p.allergies, contains('Penicillin'));
    });
  });
}
