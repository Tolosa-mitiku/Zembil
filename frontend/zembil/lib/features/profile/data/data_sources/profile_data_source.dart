import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/profile/data/model/profile_model.dart';

abstract class ProfileDataSource {
  Future<Either<Failure, ProfileModel>> getProfile();
  Future<Either<Failure, ProfileModel?>> updateProfile();
}
