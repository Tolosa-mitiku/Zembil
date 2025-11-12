import 'package:zembil/features/profile/domain/entity/profile.dart';

class ProfileModel extends ProfileEntity {
  ProfileModel({super.email, super.name, super.image});

  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    return ProfileModel(
      email: json['email'],
      name: json['name'],
      image: json['image'],
    );
  }


  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'name': name,
      'image': image,
    };
  }
}
