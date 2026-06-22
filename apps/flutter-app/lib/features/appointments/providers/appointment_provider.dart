import 'package:flutter/foundation.dart';
import '../models/appointment_model.dart';
import '../../../core/data/seeds.dart';
import '../../../core/error/error_bus.dart';

class AppointmentProvider extends ChangeNotifier {
  List<AppointmentModel> appointments = Seeds.appointments();
  bool isLoading = false;
  String? errorMessage;

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

  Future<void> refresh() async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
      await Future.delayed(const Duration(milliseconds: 400));
    } catch (e) {
      errorMessage = 'Failed to refresh appointments.';
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> book(AppointmentModel appt) async {
    errorMessage = null;
    try {
      appointments = [...appointments, appt];
    } catch (e) {
      errorMessage = 'Failed to book appointment.';
      ErrorBus.instance.push(errorMessage!);
    }
    notifyListeners();
  }

  Future<void> cancel(String id) async {
    errorMessage = null;
    try {
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
    } catch (e) {
      errorMessage = 'Failed to cancel appointment.';
      ErrorBus.instance.push(errorMessage!);
    }
    notifyListeners();
  }
}
