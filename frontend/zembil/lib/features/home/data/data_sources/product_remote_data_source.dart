import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:zembil/core/constants.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/features/home/data/data_sources/product_data_source.dart';
import 'package:zembil/features/home/data/model/product.dart';

class ProductRemoteDatasource extends ProductDatasource {
  final HttpClient httpClient;

  ProductRemoteDatasource(this.httpClient);
  @override
  Future<Either<Failure, List<ProductModel>>> getProducts(
      Map<String, String>? filters) async {
    try {
      final response = await httpClient.get(Urls.products, filters: filters);
      final decodedResponse = jsonDecode(response.body) as List<dynamic>;

      final products = decodedResponse
          .map((e) => ProductModel.fromJson(e))
          .whereType<ProductModel>()
          .toList();
      return Right(products);
    } catch (e) {
      print(e);
      return Left(ServerFailure("Server Error"));
    }
  }

  @override
  Future<Either<Failure, ProductModel>> getProduct(String productId) async {
    try {
      final response = await httpClient.get("${Urls.products}/$productId");
      final decodedResponse = jsonDecode(response.body) as Map<String, dynamic>;

      final product = ProductModel.fromJson(decodedResponse);

      return Right(product);
    } catch (e) {
      print(e);
      return Left(ServerFailure("Server Error"));
    }
  }
}
