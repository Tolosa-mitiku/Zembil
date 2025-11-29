import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:zembil/core/constants.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/hive.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/core/secure_storage.dart';
import 'package:zembil/features/profile/data/data_sources/profile_data_source.dart';
import 'package:zembil/features/profile/data/model/profile_model.dart';

class ProfileRemoteSource extends ProfileDataSource {
  final HttpClient httpClient;
  final SecureStorageHelper secureStorageHelper;
  final HiveService hiveService;

  ProfileRemoteSource(this.httpClient, this.secureStorageHelper, this.hiveService);

  @override
  Future<Either<Failure, ProfileModel>> getProfile() async {
    try {
      final response = await httpClient.get(Urls.profile);
      final decodedResponse = jsonDecode(response.body);

      // Handle new backend response format
      Map<String, dynamic> profileData;
      if (decodedResponse is Map && decodedResponse.containsKey('data')) {
        profileData = Map<String, dynamic>.from(decodedResponse['data'] as Map);
      } else if (decodedResponse is Map) {
        profileData = Map<String, dynamic>.from(decodedResponse);
      } else {
        return Left(ServerFailure("Invalid response format"));
      }

      final profile = ProfileModel.fromJson(profileData);
      
      // Cache profile for offline access
      await hiveService.cacheProfile(profileData);

      return Right(profile);
    } on NetworkFailure catch (e) {
      // Try to get from cache when offline
      final cachedData = hiveService.getCachedProfile();
      
      if (cachedData != null) {
        try {
          final profile = ProfileModel.fromJson(cachedData);
          return Right(profile);
        } catch (e) {
          return Left(NetworkFailure("No internet connection and cache is invalid."));
        }
      }
      return Left(e);
    } on ServerFailure catch (e) {
      return Left(e);
    } catch (e) {
      print('❌ Get profile error: $e');
      return Left(ServerFailure("Failed to fetch profile: ${e.toString()}"));
    }
  }

  @override
  Future<Either<Failure, ProfileModel>> updateProfile(
      ProfileModel profile) async {
    try {
      final response = await httpClient.put(Urls.profile, profile.toJson());
      final decodedResponse = jsonDecode(response.body);

      // Handle new backend response format
      Map<String, dynamic> profileData;
      if (decodedResponse is Map && decodedResponse.containsKey('data')) {
        profileData = Map<String, dynamic>.from(decodedResponse['data'] as Map);
      } else if (decodedResponse is Map) {
        profileData = Map<String, dynamic>.from(decodedResponse);
      } else {
        return Left(ServerFailure("Invalid response format"));
      }

      final updatedProfile = ProfileModel.fromJson(profileData);
      
      // Update cache with new profile data
      await hiveService.cacheProfile(profileData);

      return Right(updatedProfile);
    } on NetworkFailure catch (e) {
      return Left(e);
    } on ServerFailure catch (e) {
      return Left(e);
    } catch (e) {
      print('❌ Update profile error: $e');
      return Left(ServerFailure("Failed to update profile: ${e.toString()}"));
    }
  }
}
