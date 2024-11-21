import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/entity/auth.dart';

abstract class AuthRepository {
  Future<Either<Failure, AuthUser?>> signUpWithEmail(
      String email, String password);
  Future<Either<Failure, AuthUser?>> loginWithEmail(
      String email, String password);
  Future<Either<Failure, AuthUser?>> signInWithGoogle();
  Future<Either<Failure, void>> signOut();
}
