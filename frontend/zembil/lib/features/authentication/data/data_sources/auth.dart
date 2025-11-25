import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:zembil/core/constants.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/core/secure_storage.dart';
import 'package:zembil/features/authentication/data/models/auth.dart';

abstract class AuthRemoteDataSource {}

class FirebaseAuthService extends AuthRemoteDataSource {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final SecureStorageHelper _secureStorageHelper = SecureStorageHelper();
  final HttpClient httpClient = HttpClient(
      baseUrl: Urls.baseUrl,
      client: HttpClientProvider.getInstance(),
      secureStorageHelper: SecureStorageHelper());

  Future<Either<Failure, void>> signUpWithEmail(
      String email, String password) async {
    try {
      await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      return Right(null);
    } catch (e) {
      return Left(AuthFailure("Sign up failed: ${e.toString()}"));
    }
  }

  Future<Either<Failure, void>> loginWithEmail(
      String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);

      return Right(null);
    } catch (e) {
      return Left(AuthFailure("Sign up failed: ${e.toString()}"));
    }
  }

  Future<Either<Failure, void>> signInWithGoogle() async {
    try {
      // Disconnect any existing session to ensure fresh login
      await _googleSignIn.signOut();

      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        return Left(AuthFailure("Google sign-in canceled"));
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      await _auth.signInWithCredential(credential);

      return Right(null);
    } catch (e) {
      return Left(AuthFailure("Google sign-in failed: ${e.toString()}"));
    }
  }

  Future<Either<Failure, void>> sendVerificationEmail() async {
    try {
      await _auth.currentUser?.sendEmailVerification();
      return Right(null);
    } catch (e) {
      return Left(AuthFailure("Error sending verification email: $e"));
    }
  }

  Future<Either<Failure, AuthUserModel?>> zembilLogIn() async {
    try {
      final user = _auth.currentUser;

      if (user == null) {
        return Left(AuthFailure("No Firebase user found"));
      }

      final String? token = await user.getIdToken();

      if (token == null) {
        return Left(AuthFailure("Failed to get Firebase token"));
      }

      await _secureStorageHelper.saveToken(token);

      print('🔑 Firebase Token: ${token.substring(0, 50)}...');
      print('📍 API Endpoint: ${Urls.baseUrl}${Urls.login}');

      AuthUserModel userData = AuthUserModel(firebaseUID: token);

      try {
        print('📤 Sending login request to backend...');
        final response = await httpClient.post(
          Urls.login,
          userData.toJson(),
        );
        print('✅ Backend response: ${response.statusCode}');
        print('📦 Response body: ${response.body}');

        return Right(AuthUserModel.fromJson(jsonDecode(response.body)));
      } catch (e) {
        print('❌ Backend login error: $e');
        return Left(ServerFailure("Server Failure: ${e.toString()}"));
      }
    } catch (e) {
      print('❌ ZembilLogin error: $e');
      return Left(AuthFailure("Login failed: ${e.toString()}"));
    }
  }

  Future<Either<Failure, bool>> checkEmailVerification() async {
    try {
      await _auth.currentUser?.reload();

      bool isVerified = _auth.currentUser?.emailVerified ?? false;
      if (isVerified) {
        return Right(true);
      } else {
        return Right(false);
      }
    } catch (e) {
      return Left(AuthFailure("Error checking email verification: $e"));
    }
  }

  Future<Either<Failure, void>> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);

      return Right(null);
    } catch (e) {
      return Left(AuthFailure("Error checking email verification: $e"));
    }
  }

  Future<Either<Failure, void>> signOut() async {
    try {
      // Sign out from Firebase
      await _auth.signOut();

      // Disconnect Google Sign-In to allow account picker next time
      try {
        await _googleSignIn.disconnect();
      } catch (e) {
        // If disconnect fails, at least sign out
        await _googleSignIn.signOut();
      }

      // Delete stored token
      await _secureStorageHelper.deleteToken();

      return Right(null);
    } catch (e) {
      return Left(AuthFailure("Sign out failed: ${e.toString()}"));
    }
  }
}
