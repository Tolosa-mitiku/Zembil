import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/data/data_sources/auth.dart';
import 'package:zembil/features/authentication/domain/entity/auth.dart';
import 'package:zembil/features/authentication/domain/repository/auth.dart';

class AuthRepositoryImpl implements AuthRepository {
  final FirebaseAuthService _firebaseAuthService;

  AuthRepositoryImpl(this._firebaseAuthService);

  @override
  Future<Either<Failure, AuthUser?>> signUpWithEmail(
      String email, String password) {
    return _firebaseAuthService.signUpWithEmail(email, password);
  }

  @override
  Future<Either<Failure, AuthUser?>> loginWithEmail(
      String email, String password) {
    return _firebaseAuthService.loginWithEmail(email, password);
  }

  @override
  Future<Either<Failure, AuthUser?>> signInWithGoogle() {
    return _firebaseAuthService.signInWithGoogle();
  }

  @override
  Future<Either<Failure, void>> signOut() {
    return _firebaseAuthService.signOut();
  }
}
