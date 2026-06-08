import '../../../shared/models/base_model.dart';

class ProfileModel extends BaseModel {
  final String name;
  final String email;
  final String? phone;
  final String? careeName;
  final DateTime? dateOfBirth;
  final String? photoUrl;
  final String? bloodType;
  final List<String> allergies;

  const ProfileModel({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    required this.name,
    required this.email,
    this.phone,
    this.careeName,
    this.dateOfBirth,
    this.photoUrl,
    this.bloodType,
    this.allergies = const [],
  });

  @override
  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'dateOfBirth': dateOfBirth?.toIso8601String(),
        'photoUrl': photoUrl,
        'bloodType': bloodType,
        'allergies': allergies,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };
}
