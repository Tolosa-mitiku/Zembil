import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/data/data_sources/product_data_source.dart';
import 'package:zembil/features/home/data/model/product.dart';
import 'package:zembil/features/home/domain/repository/product_repository.dart';

class ProductRepositoryImpl implements ProductRepository {
  final ProductDatasource productDatasource;
  ProductRepositoryImpl({required this.productDatasource});

  @override
  Future<Either<Failure, List<ProductModel>>> getProducts(
      Map<String, String>? filters) async {
    return await productDatasource.getProducts(filters);
  }

  @override
  Future<Either<Failure, ProductModel>> getProduct(String productId) async {
    return await productDatasource.getProduct(productId);
  }
}
