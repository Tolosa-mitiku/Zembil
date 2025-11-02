import 'package:zembil/features/authentication/domain/entity/auth.dart';

class AuthUserModel extends AuthUser {
  AuthUserModel({super.firebaseUID, super.role});

  factory AuthUserModel.fromFirebaseUser(user) {
    return AuthUserModel(firebaseUID: user.uid);
  }

  factory AuthUserModel.fromJson(Map<String, dynamic> json) {
    // Handle nested user object from backend response
    final userData = json['user'] ?? json;
    return AuthUserModel(
      firebaseUID: userData['uid'] ?? userData['_id'],
      role: userData['role'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'firebaseUID': firebaseUID,
      'role': role,
    };
  }
}
