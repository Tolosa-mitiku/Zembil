abstract class OnboardingDataSource {
  bool hasSeenOnboarding();

  Future<bool> isAuthenticated();

  Future<void> completeOnboarding();
}
