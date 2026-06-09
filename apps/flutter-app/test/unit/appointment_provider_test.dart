import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/appointments/providers/appointment_provider.dart';
import 'package:care_connect/features/appointments/models/appointment_model.dart';

AppointmentModel _appt({
  required String id,
  required DateTime dateTime,
  AppointmentStatus status = AppointmentStatus.upcoming,
}) {
  final now = DateTime.now();
  return AppointmentModel(
    id: id,
    createdAt: now,
    updatedAt: now,
    doctorName: 'Dr. Test',
    specialty: 'General',
    location: 'Clinic',
    dateTime: dateTime,
    type: AppointmentType.inPerson,
    status: status,
  );
}

void main() {
  late AppointmentProvider provider;
  late DateTime now;
  late DateTime todayNoon;
  late DateTime tomorrowNoon;
  late DateTime nextWeek;

  setUp(() {
    provider = AppointmentProvider();
    provider.appointments = []; // start with clean state
    now = DateTime.now();
    todayNoon = DateTime(now.year, now.month, now.day, 12, 0);
    tomorrowNoon = DateTime(now.year, now.month, now.day + 1, 12, 0);
    nextWeek = DateTime(now.year, now.month, now.day + 7, 10, 0);
  });

  group('AppointmentProvider.todayAppointments', () {
    test('includes an upcoming appointment scheduled for today', () {
      provider.appointments = [_appt(id: '1', dateTime: todayNoon)];
      expect(provider.todayAppointments.length, 1);
    });

    test('excludes a cancelled appointment scheduled for today', () {
      provider.appointments = [
        _appt(id: '1', dateTime: todayNoon, status: AppointmentStatus.cancelled),
      ];
      expect(provider.todayAppointments, isEmpty);
    });

    test('excludes an appointment scheduled for tomorrow', () {
      provider.appointments = [_appt(id: '1', dateTime: tomorrowNoon)];
      expect(provider.todayAppointments, isEmpty);
    });

    test('returns appointments sorted by time ascending', () {
      final late = DateTime(now.year, now.month, now.day, 16, 0);
      final early = DateTime(now.year, now.month, now.day, 9, 0);
      provider.appointments = [
        _appt(id: 'late', dateTime: late),
        _appt(id: 'early', dateTime: early),
      ];
      final result = provider.todayAppointments;
      expect(result.first.id, 'early');
      expect(result.last.id, 'late');
    });
  });

  group('AppointmentProvider.upcomingAppointments', () {
    test('includes an appointment scheduled for tomorrow', () {
      provider.appointments = [_appt(id: '1', dateTime: tomorrowNoon)];
      expect(provider.upcomingAppointments.length, 1);
    });

    test('excludes an appointment scheduled for today', () {
      provider.appointments = [_appt(id: '1', dateTime: todayNoon)];
      expect(provider.upcomingAppointments, isEmpty);
    });

    test('excludes a cancelled future appointment', () {
      provider.appointments = [
        _appt(id: '1', dateTime: nextWeek, status: AppointmentStatus.cancelled),
      ];
      expect(provider.upcomingAppointments, isEmpty);
    });
  });

  group('AppointmentProvider.nextAppointment', () {
    test('returns null when no future appointments exist', () {
      expect(provider.nextAppointment, isNull);
    });

    test('returns the earliest upcoming appointment from multiple', () {
      provider.appointments = [
        _appt(id: 'week', dateTime: nextWeek),
        _appt(id: 'tomorrow', dateTime: tomorrowNoon),
      ];
      expect(provider.nextAppointment?.id, 'tomorrow');
    });

    test('excludes past appointments', () {
      final yesterday = now.subtract(const Duration(days: 1));
      provider.appointments = [_appt(id: '1', dateTime: yesterday)];
      expect(provider.nextAppointment, isNull);
    });
  });

  group('AppointmentProvider.cancel', () {
    test('sets the target appointment status to cancelled', () async {
      provider.appointments = [
        _appt(id: '1', dateTime: tomorrowNoon),
        _appt(id: '2', dateTime: nextWeek),
      ];
      await provider.cancel('1');

      final cancelled = provider.appointments.firstWhere((a) => a.id == '1');
      expect(cancelled.status, AppointmentStatus.cancelled);
    });

    test('leaves other appointments unchanged', () async {
      provider.appointments = [
        _appt(id: '1', dateTime: tomorrowNoon),
        _appt(id: '2', dateTime: nextWeek),
      ];
      await provider.cancel('1');

      final other = provider.appointments.firstWhere((a) => a.id == '2');
      expect(other.status, AppointmentStatus.upcoming);
    });
  });
}
