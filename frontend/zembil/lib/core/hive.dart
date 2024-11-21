import 'package:hive/hive.dart';

class HiveService {
  final Box _box = Hive.box('appBox');

  bool get hasSeenOnboarding => _box.get('hasSeenOnboarding', defaultValue: false);

  Future<void> markOnboardingComplete() async {
    await _box.put('hasSeenOnboarding', true);
  }
}
