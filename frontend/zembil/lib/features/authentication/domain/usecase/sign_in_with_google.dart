import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/entity/auth.dart';
import 'package:zembil/features/authentication/domain/repository/auth.dart';

class SignInWithGoogle {
  final AuthRepository repository;

  SignInWithGoogle(this.repository);


  Future<Either<Failure, AuthUser?>> call() async {
    return await repository.signInWithGoogle();
  }
}
