import 'package:zembil/features/authentication/domain/entity/auth.dart';

class AuthUserModel extends AuthUser {
  AuthUserModel({required super.uid, super.email});

  factory AuthUserModel.fromFirebaseUser(user) {
    return AuthUserModel(uid: user.uid, email: user.email);
  }

  factory AuthUserModel.fromJson(Map<String, dynamic> json) {
    return AuthUserModel(
      uid: json['uid'],
      email: json['email'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'uid': uid,
      'email': email,
    };
  }
}
