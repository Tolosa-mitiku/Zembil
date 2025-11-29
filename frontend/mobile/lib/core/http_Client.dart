import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:zembil/core/connectivity_service.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/secure_storage.dart';

class HttpClient {
  final String baseUrl;
  final http.Client client;
  final SecureStorageHelper secureStorageHelper;
  final ConnectivityService? connectivityService;

  HttpClient({
    required this.baseUrl,
    required this.client,
    required this.secureStorageHelper,
    this.connectivityService,
  });

  Future<http.Response> get(
    String endpoint, {
    Map<String, String>? additionalHeaders,
    Map<String, String>? filters, // Add filters as query parameters
    bool useCache = false, // Enable cache for offline support
  }) async {
    // Check connectivity first
    if (connectivityService != null) {
      final hasInternet = await connectivityService!.hasInternetConnection();
      if (!hasInternet) {
        throw NetworkFailure('No internet connection. Please check your network and try again.');
      }
    }

    final token = await secureStorageHelper.getToken();

    // Combine default headers with additional headers
    final headers = {
      'Authorization': 'Bearer $token',
      ...?additionalHeaders,
    };

    // Add filters to the URL as query parameters
    final url =
        Uri.parse('$baseUrl$endpoint').replace(queryParameters: filters);

    try {
      final response = await client.get(url, headers: headers).timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw NetworkFailure('Request timeout. Please check your connection and try again.');
        },
      );

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      } else if (response.statusCode == 401) {
        throw AuthFailure('Authentication failed. Please login again.');
      } else if (response.statusCode >= 500) {
        throw ServerFailure('Server error. Please try again later.');
      } else {
        throw ServerFailure('Error ${response.statusCode}: ${response.body}');
      }
    } on NetworkFailure {
      rethrow;
    } on ServerFailure {
      rethrow;
    } on AuthFailure {
      rethrow;
    } catch (e) {
      if (e is NetworkFailure || e is ServerFailure || e is AuthFailure) {
        rethrow;
      }
      throw NetworkFailure('Network error: ${e.toString()}');
    }
  }

  Future<http.Response> put(
    String endpoint,
    Map<String, dynamic> body, {
    Map<String, String>? additionalHeaders,
  }) async {
    // Check connectivity first
    if (connectivityService != null) {
      final hasInternet = await connectivityService!.hasInternetConnection();
      if (!hasInternet) {
        throw NetworkFailure('No internet connection. Please check your network and try again.');
      }
    }

    final token = await secureStorageHelper.getToken();

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
      ...?additionalHeaders,
    };

    final url = Uri.parse('$baseUrl$endpoint');

    try {
      final response = await client.put(url, headers: headers, body: jsonEncode(body)).timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw NetworkFailure('Request timeout. Please check your connection and try again.');
        },
      );

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      } else if (response.statusCode == 401) {
        throw AuthFailure('Authentication failed. Please login again.');
      } else if (response.statusCode >= 500) {
        throw ServerFailure('Server error. Please try again later.');
      } else {
        throw ServerFailure('Error ${response.statusCode}: ${response.body}');
      }
    } on NetworkFailure {
      rethrow;
    } on ServerFailure {
      rethrow;
    } on AuthFailure {
      rethrow;
    } catch (e) {
      if (e is NetworkFailure || e is ServerFailure || e is AuthFailure) {
        rethrow;
      }
      throw NetworkFailure('Network error: ${e.toString()}');
    }
  }

  Future<http.Response> delete(
    String endpoint, {
    Map<String, String>? additionalHeaders,
  }) async {
    // Check connectivity first
    if (connectivityService != null) {
      final hasInternet = await connectivityService!.hasInternetConnection();
      if (!hasInternet) {
        throw NetworkFailure('No internet connection. Please check your network and try again.');
      }
    }

    final token = await secureStorageHelper.getToken();

    final headers = {
      'Authorization': 'Bearer $token',
      ...?additionalHeaders,
    };

    final url = Uri.parse('$baseUrl$endpoint');

    try {
      final response = await client.delete(url, headers: headers).timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw NetworkFailure('Request timeout. Please check your connection and try again.');
        },
      );

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      } else if (response.statusCode == 401) {
        throw AuthFailure('Authentication failed. Please login again.');
      } else if (response.statusCode >= 500) {
        throw ServerFailure('Server error. Please try again later.');
      } else {
        throw ServerFailure('Error ${response.statusCode}: ${response.body}');
      }
    } on NetworkFailure {
      rethrow;
    } on ServerFailure {
      rethrow;
    } on AuthFailure {
      rethrow;
    } catch (e) {
      if (e is NetworkFailure || e is ServerFailure || e is AuthFailure) {
        rethrow;
      }
      throw NetworkFailure('Network error: ${e.toString()}');
    }
  }

  Future<http.Response> post(
    String endpoint,
    Map<String, dynamic> body, {
    Map<String, String>? additionalHeaders,
    String? customToken,
  }) async {
    // Check connectivity first
    if (connectivityService != null) {
      final hasInternet = await connectivityService!.hasInternetConnection();
      if (!hasInternet) {
        throw NetworkFailure('No internet connection. Please check your network and try again.');
      }
    }

    final token = await secureStorageHelper.getToken();

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${customToken ?? token}',
      ...?additionalHeaders,
    };

    final url = Uri.parse('$baseUrl$endpoint');

    try {
      final response = await client.post(url, headers: headers, body: jsonEncode(body)).timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw NetworkFailure('Request timeout. Please check your connection and try again.');
        },
      );
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      } else if (response.statusCode == 401) {
        throw AuthFailure('Authentication failed. Please login again.');
      } else if (response.statusCode >= 500) {
        throw ServerFailure('Server error. Please try again later.');
      } else {
        throw ServerFailure('Error ${response.statusCode}: ${response.body}');
      }
    } on NetworkFailure {
      rethrow;
    } on ServerFailure {
      rethrow;
    } on AuthFailure {
      rethrow;
    } catch (e) {
      if (e is NetworkFailure || e is ServerFailure || e is AuthFailure) {
        rethrow;
      }
      throw NetworkFailure('Network error: ${e.toString()}');
    }
  }

  // Add other HTTP methods like GET, PUT, DELETE as needed.

  Future<http.Response> postStripe(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    final headers = {
      "Authorization": "Bearer ${dotenv.env['STRIPE_SECRET_KEY']}",
      "Content-Type": 'application/x-www-form-urlencoded'
    };

    final url = Uri.parse(endpoint);

    try {
      final response = await client.post(url, headers: headers, body: body);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      } else {
        throw Exception('HTTP Error: ${response.statusCode}, ${response.body}');
      }
    } catch (e) {
      throw Exception('Network Error: $e');
    }
  }
}
