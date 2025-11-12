import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/repository/auth.dart';

class SendVerificationEmail {
  final AuthRepository repository;

  SendVerificationEmail(this.repository);

  Future<Either<Failure, void>> call() async {
    return await repository.sendVerificationEmail();
  }
}
