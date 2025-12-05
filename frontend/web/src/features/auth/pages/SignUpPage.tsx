import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signUp, signInWithGoogle, login } from '../store/authSlice';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { EnvelopeIcon, LockClosedIcon, ShoppingBagIcon, BuildingStorefrontIcon, ArrowLeftIcon, CheckCircleIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

const SignUpPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const location = useLocation();
  const initialTab = (location.state as { tab?: 'signup' | 'signin' })?.tab || 'signup';
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>(initialTab);

  // Get role from navigation state
  const role = (location.state as { role?: 'buyer' | 'seller' })?.role;

  // If no role selected, redirect to homepage
  if (!role) {
    navigate('/');
    return null;
  }

  const roleConfig = {
    buyer: {
      name: 'Buyer',
      icon: ShoppingBagIcon,
      gradient: 'from-blue-600 to-indigo-600',
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      accentColor: 'text-blue-600',
      borderAccent: 'border-blue-600',
      bgAccent: 'bg-blue-600',
      welcomeTitle: 'Join the Marketplace',
      welcomeDesc: 'Experience shopping reimagined. Connect with creators and find products that tell a story.',
      benefits: [
        'Curated unique products',
        'Secure & buyer protection',
        'Direct chat with sellers',
        'Exclusive deals & offers'
      ]
    },
    seller: {
      name: 'Seller',
      icon: BuildingStorefrontIcon,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-500/10 to-orange-600/10',
      accentColor: 'text-amber-600',
      borderAccent: 'border-amber-600',
      bgAccent: 'bg-amber-600',
      welcomeTitle: 'Grow Your Business',
      welcomeDesc: 'Turn your passion into profit. We provide the tools, you provide the talent.',
      benefits: [
        '0% listing fees',
        'Powerful analytics dashboard',
        'Global customer reach',
        '24/7 Seller support'
      ]
    }
  };

  const currentRole = roleConfig[role];

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: signUpErrors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSignUpSubmit = async (data: SignUpFormData) => {
    const result = await dispatch(signUp({
      email: data.email,
      password: data.password,
      name: data.name,
      role: role,
    }));
    
    if (signUp.fulfilled.match(result)) {
      handleAuthSuccess(result.payload);
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    const result = await dispatch(login(data));
    
    if (login.fulfilled.match(result)) {
      handleAuthSuccess(result.payload);
    }
  };

  const handleAuthSuccess = (user: any) => {
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user.role === 'seller') {
      navigate('/seller/dashboard');
    } else if (user.role === 'buyer') {
      navigate('/'); 
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await dispatch(signInWithGoogle());
    
    if (signInWithGoogle.fulfilled.match(result)) {
      handleAuthSuccess(result.payload);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gold-pale via-white to-grey-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[1.5rem] shadow-2xl w-[95%] max-w-[1000px] overflow-hidden flex flex-col md:flex-row h-[580px] max-h-[85vh]"
      >
        {/* Left Side - Visual (40%) */}
        <div className={`
          relative w-full md:w-2/5 p-6 md:p-8 text-white
          bg-gradient-to-br ${currentRole.gradient}
          flex flex-col justify-between overflow-hidden
        `}>
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

          {/* Top Content */}
          <div className="relative z-10">
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center text-xs font-medium text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-3 h-3 mr-1.5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-6">
            <div className="inline-flex p-3 rounded-xl bg-white/10 backdrop-blur-sm mb-6 shadow-xl border border-white/20">
              <currentRole.icon className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight leading-tight">
              {currentRole.welcomeTitle}
            </h2>
            
            <p className="text-white/90 text-xs mb-8 leading-relaxed max-w-lg font-light">
              {currentRole.welcomeDesc}
            </p>

            <div className="space-y-3">
              {currentRole.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-white/90">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <CheckCircleIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 text-center text-[10px] text-white/60">
            © 2025 Zembil. All rights reserved.
          </div>
        </div>

        {/* Right Side - Form (60%) */}
        <div className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto bg-white flex flex-col">
          <div className="max-w-sm mx-auto w-full flex flex-col h-full">
            
            {/* Tabs - Fixed at Top */}
            <div className="flex justify-center mb-4 border-b border-gray-100 relative shrink-0">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`pb-3 text-sm font-semibold transition-colors duration-200 relative ${
                    activeTab === 'signup' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Create Account
                  {activeTab === 'signup' && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${currentRole.bgAccent}`}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
                
                {/* Vertical Separator */}
                <div className="h-4 w-px bg-gray-200 mb-3" />

                <button
                  onClick={() => setActiveTab('signin')}
                  className={`pb-3 text-sm font-semibold transition-colors duration-200 relative ${
                    activeTab === 'signin' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Sign In
                  {activeTab === 'signin' && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${currentRole.bgAccent}`}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="text-center mb-8">
              {/* Removed redundant text block as per user request */}
            </div>

            {/* Form Content - Centered Vertically */}
            <div className="flex-1 flex flex-col justify-center pb-8">
              <div className="mb-4">
                <Button
                  type="button"
                variant="secondary"
                size="md"
                className="w-full text-xs py-1.5"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                }
              >
                {activeTab === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
              </Button>

              <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500">
                    Or {activeTab === 'signup' ? 'register' : 'sign in'} with email
                  </span>
                </div>
              </div>
            </div>

            {activeTab === 'signup' ? (
              <form onSubmit={handleSubmitSignUp(onSignUpSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  leftIcon={<UserIcon className="w-4 h-4" />}
                  error={signUpErrors.name?.message}
                  labelClassName="text-xs font-medium"
                  className="text-xs placeholder:text-xs py-2 pl-9"
                  {...registerSignUp('name')}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  leftIcon={<EnvelopeIcon className="w-4 h-4" />}
                  error={signUpErrors.email?.message}
                  labelClassName="text-xs font-medium"
                  className="text-xs placeholder:text-xs py-2 pl-9"
                  {...registerSignUp('email')}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    leftIcon={<LockClosedIcon className="w-4 h-4" />}
                    error={signUpErrors.password?.message}
                    labelClassName="text-xs font-medium"
                    className="text-xs placeholder:text-xs py-2 pl-9"
                    {...registerSignUp('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-[29px] text-gray-400 hover:text-gray-600 transition-colors p-1`}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    leftIcon={<LockClosedIcon className="w-4 h-4" />}
                    error={signUpErrors.confirmPassword?.message}
                    labelClassName="text-xs font-medium"
                    className="text-xs placeholder:text-xs py-2 pl-9"
                    {...registerSignUp('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-[29px] text-gray-400 hover:text-gray-600 transition-colors p-1`}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className={`w-full mt-4 text-xs py-1.5 bg-gradient-to-r ${currentRole.gradient} hover:opacity-90 transition-opacity border-none`}
                  isLoading={isLoading}
                >
                  Create {currentRole.name} Account
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  leftIcon={<EnvelopeIcon className="w-4 h-4" />}
                  error={loginErrors.email?.message}
                  labelClassName="text-xs font-medium"
                  className="text-xs placeholder:text-xs py-2 pl-9"
                  {...registerLogin('email')}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    leftIcon={<LockClosedIcon className="w-4 h-4" />}
                    error={loginErrors.password?.message}
                    labelClassName="text-xs font-medium"
                    className="text-xs placeholder:text-xs py-2 pl-9"
                    {...registerLogin('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-[29px] text-gray-400 hover:text-gray-600 transition-colors p-1`}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className={`w-full mt-4 text-xs py-1.5 bg-gradient-to-r ${currentRole.gradient} hover:opacity-90 transition-opacity border-none`}
                  isLoading={isLoading}
                >
                  Sign In
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
