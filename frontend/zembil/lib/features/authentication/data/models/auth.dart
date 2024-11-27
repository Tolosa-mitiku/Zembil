import 'package:zembil/features/authentication/domain/entity/auth.dart';

class AuthUserModel extends AuthUser {
  AuthUserModel({super.firebaseUID, super.role});

  factory AuthUserModel.fromFirebaseUser(user) {
    return AuthUserModel(firebaseUID: user.uid);
  }

  factory AuthUserModel.fromJson(Map<String, dynamic> json) {
    return AuthUserModel(
      firebaseUID: json['uid'],
      role: json['email'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'firebaseUID': firebaseUID,
      'role': role,
    };
  }
}
