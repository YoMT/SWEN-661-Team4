import '../../../shared/models/base_model.dart';

class UserModel extends BaseModel {
  final String name;
  final String email;
  final String? photoUrl;
  final DateTime? dateOfBirth;

  const UserModel({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    required this.name,
    required this.email,
    this.photoUrl,
    this.dateOfBirth,
  });

  @override
  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'photoUrl': photoUrl,
        'dateOfBirth': dateOfBirth?.toIso8601String(),
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };
}
