import '../../../shared/models/base_model.dart';

enum DoseStatus { upcoming, dueNow, given, missed }

enum DoseTimeSlot { morning, afternoon, evening, night }

extension DoseTimeSlotLabel on DoseTimeSlot {
  String get label => switch (this) {
        DoseTimeSlot.morning => 'Morning',
        DoseTimeSlot.afternoon => 'Afternoon',
        DoseTimeSlot.evening => 'Evening',
        DoseTimeSlot.night => 'Night',
      };
}

class MedicationModel extends BaseModel {
  final String name;
  final String dosage;
  final String instruction;
  final String scheduledTime;
  final DoseTimeSlot timeSlot;
  final DoseStatus status;
  final DateTime? takenAt;
  final String? notes;

  const MedicationModel({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    required this.name,
    required this.dosage,
    required this.instruction,
    required this.scheduledTime,
    required this.timeSlot,
    required this.status,
    this.takenAt,
    this.notes,
  });

  bool get canMarkTaken {
    if (status == DoseStatus.given) return false;
    if (takenAt == null) return true;
    return DateTime.now().difference(takenAt!) > const Duration(seconds: 60);
  }

  MedicationModel copyWith({DoseStatus? status, DateTime? takenAt}) {
    return MedicationModel(
      id: id,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
      name: name,
      dosage: dosage,
      instruction: instruction,
      scheduledTime: scheduledTime,
      timeSlot: timeSlot,
      status: status ?? this.status,
      takenAt: takenAt ?? this.takenAt,
      notes: notes,
    );
  }

  @override
  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'dosage': dosage,
        'instruction': instruction,
        'scheduledTime': scheduledTime,
        'timeSlot': timeSlot.name,
        'status': status.name,
        'takenAt': takenAt?.toIso8601String(),
        'notes': notes,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };
}
