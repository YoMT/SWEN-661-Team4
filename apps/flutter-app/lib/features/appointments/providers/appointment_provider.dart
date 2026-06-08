import 'package:flutter/foundation.dart';
import '../models/appointment_model.dart';

class AppointmentProvider extends ChangeNotifier {
  List<AppointmentModel> appointments = _sampleAppointments();
  bool isLoading = false;

  List<AppointmentModel> get todayAppointments {
    final today = DateTime.now();
    return appointments.where((a) {
      return a.dateTime.year == today.year &&
          a.dateTime.month == today.month &&
          a.dateTime.day == today.day &&
          a.status == AppointmentStatus.upcoming;
    }).toList()
      ..sort((a, b) => a.dateTime.compareTo(b.dateTime));
  }

  List<AppointmentModel> get upcomingAppointments {
    final today = DateTime.now();
    final todayStart = DateTime(today.year, today.month, today.day);
    return appointments.where((a) {
      return a.dateTime.isAfter(todayStart.add(const Duration(days: 1))) &&
          a.status == AppointmentStatus.upcoming;
    }).toList()
      ..sort((a, b) => a.dateTime.compareTo(b.dateTime));
  }

  AppointmentModel? get nextAppointment {
    final now = DateTime.now();
    final future = appointments.where((a) =>
        a.dateTime.isAfter(now) && a.status == AppointmentStatus.upcoming);
    if (future.isEmpty) return null;
    return future.reduce((a, b) => a.dateTime.isBefore(b.dateTime) ? a : b);
  }

  Future<void> book(AppointmentModel appt) async {
    appointments = [...appointments, appt];
    notifyListeners();
  }

  Future<void> cancel(String id) async {
    final idx = appointments.indexWhere((a) => a.id == id);
    if (idx == -1) return;
    final updated = AppointmentModel(
      id: appointments[idx].id,
      createdAt: appointments[idx].createdAt,
      updatedAt: DateTime.now(),
      doctorName: appointments[idx].doctorName,
      specialty: appointments[idx].specialty,
      location: appointments[idx].location,
      dateTime: appointments[idx].dateTime,
      type: appointments[idx].type,
      status: AppointmentStatus.cancelled,
      notes: appointments[idx].notes,
    );
    appointments = List.of(appointments)..[idx] = updated;
    notifyListeners();
  }
}

List<AppointmentModel> _sampleAppointments() {
  final now = DateTime.now();
  final today2pm = DateTime(now.year, now.month, now.day, 14, 0);
  return [
    AppointmentModel(
      id: '1',
      createdAt: now,
      updatedAt: now,
      doctorName: 'Dr. Lee',
      specialty: 'Cardiology',
      location: 'Video check-in · 30 min',
      dateTime: today2pm,
      type: AppointmentType.video,
      status: AppointmentStatus.upcoming,
    ),
    AppointmentModel(
      id: '2',
      createdAt: now,
      updatedAt: now,
      doctorName: 'Riverside Lab',
      specialty: 'Lab',
      location: 'Blood draw · fasting',
      dateTime: DateTime(now.year, now.month, now.day + 4, 10, 30),
      type: AppointmentType.inPerson,
      status: AppointmentStatus.upcoming,
    ),
    AppointmentModel(
      id: '3',
      createdAt: now,
      updatedAt: now,
      doctorName: 'Dr. Okafor',
      specialty: 'Primary Care',
      location: 'Annual review',
      dateTime: DateTime(now.year, now.month, now.day + 14, 9, 0),
      type: AppointmentType.inPerson,
      status: AppointmentStatus.upcoming,
    ),
  ];
}
