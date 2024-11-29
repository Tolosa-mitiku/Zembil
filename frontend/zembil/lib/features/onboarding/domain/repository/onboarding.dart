abstract class OnboardingRepository {
  bool hasSeenOnboarding();
  Future<bool> isAuthenticated();
  Future<void> completeOnboarding();
}
