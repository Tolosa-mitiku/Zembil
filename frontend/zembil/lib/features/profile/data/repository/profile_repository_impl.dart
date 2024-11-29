import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/profile/data/data_sources/profile_data_source.dart';
import 'package:zembil/features/profile/data/model/profile_model.dart';
import 'package:zembil/features/profile/domain/repository/profile_repository.dart';

class ProfileRepositoryImpl extends ProfileRepository {
  final ProfileDataSource profileDataSource;
  ProfileRepositoryImpl(this.profileDataSource);

  @override
  Future<Either<Failure, ProfileModel>> getProfile() async {
    return await profileDataSource.getProfile();
  }

  @override
  Future<Either<Failure, ProfileModel?>> updateProfile() async {
    return await profileDataSource.getProfile();
  }
}
