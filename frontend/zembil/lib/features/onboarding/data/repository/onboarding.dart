import 'package:zembil/core/hive.dart';
import 'package:zembil/core/secure_storage.dart';
import 'package:zembil/features/onboarding/domain/repository/onboarding.dart';

class OnboardingRepositoryImpl implements OnboardingRepository {
  final HiveService hiveService;
  final SecureStorageHelper secureStorageHelper;

  OnboardingRepositoryImpl(this.hiveService, this.secureStorageHelper);

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
