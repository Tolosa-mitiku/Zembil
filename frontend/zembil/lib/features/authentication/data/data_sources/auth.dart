import 'package:dartz/dartz.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/secure_storage.dart';
import 'package:zembil/features/authentication/data/models/auth.dart';

abstract class AuthRemoteDataSource {}

class FirebaseAuthService extends AuthRemoteDataSource {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final SecureStorageHelper _secureStorageHelper = SecureStorageHelper();

  Future<Either<Failure, AuthUserModel?>> signUpWithEmail(
      String email, String password) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);

      final String? token = await result.user?.getIdToken();
      if (token != null) {
        await _secureStorageHelper.saveToken(token); // Save token securely
      }

      return Right(AuthUserModel.fromFirebaseUser(result.user));
    } catch (e) {
      return Left(AuthFailure("Sign up failed: ${e.toString()}"));
    }
  }

  Future<Either<Failure, AuthUserModel?>> loginWithEmail(
      String email, String password) async {
    try {
      UserCredential result = await _auth.signInWithEmailAndPassword(
          email: email, password: password);

      final String? token = await result.user?.getIdToken();
      if (token != null) {
        await _secureStorageHelper.saveToken(token); // Save token securely
      }
      return Right(AuthUserModel.fromFirebaseUser(result.user));
    } catch (e) {
      return Left(AuthFailure("Login failed: ${e.toString()}"));
    }
  }

  Future<Either<Failure, AuthUserModel?>> signInWithGoogle() async {
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

      final UserCredential result =
          await _auth.signInWithCredential(credential);

      final String? token = await result.user?.getIdToken();
      if (token != null) {
        await _secureStorageHelper.saveToken(token); // Save token securely
      }
      return Right(AuthUserModel.fromFirebaseUser(result.user));
    } catch (e) {
      return Left(AuthFailure("Google sign-in failed: ${e.toString()}"));
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
