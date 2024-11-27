import 'package:get_it/get_it.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:zembil/core/constants.dart';
import 'package:zembil/core/hive.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/core/secure_storage.dart';
import 'package:zembil/features/authentication/data/data_sources/auth.dart';
import 'package:zembil/features/authentication/data/repository/auth.dart';
import 'package:zembil/features/authentication/domain/repository/auth.dart';
import 'package:zembil/features/authentication/domain/usecase/check_verification_email.dart';
import 'package:zembil/features/authentication/domain/usecase/login_with_email.dart';
import 'package:zembil/features/authentication/domain/usecase/login_zembil.dart';
import 'package:zembil/features/authentication/domain/usecase/send_verification_email.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_in_with_google.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_out.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_up_with_email.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_confirm_password.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_email.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_password.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/log_in_bloc/log_in_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/sign_up_bloc/sign_up_bloc.dart';
import 'package:zembil/features/on_boarding/data/repository/onboarding.dart';
import 'package:zembil/features/on_boarding/domain/repository/onboarding.dart';
import 'package:zembil/features/on_boarding/domain/usecase/check_authenticated.dart';
import 'package:zembil/features/on_boarding/domain/usecase/check_onboarding.dart';
import 'package:zembil/features/on_boarding/domain/usecase/complete_onboarding.dart';
import 'package:zembil/features/on_boarding/presentation/bloc/onboarding/onboarding_bloc.dart';
import 'package:zembil/features/on_boarding/presentation/bloc/splash/splash_bloc.dart';

final locator = GetIt.instance;

Future<void> setupLocator() async {
// blocs
  locator.registerLazySingleton(() => OnboardingBloc(
        completeOnboardingUseCase: locator(),
      ));

  locator.registerLazySingleton(() => SplashBloc(
        checkAuthenticatedUseCase: locator(),
        checkOnboardingUseCase: locator(),
      ));

  locator.registerLazySingleton(() => SignUpBloc(
        signUpWithEmail: locator(),
        signInWithGoogle: locator(),
        validateEmail: locator(),
        validatePassword: locator(),
        validateConfirmPassword: locator(),
        zembilLogIn: locator(),
      ));

  locator.registerLazySingleton(() => LogInBloc(
        signInWithGoogle: locator(),
        loginWithEmail: locator(),
        zembilLogIn: locator(),
        checkVerificationEmail: locator(),
        validateEmail: locator(),
        validatePassword: locator(),
      ));

  locator.registerLazySingleton(() => EmailVerificationBloc(
        sendVerificationEmail: locator(),
        checkVerificationEmail: locator(),
        zembilLogIn: locator(),
      ));

// usecases
  locator.registerLazySingleton(() => LogInWithEmail(locator()));
  locator.registerLazySingleton(() => SignInWithGoogle(locator()));
  locator.registerLazySingleton(() => SignUpWithEmail(locator()));
  locator.registerLazySingleton(() => SignOut(locator()));
  locator.registerLazySingleton(() => ValidateEmail());
  locator.registerLazySingleton(() => ValidatePassword());
  locator.registerLazySingleton(() => ValidateConfirmPassword());
  locator.registerLazySingleton(() => CompleteOnboardingUseCase(locator()));
  locator.registerLazySingleton(() => CheckOnboardingUseCase(locator()));
  locator.registerLazySingleton(() => CheckAuthenticatedUseCase(locator()));
  locator.registerLazySingleton(() => SendVerificationEmail(locator()));
  locator.registerLazySingleton(() => CheckVerificationEmail(locator()));
  locator.registerLazySingleton(() => ZembilLogIn(locator()));

  //repositories
  locator.registerLazySingleton<AuthRepository>(
      () => AuthRepositoryImpl(locator()));
  locator.registerLazySingleton<OnboardingRepository>(
      () => OnboardingRepositoryImpl(locator(), locator()));

  // data sources
  locator
      .registerLazySingleton<AuthRemoteDataSource>(() => FirebaseAuthService());

  //external
  locator.registerLazySingleton(() => HttpClient(
      baseUrl: Urls.baseUrl,
      client: HttpClientProvider.getInstance(),
      secureStorageHelper: locator()));
  locator.registerLazySingleton(() => SecureStorageHelper());
  locator.registerLazySingleton(() => FirebaseAuthService());
  locator.registerLazySingleton(() => GoogleSignIn());
  locator.registerLazySingleton(() => HiveService());
}
