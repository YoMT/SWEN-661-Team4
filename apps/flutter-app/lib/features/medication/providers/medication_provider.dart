import 'package:flutter/foundation.dart';
import '../models/medication_model.dart';

class MedicationProvider extends ChangeNotifier {
  List<MedicationModel> medications = _sampleMedications();
  bool isLoading = false;

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
    final idx = medications.indexWhere((m) => m.id == id);
    if (idx == -1) return;
    final med = medications[idx];
    if (!med.canMarkTaken) return;
    medications = List.of(medications)
      ..[idx] = med.copyWith(status: DoseStatus.given, takenAt: DateTime.now());
    notifyListeners();
  }

  Future<void> add(MedicationModel med) async {
    medications = [...medications, med];
    notifyListeners();
  }

  Future<void> delete(String id) async {
    medications = medications.where((m) => m.id != id).toList();
    notifyListeners();
  }
}

List<MedicationModel> _sampleMedications() {
  final now = DateTime.now();
  return [
    MedicationModel(
      id: '1',
      createdAt: now,
      updatedAt: now,
      name: 'Metformin',
      dosage: '500 mg',
      instruction: '1 tablet · with food',
      scheduledTime: '2:00 PM',
      timeSlot: DoseTimeSlot.afternoon,
      status: DoseStatus.dueNow,
    ),
    MedicationModel(
      id: '2',
      createdAt: now,
      updatedAt: now,
      name: 'Lisinopril',
      dosage: '10 mg',
      instruction: '1 tablet',
      scheduledTime: '8:00 PM',
      timeSlot: DoseTimeSlot.evening,
      status: DoseStatus.upcoming,
    ),
    MedicationModel(
      id: '3',
      createdAt: now,
      updatedAt: now,
      name: 'Levodopa',
      dosage: '100 mg',
      instruction: '1 capsule · before food',
      scheduledTime: '8:00 PM',
      timeSlot: DoseTimeSlot.evening,
      status: DoseStatus.upcoming,
    ),
    MedicationModel(
      id: '4',
      createdAt: now,
      updatedAt: now,
      name: 'Aspirin',
      dosage: '81 mg',
      instruction: '1 tablet · with water',
      scheduledTime: '8:00 AM',
      timeSlot: DoseTimeSlot.morning,
      status: DoseStatus.given,
      takenAt: now.subtract(const Duration(hours: 6)),
    ),
    MedicationModel(
      id: '5',
      createdAt: now,
      updatedAt: now,
      name: 'Atorvastatin',
      dosage: '20 mg',
      instruction: '1 tablet · at bedtime',
      scheduledTime: '10:00 PM',
      timeSlot: DoseTimeSlot.night,
      status: DoseStatus.upcoming,
    ),
  ];
}
