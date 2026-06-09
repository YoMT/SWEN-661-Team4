import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/medication/providers/medication_provider.dart';
import 'package:care_connect/features/medication/models/medication_model.dart';

MedicationModel _med({
  required String id,
  DoseTimeSlot slot = DoseTimeSlot.morning,
  DoseStatus status = DoseStatus.upcoming,
}) {
  final now = DateTime.now();
  return MedicationModel(
    id: id,
    createdAt: now,
    updatedAt: now,
    name: 'Drug $id',
    dosage: '1 mg',
    instruction: 'take once',
    scheduledTime: '8:00 AM',
    timeSlot: slot,
    status: status,
  );
}

void main() {
  late MedicationProvider provider;

  setUp(() {
    provider = MedicationProvider();
    provider.medications = []; // start with empty list
  });

  group('MedicationProvider.byTimeSlot', () {
    test('two meds with different slots each appear in their own bucket', () {
      provider.medications = [
        _med(id: '1', slot: DoseTimeSlot.morning),
        _med(id: '2', slot: DoseTimeSlot.evening),
      ];
      final map = provider.byTimeSlot;

      expect(map[DoseTimeSlot.morning]?.length, 1);
      expect(map[DoseTimeSlot.evening]?.length, 1);
      expect(map[DoseTimeSlot.morning]?.first.id, '1');
      expect(map[DoseTimeSlot.evening]?.first.id, '2');
    });

    test('two meds sharing the same slot both appear in that bucket', () {
      provider.medications = [
        _med(id: '1', slot: DoseTimeSlot.morning),
        _med(id: '2', slot: DoseTimeSlot.morning),
      ];
      expect(provider.byTimeSlot[DoseTimeSlot.morning]?.length, 2);
    });

    test('returns empty map when no medications', () {
      expect(provider.byTimeSlot, isEmpty);
    });
  });

  group('MedicationProvider.nextDue', () {
    test('returns null when medications list is empty', () {
      expect(provider.nextDue, isNull);
    });

    test('returns the dueNow medication when one exists', () {
      provider.medications = [
        _med(id: '1', status: DoseStatus.dueNow),
        _med(id: '2', status: DoseStatus.upcoming),
      ];
      expect(provider.nextDue?.id, '1');
    });

    test('returns first upcoming when no dueNow medication', () {
      provider.medications = [
        _med(id: '1', status: DoseStatus.upcoming),
        _med(id: '2', status: DoseStatus.upcoming),
      ];
      expect(provider.nextDue?.id, '1');
    });

    test('excludes given medications from nextDue', () {
      provider.medications = [
        _med(id: '1', status: DoseStatus.given),
      ];
      expect(provider.nextDue, isNull);
    });
  });

  group('MedicationProvider.totalDoses / givenDoses', () {
    test('totalDoses equals the number of medications', () {
      provider.medications = [
        _med(id: '1'),
        _med(id: '2'),
        _med(id: '3'),
      ];
      expect(provider.totalDoses, 3);
    });

    test('givenDoses counts only status == given', () {
      provider.medications = [
        _med(id: '1', status: DoseStatus.given),
        _med(id: '2', status: DoseStatus.given),
        _med(id: '3', status: DoseStatus.upcoming),
      ];
      expect(provider.givenDoses, 2);
    });
  });

  group('MedicationProvider.delete', () {
    test('removes the medication with the given id', () async {
      provider.medications = [_med(id: '1'), _med(id: '2')];
      await provider.delete('1');
      expect(provider.medications.map((m) => m.id), ['2']);
    });
  });
}
