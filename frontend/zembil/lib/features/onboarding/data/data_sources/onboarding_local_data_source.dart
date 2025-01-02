import 'package:zembil/core/hive.dart';
import 'package:zembil/core/secure_storage.dart';
import 'package:zembil/features/onboarding/data/data_sources/onboarding_data_source.dart';

class OnboardingLocalDataSource extends OnboardingDataSource {
  final HiveService hiveService;
  final SecureStorageHelper secureStorageHelper;

  OnboardingLocalDataSource(this.hiveService, this.secureStorageHelper);

  @override
  bool hasSeenOnboarding() {
    return hiveService.hasSeenOnboarding;
  }

  @override
  Future<bool> isAuthenticated() {
    return secureStorageHelper.hasValidToken();
  }

  @override
  Future<void> completeOnboarding() async {
    await hiveService.markOnboardingComplete();
  }
}
