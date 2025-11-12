import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/entity/product.dart';
import 'package:zembil/features/home/domain/repository/product_repository.dart';

class GetFeaturedProducts {
  final ProductRepository repository;
  GetFeaturedProducts(this.repository);

  Future<Either<Failure, List<ProductEntity>>> call() async {
    return await repository.getProducts({"isFeatured": "true"});
  }
}
