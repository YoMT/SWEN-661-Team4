import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/medication/models/medication_model.dart';

MedicationModel _med({
  DoseStatus status = DoseStatus.upcoming,
  DateTime? takenAt,
}) {
  final now = DateTime.now();
  return MedicationModel(
    id: '1',
    createdAt: now,
    updatedAt: now,
    name: 'Metformin',
    dosage: '500 mg',
    instruction: '1 tablet',
    scheduledTime: '8:00 AM',
    timeSlot: DoseTimeSlot.morning,
    status: status,
    takenAt: takenAt,
  );
}

void main() {
  group('MedicationModel.canMarkTaken', () {
    test('status given → false (already taken)', () {
      expect(_med(status: DoseStatus.given).canMarkTaken, isFalse);
    });

    test('status upcoming, takenAt null → true (never taken)', () {
      expect(_med(status: DoseStatus.upcoming).canMarkTaken, isTrue);
    });

    test('status upcoming, takenAt 30 seconds ago → false (too recent)', () {
      final recentlyTaken = DateTime.now().subtract(const Duration(seconds: 30));
      expect(_med(status: DoseStatus.upcoming, takenAt: recentlyTaken).canMarkTaken, isFalse);
    });

    test('status upcoming, takenAt 2 minutes ago → true (cooldown elapsed)', () {
      final longAgo = DateTime.now().subtract(const Duration(minutes: 2));
      expect(_med(status: DoseStatus.upcoming, takenAt: longAgo).canMarkTaken, isTrue);
    });
  });

  group('MedicationModel.copyWith', () {
    test('updates status and preserves name and dosage', () {
      final original = _med(status: DoseStatus.upcoming);
      final updated = original.copyWith(status: DoseStatus.given);

      expect(updated.status, DoseStatus.given);
      expect(updated.name, 'Metformin');
      expect(updated.dosage, '500 mg');
    });

    test('updates takenAt while preserving timeSlot', () {
      final original = _med();
      final taken = DateTime(2026, 6, 9, 8, 5);
      final updated = original.copyWith(takenAt: taken);

      expect(updated.takenAt, taken);
      expect(updated.timeSlot, DoseTimeSlot.morning);
    });
  });
}
