import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/entity/auth.dart';

abstract class AuthRepository {
  Future<Either<Failure, void>> signUpWithEmail(String email, String password);
  Future<Either<Failure, void>> loginWithEmail(String email, String password);
  Future<Either<Failure, AuthUser?>> zembilLogIn();
  Future<Either<Failure, void>> signInWithGoogle();
  Future<Either<Failure, void>> sendVerificationEmail();
  Future<Either<Failure, bool?>> checkEmailVerification();
  Future<Either<Failure, void>> resetPassword(String email);
  Future<Either<Failure, void>> signOut();
}
