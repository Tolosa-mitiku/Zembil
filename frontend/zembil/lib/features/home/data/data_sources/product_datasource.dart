import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/data/model/product.dart';

abstract class ProductDatasource {
  Future<Either<Failure, List<ProductModel>>> getProducts();
}
