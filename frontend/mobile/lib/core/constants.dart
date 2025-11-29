import 'package:http/http.dart' as http;

class HttpClientProvider {
  static final http.Client client = http.Client();

  static http.Client getInstance() {
    return client;
  }
}

class Urls {
  // Development - Local backend (current)
  static const String baseUrl =
      "http://172.22.16.95:5000/api/v1"; // Local IP for testing

  // Production - Vercel deployment (uncomment for production)
  // static const String baseUrl = "https://zembil.vercel.app/api/v1";

  // Other local options:
  // static const String baseUrl = "http://10.0.2.2:5000/api/v1"; // For Android Emulator
  // static const String baseUrl = "http://localhost:5000/api/v1"; // For iOS Simulator

  // Endpoints
  static const String login = '/login';
  static const String signup = '/signup';
  static const String profile = '/profile';
  static const String products = '/products';
  static const String orders = '/orders';
  // for other APIs
}
