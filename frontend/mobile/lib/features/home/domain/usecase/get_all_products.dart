import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/entity/product.dart';
import 'package:zembil/features/home/domain/repository/product_repository.dart';

class GetProductsByCategory {
  final ProductRepository repository;
  GetProductsByCategory(this.repository);

  Future<Either<Failure, List<ProductEntity>>> call(
      String category, {
      Map<String, String>? additionalFilters,
    }) async {
    final filters = <String, String>{};
    if (category != 'All') {
      filters['category'] = category;
    }
    if (additionalFilters != null) {
      filters.addAll(additionalFilters);
    }
    return await repository.getProducts(filters.isNotEmpty ? filters : null);
  }
}
