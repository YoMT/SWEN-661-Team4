import '../../../shared/models/base_model.dart';

class EmergencyContactModel extends BaseModel {
  final String name;
  final String phone;
  final String relationship;

  const EmergencyContactModel({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    required this.name,
    required this.phone,
    required this.relationship,
  });

  String get initials {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  @override
  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
        'relationship': relationship,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };
}
