import 'package:http/http.dart' as http;

class HttpClientProvider {
  static final http.Client client = http.Client();

  static http.Client getInstance() {
    return client;
  }
}

class Urls {
  // static const String baseUrl = "http://192.168.233.70:5000/api/v1";
  // static const String baseUrl = "https://zembil-gfnd.onrender.com/api/v1";
  static const String baseUrl = "https://zembil.vercel.app/api/v1";
  static const String login = '/login';
  static const String signup = '/signup';
  static const String profile = '/profile';
  static const String products = '/products';
  // for other APIs
}
