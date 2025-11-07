import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';
import 'package:zembil/features/profile/domain/repository/profile_repository.dart';

class UpdateProfile {
  final ProfileRepository repository;

  UpdateProfile(this.repository);

  Future<Either<Failure, ProfileEntity>> call(ProfileEntity profile) async {
    return await repository.updateProfile(profile);
  }
}
