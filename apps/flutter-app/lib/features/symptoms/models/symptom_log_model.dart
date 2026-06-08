import '../../../shared/models/base_model.dart';

enum SymptomType { pain, dizzy, breath, tired, nausea, other }

class SymptomLogModel extends BaseModel {
  final SymptomType symptom;
  final int severity;
  final String? note;

  const SymptomLogModel({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    required this.symptom,
    required this.severity,
    this.note,
  });

  @override
  Map<String, dynamic> toJson() => {
        'id': id,
        'symptom': symptom.name,
        'severity': severity,
        'note': note,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };
}
