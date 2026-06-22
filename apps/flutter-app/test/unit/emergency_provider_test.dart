import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/emergency/providers/emergency_provider.dart';
import 'package:care_connect/features/emergency/models/emergency_contact_model.dart';

EmergencyContactModel _contact(String id) {
  final now = DateTime.now();
  return EmergencyContactModel(
    id: id,
    createdAt: now,
    updatedAt: now,
    name: 'Test Person',
    phone: '(555) 000-0000',
    relationship: 'Friend',
  );
}

void main() {
  late EmergencyProvider provider;

  setUp(() => provider = EmergencyProvider());

  test('is seeded with emergency contacts', () {
    expect(provider.contacts, isNotEmpty);
  });

  test('setIncidentNote updates the note', () {
    provider.setIncidentNote('Fell in the kitchen');
    expect(provider.incidentNote, 'Fell in the kitchen');
  });

  test('add appends a contact', () async {
    final before = provider.contacts.length;
    await provider.add(_contact('new-1'));
    expect(provider.contacts.length, before + 1);
    expect(provider.contacts.any((c) => c.id == 'new-1'), isTrue);
  });

  test('remove deletes the contact with the given id', () async {
    await provider.add(_contact('to-remove'));
    await provider.remove('to-remove');
    expect(provider.contacts.any((c) => c.id == 'to-remove'), isFalse);
  });

  test('saveIncident clears the note when finished', () async {
    provider.setIncidentNote('Something happened');
    await provider.saveIncident();
    expect(provider.incidentNote, '');
    expect(provider.errorMessage, isNull);
  });
}
