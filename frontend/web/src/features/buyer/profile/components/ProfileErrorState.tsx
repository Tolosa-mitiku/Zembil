/**
 * Profile Error State
 * Error state component for profile page
 */

import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ProfileErrorStateProps {
  error?: string;
  onRetry?: () => void;
}

const ProfileErrorState = ({ error, onRetry }: ProfileErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Profile
          </h2>
          <p className="text-gray-600">
            {error || 'We encountered an error while loading your profile. Please try again.'}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full px-6 py-3 bg-gold text-white rounded-xl font-bold hover:bg-gold-dark transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileErrorState;

