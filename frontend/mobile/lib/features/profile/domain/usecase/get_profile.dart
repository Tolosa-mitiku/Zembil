import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';
import 'package:zembil/features/profile/domain/repository/profile_repository.dart';

class GetProfile {
  final ProfileRepository repository;
  GetProfile(this.repository);

  Future<Either<Failure, ProfileEntity>> call() async {
    return await repository.getProfile();
  }
}
