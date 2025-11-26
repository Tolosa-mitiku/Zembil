import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/profile/data/data_sources/profile_data_source.dart';
import 'package:zembil/features/profile/data/model/profile_model.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';
import 'package:zembil/features/profile/domain/repository/profile_repository.dart';

class ProfileRepositoryImpl extends ProfileRepository {
  final ProfileDataSource profileDataSource;
  ProfileRepositoryImpl(this.profileDataSource);

  @override
  Future<Either<Failure, ProfileEntity>> getProfile() async {
    return await profileDataSource.getProfile();
  }

  @override
  Future<Either<Failure, ProfileEntity>> updateProfile(
      ProfileEntity profile) async {
    // Convert ProfileEntity to ProfileModel for data layer
    final profileModel = ProfileModel(
      email: profile.email,
      name: profile.name,
      image: profile.image,
    );
    return await profileDataSource.updateProfile(profileModel);
  }
}
