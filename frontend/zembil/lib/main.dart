import 'package:flutter/material.dart';
import 'package:zembil/core/utils.dart';
import 'package:zembil/features/authentication/presentation/pages/login.dart';
import 'package:zembil/features/authentication/presentation/pages/signup.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual,
  //     overlays: [SystemUiOverlay.bottom]);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      onGenerateRoute: _generateRoute,
      initialRoute: "/",
      title: "Zembil",
      theme: primaryTheme,
      themeMode: ThemeMode.system,
    );
  }
}

Route? _generateRoute(RouteSettings settings) {
  switch (settings.name) {
    case "/":
      return MaterialPageRoute(builder: (_) => const Signup());

    case "/login":
      return MaterialPageRoute(builder: (_) => const Login());
    default:
      return null;
  }
}
