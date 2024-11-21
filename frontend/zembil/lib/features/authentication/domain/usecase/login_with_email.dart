import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/entity/auth.dart';
import 'package:zembil/features/authentication/domain/repository/auth.dart';

class LogInWithEmail {
  final AuthRepository repository;

  LogInWithEmail(this.repository);

  Future<Either<Failure, AuthUser?>> call(String email, String password) async {
    return await repository.loginWithEmail(email, password);
  }
}
