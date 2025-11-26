import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { signOut } from '@/features/auth/store/authSlice';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfile = () => {
    console.log('Profile clicked! User role:', user?.role);
    if (user?.role === 'admin') {
      console.log('Navigating to /admin/profile');
      navigate('/admin/profile');
    } else {
      console.log('Navigating to /seller/profile');
      navigate('/seller/profile');
    }
  };

  const handleSettings = () => {
    if (user?.role === 'admin') {
      navigate('/admin/settings');
    } else {
      navigate('/seller/settings');
    }
  };

  const userMenuItems = [
    {
      label: 'Profile',
      onClick: handleProfile,
      icon: <UserCircleIcon className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      onClick: handleSettings,
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
    {
      label: 'Sign Out',
      onClick: handleSignOut,
      icon: <ArrowRightOnRectangleIcon className="w-5 h-5" />,
      variant: 'danger' as const,
    },
  ];

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'short', 
    year: '2-digit' 
  });

  return (
    <header className="h-20 bg-white shadow-sm px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <p className="text-sm text-grey-500 mb-1">
          {today.toLocaleDateString('en-US', { weekday: 'long' })}
        </p>
        <h2 className="text-xl font-semibold text-grey-900">
          Welcome back, {user?.name || 'User'}! 👋
        </h2>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Date Display */}
        <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-grey-50 rounded-lg">
          <svg className="w-5 h-5 text-grey-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-grey-700">{formattedDate}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-grey-50 rounded-lg transition-colors">
          <svg className="w-6 h-6 text-grey-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full"></span>
        </button>

        {/* User Menu */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-grey-50 transition-colors border border-grey-200">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-pale"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white font-semibold">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-grey-900">
                  {user?.name}
                </p>
                <p className="text-xs text-grey-500 capitalize">
                  {user?.role}
                </p>
              </div>
              <svg className="w-4 h-4 text-grey-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
};

export default Header;

