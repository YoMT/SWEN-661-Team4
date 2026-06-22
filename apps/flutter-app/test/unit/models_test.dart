import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/medication/models/medication_model.dart';
import 'package:care_connect/features/appointments/models/appointment_model.dart';
import 'package:care_connect/features/symptoms/models/symptom_log_model.dart';
import 'package:care_connect/features/emergency/models/emergency_contact_model.dart';
import 'package:care_connect/features/caretaker/models/caretaker_note_model.dart';
import 'package:care_connect/features/profile/models/profile_model.dart';
import 'package:care_connect/features/auth/models/user_model.dart';
import 'package:care_connect/features/caretaker/models/care_report_model.dart';

void main() {
  final now = DateTime(2026, 1, 1, 9, 0);

  group('MedicationModel', () {
    final med = MedicationModel(
      id: 'm1',
      createdAt: now,
      updatedAt: now,
      name: 'Metoprolol',
      dosage: '50 mg',
      instruction: 'with food',
      scheduledTime: '8:00 AM',
      timeSlot: DoseTimeSlot.morning,
      status: DoseStatus.upcoming,
    );

    test('toJson serializes enums by name', () {
      final json = med.toJson();
      expect(json['name'], 'Metoprolol');
      expect(json['timeSlot'], 'morning');
      expect(json['status'], 'upcoming');
    });

    test('copyWith updates status and takenAt', () {
      final taken = med.copyWith(status: DoseStatus.given, takenAt: now);
      expect(taken.status, DoseStatus.given);
      expect(taken.takenAt, now);
      expect(taken.name, med.name);
    });

    test('canMarkTaken is false once given', () {
      expect(med.canMarkTaken, isTrue);
      final given = med.copyWith(status: DoseStatus.given);
      expect(given.canMarkTaken, isFalse);
    });

    test('time-slot labels', () {
      expect(DoseTimeSlot.morning.label, 'Morning');
      expect(DoseTimeSlot.afternoon.label, 'Afternoon');
      expect(DoseTimeSlot.evening.label, 'Evening');
      expect(DoseTimeSlot.night.label, 'Night');
    });
  });

  test('AppointmentModel.toJson includes core fields', () {
    final appt = AppointmentModel(
      id: 'a1',
      createdAt: now,
      updatedAt: now,
      doctorName: 'Dr. Chen',
      specialty: 'Cardiology',
      location: 'Clinic',
      dateTime: now,
      type: AppointmentType.video,
      status: AppointmentStatus.upcoming,
    );
    final json = appt.toJson();
    expect(json['doctorName'], 'Dr. Chen');
    expect(json['type'], 'video');
    expect(json['status'], 'upcoming');
  });

  test('SymptomLogModel.toJson serializes symptom by name', () {
    final log = SymptomLogModel(
      id: 's1',
      createdAt: now,
      updatedAt: now,
      symptom: SymptomType.dizzy,
      severity: 3,
      note: 'after standing',
    );
    final json = log.toJson();
    expect(json['symptom'], 'dizzy');
    expect(json['severity'], 3);
  });

  group('EmergencyContactModel.initials', () {
    EmergencyContactModel c(String name) => EmergencyContactModel(
        id: 'c', createdAt: now, updatedAt: now, name: name, phone: '1', relationship: 'r');

    test('two names → first letters', () => expect(c('Sarah Johnson').initials, 'SJ'));
    test('single name → first letter', () => expect(c('Maria').initials, 'M'));
    test('empty name → question mark', () => expect(c('').initials, '?'));
  });

  test('CaretakerNoteModel.toJson includes reply', () {
    final note = CaretakerNoteModel(
      id: 'n1',
      createdAt: now,
      updatedAt: now,
      authorName: 'Maria',
      content: 'Good morning',
      replyContent: 'Thanks',
    );
    expect(note.toJson()['replyContent'], 'Thanks');
  });

  test('ProfileModel.toJson includes allergies', () {
    final p = ProfileModel(
      id: 'p1',
      createdAt: now,
      updatedAt: now,
      name: 'Alex',
      email: 'a@b.com',
      careeName: 'Margaret',
      allergies: const ['Penicillin'],
    );
    expect(p.toJson()['allergies'], contains('Penicillin'));
  });

  test('UserModel.toJson includes id/name/email', () {
    final u = UserModel(
        id: 'u1', createdAt: now, updatedAt: now, name: 'Alex', email: 'a@b.com');
    final json = u.toJson();
    expect(json['id'], 'u1');
    expect(json['email'], 'a@b.com');
  });

  group('CareReport.adherenceRate', () {
    CareReport report(int total, int taken) => CareReport(
        patientName: 'P',
        totalDoses: total,
        takenDoses: taken,
        missedDoses: total - taken,
        symptomSummary: '-',
        nextAppointment: '-');

    test('0 doses → 0%', () => expect(report(0, 0).adherenceRate, 0));
    test('28 of 30 → ~93%', () {
      expect(report(30, 28).adherenceRate, closeTo(93.3, 0.1));
    });
    test('all taken → 100%', () => expect(report(10, 10).adherenceRate, 100));
  });
}
