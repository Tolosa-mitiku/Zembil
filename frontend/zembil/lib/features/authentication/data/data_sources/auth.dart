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

      // if (token != null) {
      //   await _secureStorageHelper.saveToken(token); // Save token securely
      // }

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
      final String? token = await user?.getIdToken();

      if (token != null) {
        await _secureStorageHelper.saveToken(token); // Save token securely
      }
      
      AuthUserModel userData = AuthUserModel(firebaseUID: token);

      try {
        final response = await httpClient.post(Urls.login, userData.toJson(),
            temptoken: token);
        return Right(AuthUserModel.fromJson(jsonDecode(response.body)));
      } catch (e) {
        return Left((ServerFailure("Server Failure: ${e.toString()}")));
      }
    } catch (e) {
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

  Future<Either<Failure, void>> signOut() async {
    try {
      await _auth.signOut();
      await _googleSignIn.signOut();
      await _secureStorageHelper.deleteToken(); // delete token

      return Right(null);
    } catch (e) {
      return Left(AuthFailure("Sign out failed: ${e.toString()}"));
    }
  }
}
