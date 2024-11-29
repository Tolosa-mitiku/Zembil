import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:zembil/core/constants.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/core/secure_storage.dart';
import 'package:zembil/features/profile/data/data_sources/profile_data_source.dart';
import 'package:zembil/features/profile/data/model/profile_model.dart';

class ProfileRemoteSource extends ProfileDataSource {
  final HttpClient httpClient;
  final SecureStorageHelper secureStorageHelper;

  ProfileRemoteSource(this.httpClient, this.secureStorageHelper);

  @override
  Future<Either<Failure, ProfileModel>> getProfile() async {
    try {
      final response = await httpClient.get(Urls.profile);

      return Right(ProfileModel.fromJson(jsonDecode(response.body)));
    } catch (e) {
      return Left(ServerFailure("Server Failure: ${e.toString()}"));
    }
  }

  @override
  Future<Either<Failure, ProfileModel?>> updateProfile() async {
    try {
      final response =
          await httpClient.post(Urls.profile, ProfileModel().toJson());
      return Right(ProfileModel.fromJson(json.decode(response.body)));
    } catch (e) {
      return Left(ServerFailure("Server Failure: ${e.toString()}"));
    }
  }
}
