import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/repository/auth.dart';

class CheckVerificationEmail {
  final AuthRepository repository;

  CheckVerificationEmail(this.repository);

  Future<Either<Failure, bool?>> call() async {
    return await repository.checkEmailVerification();
  }
}
