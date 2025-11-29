import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signUp, signInWithGoogle } from '../store/authSlice';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    const result = await dispatch(signUp({
      email: data.email,
      password: data.password,
      name: data.name,
    }));
    
    if (signUp.fulfilled.match(result)) {
      const user = result.payload;
      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'seller') {
        navigate('/seller/dashboard');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await dispatch(signInWithGoogle());
    
    if (signInWithGoogle.fulfilled.match(result)) {
      const user = result.payload;
      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'seller') {
        navigate('/seller/dashboard');
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-grey-900 mb-2">
          Create account
        </h2>
        <p className="text-sm text-grey-600">
          Join Zembil as a seller or admin
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          leftIcon={<UserIcon className="w-5 h-5" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          leftIcon={<EnvelopeIcon className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            leftIcon={<LockClosedIcon className="w-5 h-5" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[42px] text-sm text-gold hover:text-gold-dark transition-colors font-medium"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            leftIcon={<LockClosedIcon className="w-5 h-5" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[42px] text-sm text-gold hover:text-gold-dark transition-colors font-medium"
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-grey-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-grey-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            leftIcon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Sign up with Google
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-grey-600">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:text-gold-dark font-semibold">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-grey-500">
          Only sellers and admins can access this dashboard
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

