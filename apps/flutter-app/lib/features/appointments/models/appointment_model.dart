import '../../../shared/models/base_model.dart';

enum AppointmentType { inPerson, video }

enum AppointmentStatus { upcoming, completed, cancelled }

class AppointmentModel extends BaseModel {
  final String doctorName;
  final String specialty;
  final String location;
  final DateTime dateTime;
  final AppointmentType type;
  final AppointmentStatus status;
  final String? notes;

  const AppointmentModel({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    required this.doctorName,
    required this.specialty,
    required this.location,
    required this.dateTime,
    required this.type,
    required this.status,
    this.notes,
  });

  @override
  Map<String, dynamic> toJson() => {
        'id': id,
        'doctorName': doctorName,
        'specialty': specialty,
        'location': location,
        'dateTime': dateTime.toIso8601String(),
        'type': type.name,
        'status': status.name,
        'notes': notes,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };
}
