import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:zembil/core/constants.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/features/home/data/data_sources/product_datasource.dart';
import 'package:zembil/features/home/data/model/product.dart';

class ProductRemoteDatasource extends ProductDatasource {
  final HttpClient httpClient;

  ProductRemoteDatasource(this.httpClient);
  @override
  Future<Either<Failure, List<ProductModel>>> getProducts() async {
    try {
      final response = await httpClient.get(Urls.products);
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
}
