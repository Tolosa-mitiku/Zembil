import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/entity/product.dart';
import 'package:zembil/features/home/domain/repository/product_repository.dart';

class GetProduct {
  final ProductRepository repository;
  GetProduct(this.repository);

  Future<Either<Failure, ProductEntity>> call(String productId) async {
    return await repository.getProduct(productId);
  }
}
