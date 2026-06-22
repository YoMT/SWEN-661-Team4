import 'package:flutter/foundation.dart';
import '../models/medication_model.dart';
import '../../../core/data/seeds.dart';
import '../../../core/error/error_bus.dart';

class MedicationProvider extends ChangeNotifier {
  List<MedicationModel> medications = Seeds.medications();
  bool isLoading = false;
  String? errorMessage;

  int get totalDoses => medications.length;
  int get givenDoses => medications.where((m) => m.status == DoseStatus.given).length;

  MedicationModel? get nextDue => medications
      .where((m) => m.status == DoseStatus.dueNow || m.status == DoseStatus.upcoming)
      .isNotEmpty
      ? medications.firstWhere((m) => m.status == DoseStatus.dueNow,
          orElse: () => medications.firstWhere((m) => m.status == DoseStatus.upcoming))
      : null;

  Map<DoseTimeSlot, List<MedicationModel>> get byTimeSlot {
    final map = <DoseTimeSlot, List<MedicationModel>>{};
    for (final med in medications) {
      map.putIfAbsent(med.timeSlot, () => []).add(med);
    }
    return map;
  }

  Future<void> markAsTaken(String id) async {
    errorMessage = null;
    try {
      final idx = medications.indexWhere((m) => m.id == id);
      if (idx == -1) return;
      final med = medications[idx];
      if (!med.canMarkTaken) return;
      medications = List.of(medications)
        ..[idx] = med.copyWith(status: DoseStatus.given, takenAt: DateTime.now());
    } catch (e) {
      errorMessage = 'Failed to mark dose as taken.';
      ErrorBus.instance.push(errorMessage!);
    }
    notifyListeners();
  }

  Future<void> add(MedicationModel med) async {
    errorMessage = null;
    try {
      medications = [...medications, med];
    } catch (e) {
      errorMessage = 'Failed to add medication.';
      ErrorBus.instance.push(errorMessage!);
    }
    notifyListeners();
  }

  Future<void> delete(String id) async {
    errorMessage = null;
    try {
      medications = medications.where((m) => m.id != id).toList();
    } catch (e) {
      errorMessage = 'Failed to delete medication.';
      ErrorBus.instance.push(errorMessage!);
    }
    notifyListeners();
  }
}
