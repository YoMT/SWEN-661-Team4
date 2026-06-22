import '../../features/medication/models/medication_model.dart';
import '../../features/appointments/models/appointment_model.dart';
import '../../features/symptoms/models/symptom_log_model.dart';
import '../../features/emergency/models/emergency_contact_model.dart';
import '../../features/caretaker/models/caretaker_note_model.dart';
import '../../features/profile/models/profile_model.dart';

/// Centralized demo/seed data.
///
/// Kept in parity with the mobile app's runtime mock API
/// (`apps/mobile/src/services/mock-api.ts`) so the Flutter and React Native
/// builds present identical demo content. The care recipient is **Margaret
/// Johnson** and the demo account is **Alex Johnson / demo@careconnect.com**,
/// matching the mobile `DEMO_USER` / `_profile` fixtures and Peggy's scripted
/// replies.
class Seeds {
  Seeds._();

  static const String careeName = 'Margaret Johnson';
  static const String demoUserName = 'Alex Johnson';
  static const String demoEmail = 'demo@careconnect.com';
  static const String demoPassword = 'demo123';

  static DateTime _todayAt(int h, int m) {
    final d = DateTime.now();
    return DateTime(d.year, d.month, d.day, h, m);
  }

  static DateTime _hoursAgo(int n) => DateTime.now().subtract(Duration(hours: n));

  static DateTime _daysFromNow(int n, [int h = 10, int m = 0]) {
    final d = DateTime.now();
    return DateTime(d.year, d.month, d.day + n, h, m);
  }

  static ProfileModel profile() {
    final now = DateTime.now();
    return ProfileModel(
      id: 'p1',
      createdAt: now,
      updatedAt: now,
      name: demoUserName,
      email: demoEmail,
      phone: '(555) 012-3456',
      careeName: careeName,
      bloodType: 'A+',
      allergies: const ['Penicillin'],
    );
  }

  static List<MedicationModel> medications() {
    final now = DateTime.now();
    return [
      MedicationModel(
        id: 'm1',
        createdAt: now,
        updatedAt: now,
        name: 'Metoprolol',
        dosage: '50 mg',
        instruction: 'Take with water, before meals',
        scheduledTime: '8:00 AM',
        timeSlot: DoseTimeSlot.morning,
        status: DoseStatus.given,
        takenAt: _todayAt(8, 5),
      ),
      MedicationModel(
        id: 'm2',
        createdAt: now,
        updatedAt: now,
        name: 'Lisinopril',
        dosage: '10 mg',
        instruction: 'Take once daily with food',
        scheduledTime: '12:00 PM',
        timeSlot: DoseTimeSlot.afternoon,
        status: DoseStatus.dueNow,
      ),
      MedicationModel(
        id: 'm3',
        createdAt: now,
        updatedAt: now,
        name: 'Atorvastatin',
        dosage: '20 mg',
        instruction: 'Take at bedtime',
        scheduledTime: '9:00 PM',
        timeSlot: DoseTimeSlot.night,
        status: DoseStatus.upcoming,
      ),
    ];
  }

  static List<AppointmentModel> appointments() {
    final now = DateTime.now();
    return [
      AppointmentModel(
        id: 'a1',
        createdAt: now,
        updatedAt: now,
        doctorName: 'Dr. Sarah Chen',
        specialty: 'Cardiologist',
        location: 'City Heart Clinic, 200 Medical Dr',
        dateTime: _todayAt(15, 0),
        type: AppointmentType.inPerson,
        status: AppointmentStatus.upcoming,
        notes: 'Bring recent blood pressure log',
      ),
      AppointmentModel(
        id: 'a2',
        createdAt: now,
        updatedAt: now,
        doctorName: 'Dr. Michael Torres',
        specialty: 'General Practice',
        location: 'Video call — link sent by email',
        dateTime: _daysFromNow(7, 14, 0),
        type: AppointmentType.video,
        status: AppointmentStatus.upcoming,
      ),
    ];
  }

  static List<SymptomLogModel> symptomLogs() {
    return [
      SymptomLogModel(
        id: 's1',
        createdAt: _hoursAgo(2),
        updatedAt: _hoursAgo(2),
        symptom: SymptomType.dizzy,
        severity: 3,
        note: 'Brief dizzy spell after standing up',
      ),
      SymptomLogModel(
        id: 's2',
        createdAt: _hoursAgo(6),
        updatedAt: _hoursAgo(6),
        symptom: SymptomType.tired,
        severity: 4,
        note: 'Low energy since morning',
      ),
    ];
  }

  static List<EmergencyContactModel> emergencyContacts() {
    final now = DateTime.now();
    return [
      EmergencyContactModel(
        id: 'c1',
        createdAt: now,
        updatedAt: now,
        name: 'Sarah Johnson',
        phone: '(555) 234-5678',
        relationship: 'Daughter',
      ),
      EmergencyContactModel(
        id: 'c2',
        createdAt: now,
        updatedAt: now,
        name: 'Dr. Sarah Chen',
        phone: '(555) 987-6543',
        relationship: 'Primary Doctor',
      ),
    ];
  }

  static List<CaretakerNoteModel> caretakerNotes() {
    return [
      CaretakerNoteModel(
        id: 'n1',
        createdAt: _hoursAgo(4),
        updatedAt: _hoursAgo(4),
        authorName: 'Maria (Day Nurse)',
        content:
            'Margaret had a good morning. Ate breakfast well and took all morning meds. Small tremor in right hand around 10am — noted in chart.',
      ),
      CaretakerNoteModel(
        id: 'n2',
        createdAt: _hoursAgo(24),
        updatedAt: _hoursAgo(24),
        authorName: 'Maria (Day Nurse)',
        content:
            'Blood pressure was 138/85 at noon — slightly elevated. Afternoon walk cancelled due to weather. Margaret watching TV, calm and comfortable.',
        replyContent: "Thanks Maria. I'll check BP again when I arrive at 5pm.",
      ),
    ];
  }
}
