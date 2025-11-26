import 'package:get_it/get_it.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:zembil/core/constants.dart';
import 'package:zembil/core/connectivity_service.dart';
import 'package:zembil/core/hive.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/core/secure_storage.dart';
import 'package:zembil/core/theme/cubit/theme_cubit.dart';
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
import 'package:zembil/features/authentication/presentation/bloc/auth_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/forgot_password_bloc.dart/forgot_password_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/log_in_bloc/log_in_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/sign_up_bloc/sign_up_bloc.dart';
import 'package:zembil/features/cart/data/data_sources/cart_data_source.dart';
import 'package:zembil/features/cart/data/data_sources/cart_local_data_source.dart';
import 'package:zembil/features/cart/data/repository/cart_repository_impl.dart';
import 'package:zembil/features/cart/domain/repository/cart_repository.dart';
import 'package:zembil/features/cart/domain/usecase/add_to_cart.dart';
import 'package:zembil/features/cart/domain/usecase/get_cart.dart';
import 'package:zembil/features/cart/domain/usecase/remove_from_cart.dart';
import 'package:zembil/features/cart/domain/usecase/update_cart.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_bloc.dart';
import 'package:zembil/features/home/data/data_sources/product_data_source.dart';
import 'package:zembil/features/home/data/data_sources/product_remote_data_source.dart';
import 'package:zembil/features/home/data/repository/product_repository_impl.dart';
import 'package:zembil/features/home/domain/repository/product_repository.dart';
import 'package:zembil/features/home/domain/usecase/get_all_products.dart';
import 'package:zembil/features/home/domain/usecase/get_featured_products.dart';
import 'package:zembil/features/home/domain/usecase/get_product.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_bloc.dart';
import 'package:zembil/features/onboarding/data/data_sources/onboarding_data_source.dart';
import 'package:zembil/features/onboarding/data/data_sources/onboarding_local_data_source.dart';
import 'package:zembil/features/onboarding/data/repository/onboarding_impl.dart';
import 'package:zembil/features/onboarding/domain/repository/onboarding_repository.dart';
import 'package:zembil/features/onboarding/domain/usecase/check_authenticated.dart';
import 'package:zembil/features/onboarding/domain/usecase/check_onboarding.dart';
import 'package:zembil/features/onboarding/domain/usecase/complete_onboarding.dart';
import 'package:zembil/features/onboarding/presentation/bloc/onboarding/onboarding_bloc.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_bloc.dart';
import 'package:zembil/features/orders/data/data_sources/order_remote_data_source.dart';
import 'package:zembil/features/orders/data/repository/order_repository_impl.dart';
import 'package:zembil/features/orders/domain/repository/order_repository.dart';
import 'package:zembil/features/orders/domain/usecase/cancel_order.dart';
import 'package:zembil/features/orders/domain/usecase/get_order_by_id.dart';
import 'package:zembil/features/orders/domain/usecase/get_user_orders.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_bloc.dart';
import 'package:zembil/features/payments/data/data_sources/payment_data_sources.dart';
import 'package:zembil/features/payments/data/data_sources/remote_payment_data_sources.dart';
import 'package:zembil/features/payments/data/repository/payment_repository_impl.dart';
import 'package:zembil/features/payments/domain/repository/payment_repository.dart';
import 'package:zembil/features/payments/domain/usecase/initiate_stripe_payment.dart';
import 'package:zembil/features/profile/data/data_sources/profile_data_source.dart';
import 'package:zembil/features/profile/data/data_sources/profile_remote_data_source.dart';
import 'package:zembil/features/profile/data/repository/profile_repository_impl.dart';
import 'package:zembil/features/profile/domain/repository/profile_repository.dart';
import 'package:zembil/features/profile/domain/usecase/get_profile.dart';
import 'package:zembil/features/profile/domain/usecase/update_profile.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';

final locator = GetIt.instance;

