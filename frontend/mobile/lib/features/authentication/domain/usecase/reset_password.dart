import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/repository/auth.dart';

class ResetPassword {
  final AuthRepository repository;
  ResetPassword(this.repository);

  Future<Either<Failure, void>> call(String email) async {
    return await repository.resetPassword(email);
  }
}
