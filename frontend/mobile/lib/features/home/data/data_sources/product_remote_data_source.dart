import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:zembil/core/constants.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/hive.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/features/home/data/data_sources/product_data_source.dart';
import 'package:zembil/features/home/data/model/product.dart';

class ProductRemoteDatasource extends ProductDatasource {
  final HttpClient httpClient;
  final HiveService hiveService;

  ProductRemoteDatasource(this.httpClient, this.hiveService);
  @override
  Future<Either<Failure, List<ProductModel>>> getProducts(
      Map<String, String>? filters) async {
    try {
      final response = await httpClient.get(Urls.products, filters: filters);
      final decodedResponse = jsonDecode(response.body);

      // Handle new backend response format with success/data structure
      List<dynamic> productsData;
      if (decodedResponse is Map && decodedResponse.containsKey('data')) {
        productsData = decodedResponse['data'] as List<dynamic>;
      } else if (decodedResponse is List) {
        productsData = decodedResponse;
      } else {
        return Left(ServerFailure("Invalid response format"));
      }

      final products = productsData
          .map((e) => ProductModel.fromJson(e))
          .whereType<ProductModel>()
          .toList();

      // Cache products for offline access
      final cacheKey = filters != null && filters.containsKey('category')
          ? filters['category']!
          : 'all';
      final productsJson = productsData.cast<Map<String, dynamic>>();
      await hiveService.cacheProducts(cacheKey, productsJson);

      return Right(products);
    } on NetworkFailure catch (e) {
      // Try to get from cache when offline
      final cacheKey = filters != null && filters.containsKey('category')
          ? filters['category']!
          : 'all';
      final cachedData = hiveService.getCachedProducts(cacheKey);
      
      if (cachedData != null && cachedData.isNotEmpty) {
        try {
          final products = cachedData
              .map((e) => ProductModel.fromJson(e))
              .whereType<ProductModel>()
              .toList();
          return Right(products);
        } catch (e) {
          return Left(NetworkFailure("No internet connection and cache is invalid."));
        }
      }
      return Left(e);
    } on ServerFailure catch (e) {
      return Left(e);
    } catch (e) {
      print('❌ Get products error: $e');
      return Left(ServerFailure("Failed to fetch products: ${e.toString()}"));
    }
  }

  @override
  Future<Either<Failure, ProductModel>> getProduct(String productId) async {
    try {
      final response = await httpClient.get("${Urls.products}/$productId");
      final decodedResponse = jsonDecode(response.body);

      // Handle new backend response format
      Map<String, dynamic> productData;
      if (decodedResponse is Map && decodedResponse.containsKey('data')) {
        productData = Map<String, dynamic>.from(decodedResponse['data'] as Map);
      } else if (decodedResponse is Map) {
        productData = Map<String, dynamic>.from(decodedResponse);
      } else {
        return Left(ServerFailure("Invalid response format"));
      }

      final product = ProductModel.fromJson(productData);
      
      // Cache product for offline access
      await hiveService.cacheProduct(productId, productData);

      return Right(product);
    } on NetworkFailure catch (e) {
      // Try to get from cache when offline
      final cachedData = hiveService.getCachedProduct(productId);
      
      if (cachedData != null) {
        try {
          final product = ProductModel.fromJson(cachedData);
          return Right(product);
        } catch (e) {
          return Left(NetworkFailure("No internet connection and cache is invalid."));
        }
      }
      return Left(e);
    } on ServerFailure catch (e) {
      return Left(e);
    } catch (e) {
      print('❌ Get product error: $e');
      return Left(ServerFailure("Failed to fetch product: ${e.toString()}"));
    }
  }
}
