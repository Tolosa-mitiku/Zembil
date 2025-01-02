import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:zembil/core/secure_storage.dart';

class HttpClient {
  final String baseUrl;
  final http.Client client;
  final SecureStorageHelper secureStorageHelper;

  HttpClient({
    required this.baseUrl,
    required this.client,
    required this.secureStorageHelper,
  });

  Future<http.Response> get(
    String endpoint, {
    Map<String, String>? additionalHeaders,
    Map<String, String>? filters, // Add filters as query parameters
  }) async {
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
      final response = await client.get(url, headers: headers);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      } else {
        throw Exception('HTTP Error: ${response.statusCode}, ${response.body}');
      }
    } catch (e) {
      throw Exception('Network Error: $e');
    }
  }

  Future<http.Response> put(
    String endpoint,
    Map<String, dynamic> body, {
    Map<String, String>? additionalHeaders,
  }) async {
    final token = await secureStorageHelper.getToken();

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
      ...?additionalHeaders,
    };

    final url = Uri.parse('$baseUrl$endpoint');

    try {
      final response =
          await client.put(url, headers: headers, body: jsonEncode(body));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      } else {
        throw Exception('HTTP Error: ${response.statusCode}, ${response.body}');
      }
    } catch (e) {
      throw Exception('Network Error: $e');
    }
  }

  Future<http.Response> delete(
    String endpoint, {
    Map<String, String>? additionalHeaders,
  }) async {
    final token = await secureStorageHelper.getToken();

    final headers = {
      'Authorization': 'Bearer $token',
      ...?additionalHeaders,
    };

    final url = Uri.parse('$baseUrl$endpoint');

    try {
      final response = await client.delete(url, headers: headers);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      } else {
        throw Exception('HTTP Error: ${response.statusCode}, ${response.body}');
      }
    } catch (e) {
      throw Exception('Network Error: $e');
    }
  }

  Future<http.Response> post(
    String endpoint,
    Map<String, dynamic> body, {
    Map<String, String>? additionalHeaders,
    String? customToken,
  }) async {
    final token = await secureStorageHelper.getToken();

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${customToken ?? token}',
      ...?additionalHeaders,
    };

    final url = Uri.parse('$baseUrl$endpoint');

    try {
      final response =
          await client.post(url, headers: headers, body: jsonEncode(body));
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      } else {
        throw Exception('HTTP Error: ${response.statusCode}, ${response.body}');
      }
    } catch (e) {
      throw Exception('Network Error: $e');
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
