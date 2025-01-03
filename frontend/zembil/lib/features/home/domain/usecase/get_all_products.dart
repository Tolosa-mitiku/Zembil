import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/entity/product.dart';
import 'package:zembil/features/home/domain/repository/product_repository.dart';

class GetProductsByCategory {
  final ProductRepository repository;
  GetProductsByCategory(this.repository);

  Future<Either<Failure, List<ProductEntity>>> call(String category) async {
    return await repository
        .getProducts(category != 'All' ? {'category': category} : null);
  }
}