Future<void> setupLocator() async {
// blocs
  //  Theme
  locator.registerLazySingleton(() => ThemeCubit(locator()));

  //  Authentication
  locator.registerLazySingleton(() => AuthBloc(
        secureStorageHelper: locator(),
        signOut: locator(),
      ));

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

  locator.registerFactory(() => LogInBloc(
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
        updateProfile: locator(),
        signOut: locator(),
      ));

  locator.registerLazySingleton(() => FeaturedProductBloc(
        getFeaturedProducts: locator(),
      ));

  locator.registerLazySingleton(() => ProductsByCategoryBloc(
        getProductsByCategory: locator(),
      ));
  locator.registerLazySingleton(() => ProductDetailBloc(
      getProduct: locator(),
      getRelatedProducts: locator(),
      addToCart: locator()));

  locator.registerLazySingleton(() => CartBloc(
      getCart: locator(),
      addToCart: locator(),
      removeFromCart: locator(),
      updateCart: locator(),
      initiateStripePayment: locator()));

  // Orders
  locator.registerFactory(() => OrdersBloc(
        getUserOrders: locator(),
        getOrderById: locator(),
        cancelOrder: locator(),
      ));

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
  locator.registerLazySingleton(() => GetProduct(locator()));
  locator.registerLazySingleton(() => GetProductsByCategory(locator()));
  locator.registerLazySingleton(() => GetFeaturedProducts(locator()));
  locator.registerLazySingleton(() => GetCart(locator()));
  locator.registerLazySingleton(() => AddToCart(locator()));
  locator.registerLazySingleton(() => RemoveFromCart(locator()));
  locator.registerLazySingleton(() => UpdateCart(locator()));
  locator.registerLazySingleton(() => InitiateStripePayment(locator()));

  // Profile
  locator.registerLazySingleton(() => GetProfile(locator()));
  locator.registerLazySingleton(() => UpdateProfile(locator()));

  // Orders
  locator.registerLazySingleton(() => GetUserOrders(locator()));
  locator.registerLazySingleton(() => GetOrderById(locator()));
  locator.registerLazySingleton(() => CancelOrder(locator()));

//repositories
  // Authentication
  locator.registerLazySingleton<AuthRepository>(
      () => AuthRepositoryImpl(locator()));
  // Onboarding
  locator.registerLazySingleton<OnboardingRepository>(
      () => OnboardingRepositoryImpl(locator()));
  // Profile
  locator.registerLazySingleton<ProfileRepository>(
      () => ProfileRepositoryImpl(locator()));
  // Product
  locator.registerLazySingleton<ProductRepository>(
      () => ProductRepositoryImpl(productDatasource: locator()));
  // Cart
  locator.registerLazySingleton<CartRepository>(
      () => CartRepositoryImpl(locator()));
  // Payment
  locator.registerLazySingleton<PaymentRepository>(
      () => PaymentRepositoryImpl(locator()));

  // Orders
  locator.registerLazySingleton<OrderRepository>(
      () => OrderRepositoryImpl(locator()));

// data sources
  // Authentication
  locator.registerLazySingleton<AuthRemoteDataSource>(() => locator());
  // Onboarding
  locator.registerLazySingleton<OnboardingDataSource>(
      () => OnboardingLocalDataSource(locator(), locator()));
  // Profile
  locator.registerLazySingleton<ProfileDataSource>(
      () => ProfileRemoteSource(locator(), locator(), locator()));
  // Product
  locator.registerLazySingleton<ProductDatasource>(
      () => ProductRemoteDatasource(locator(), locator()));
  // Cart
  locator.registerLazySingleton<CartDataSource>(
      () => CartLocalDataSource(locator()));
  // Payment
  locator.registerLazySingleton<PaymentDatasources>(
      () => RemotePaymentDataSources());

  // Orders
  locator.registerLazySingleton<OrderDataSource>(
      () => OrderRemoteDataSource(locator()));

  //external
  locator.registerLazySingleton(() => HttpClient(
      baseUrl: Urls.baseUrl,
      client: HttpClientProvider.getInstance(),
      secureStorageHelper: locator(),
      connectivityService: locator()));
  locator.registerLazySingleton(() => SecureStorageHelper());
  locator.registerLazySingleton(() => FirebaseAuthService(
      httpClient: locator(),
      secureStorageHelper: locator()));
  locator.registerLazySingleton(() => GoogleSignIn());
  locator.registerLazySingleton(() => HiveService());
  locator.registerLazySingleton(() => ConnectivityService());
}
