import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/entity/product.dart';

abstract class ProductRepository {
  Future<Either<Failure, List<ProductEntity>>> getProducts(
      Map<String, String>? filters);

  Future<Either<Failure, ProductEntity>> getProduct(String productId);
}
