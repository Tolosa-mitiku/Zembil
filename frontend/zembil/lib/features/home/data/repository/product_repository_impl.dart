import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/data/data_sources/product_datasource.dart';
import 'package:zembil/features/home/data/model/product.dart';
import 'package:zembil/features/home/domain/repository/product_repository.dart';

class ProductRepositoryImpl implements ProductRepository {
  final ProductDatasource dataSource;
  ProductRepositoryImpl(this.dataSource);

  @override
  Future<Either<Failure, List<ProductModel>>> getProducts(
      Map<String, String>? filters) async {
    return await dataSource.getProducts(filters);
  }
}
