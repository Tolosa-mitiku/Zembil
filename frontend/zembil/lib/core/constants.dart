import 'package:http/http.dart' as http;

class HttpClientProvider {
  static final http.Client client = http.Client();

  static http.Client getInstance() {
    return client;
  }
}

class Urls {
  // Production - Vercel deployment (recommended)
  static const String baseUrl = "https://zembil.vercel.app/api/v1";

  // Development - Local backend (uncomment for local testing)
  // static const String baseUrl = "http://10.0.2.2:5000/api/v1"; // For Android Emulator
  // static const String baseUrl = "http://localhost:5000/api/v1"; // For iOS Simulator
  // static const String baseUrl = "http://YOUR_LOCAL_IP:5000/api/v1"; // For Physical Device

  // Endpoints
  static const String login = '/login';
  static const String signup = '/signup';
  static const String profile = '/profile';
  static const String products = '/products';
  // for other APIs
}
