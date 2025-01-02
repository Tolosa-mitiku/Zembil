import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/data/model/product.dart';

abstract class ProductDatasource {
  Future<Either<Failure, List<ProductModel>>> getProducts(
      Map<String, String>? filters);

  Future<Either<Failure, ProductModel>> getProduct(String productId);
}
