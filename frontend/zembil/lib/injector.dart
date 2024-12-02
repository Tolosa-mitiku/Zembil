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
import 'package:zembil/features/authentication/domain/usecase/reset_password.dart';
import 'package:zembil/features/authentication/domain/usecase/send_verification_email.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_in_with_google.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_out.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_up_with_email.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_confirm_password.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_email.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_password.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/forgot_password_bloc.dart/forgot_password_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/log_in_bloc/log_in_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/sign_up_bloc/sign_up_bloc.dart';
import 'package:zembil/features/home/data/data_sources/product_datasource.dart';
import 'package:zembil/features/home/data/data_sources/product_remote_datasource.dart';
import 'package:zembil/features/home/data/repository/product_repository_impl.dart';
import 'package:zembil/features/home/domain/repository/product_repository.dart';
import 'package:zembil/features/home/domain/usecase/get_all_products.dart';
import 'package:zembil/features/home/domain/usecase/get_featured_products.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_bloc.dart';
import 'package:zembil/features/onboarding/data/repository/onboarding.dart';
import 'package:zembil/features/onboarding/domain/repository/onboarding.dart';
import 'package:zembil/features/onboarding/domain/usecase/check_authenticated.dart';
import 'package:zembil/features/onboarding/domain/usecase/check_onboarding.dart';
import 'package:zembil/features/onboarding/domain/usecase/complete_onboarding.dart';
import 'package:zembil/features/onboarding/presentation/bloc/onboarding/onboarding_bloc.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_bloc.dart';
import 'package:zembil/features/profile/data/data_sources/profile_data_source.dart';
import 'package:zembil/features/profile/data/data_sources/profile_remote_source.dart';
import 'package:zembil/features/profile/data/repository/profile_repository_impl.dart';
import 'package:zembil/features/profile/domain/repository/profile_repository.dart';
import 'package:zembil/features/profile/domain/usecase/get_profile.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';

final locator = GetIt.instance;

Future<void> setupLocator() async {
// blocs
  //  Authentication
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
  locator.registerLazySingleton(() => ForgotPasswordBloc(
        validateEmail: locator(),
        resetPassword: locator(),
      ));

// Profile
  locator.registerLazySingleton(() => ProfileBloc(
        getProfile: locator(),
        signOut: locator(),
      ));

  locator.registerLazySingleton(() => FeaturedProductBloc(
        getProducts: locator(),
        getFeaturedProducts: locator(),
      ));

  locator.registerLazySingleton(() => ProductsByCategoryBloc(
        getProducts: locator(),
      ));
  locator.registerLazySingleton(() => ProductDetailBloc());

// usecases
  // Authentication
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
  locator.registerLazySingleton(() => ResetPassword(locator()));
  locator.registerLazySingleton(() => ZembilLogIn(locator()));
  locator.registerLazySingleton(() => GetAllProducts(locator()));
  locator.registerLazySingleton(() => GetFeaturedProducts(locator()));

  // Profile
  locator.registerLazySingleton(() => GetProfile(locator()));

//repositories
  // Authentication
  locator.registerLazySingleton<AuthRepository>(
      () => AuthRepositoryImpl(locator()));
  locator.registerLazySingleton<OnboardingRepository>(
      () => OnboardingRepositoryImpl(locator(), locator()));

  // Profile
  locator.registerLazySingleton<ProfileRepository>(
      () => ProfileRepositoryImpl(locator()));

  // Product
  locator.registerLazySingleton<ProductRepository>(
      () => ProductRepositoryImpl(locator()));

// data sources
  locator
      .registerLazySingleton<AuthRemoteDataSource>(() => FirebaseAuthService());
  // Profile
  locator.registerLazySingleton<ProfileDataSource>(
      () => ProfileRemoteSource(locator(), locator()));

  // Product
  locator.registerLazySingleton<ProductDatasource>(
      () => ProductRemoteDatasource(locator()));

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
