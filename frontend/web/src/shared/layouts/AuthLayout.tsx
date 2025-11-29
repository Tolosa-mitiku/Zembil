import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

const AuthLayout = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-pale via-white to-grey-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-2xl mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-grey-900 mb-3">Zembil</h1>
          <p className="text-base text-grey-600">
            Seller & Admin Dashboard
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-grey-100 p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

