import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  TruckIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { signOut } from '@/features/auth/store/authSlice';
import RoleSelectionModal from '@/features/auth/components/RoleSelectionModal';
import Dropdown from '@/shared/components/Dropdown';
import FilterPanel, { FilterState } from '@/features/buyer/search/components/FilterPanel';
import SearchOverlay from '@/features/buyer/search/components/SearchOverlay';
import NotificationDropdown from './NotificationDropdown';
import { useGetCartQuery, useGetCurrentUserQuery } from '@/features/buyer/home/api/userApi';

/**
 * TopNav - Modern navigation bar for buyers
 * Features:
 * - Glassmorphism effect
 * - Prominent search bar
 * - Cart with badge
 * - User profile dropdown
 * - Language selector
 * - Mobile menu
 */
const TopNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSignInDropdownOpen, setIsSignInDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  // Get auth state
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Fetch user data from backend (only if authenticated)
  const { data: backendUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Fetch cart data (only if authenticated)
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 60000, // Poll every minute to keep cart fresh
  });
  
  // Handle both array format (from userApi) and Cart object format (from cartApi)
  const cartItems = Array.isArray(cartData) ? cartData : (cartData?.items || []);

  // Use backend user data if available, fallback to Redux user
  const displayUser = backendUser || user;

  const handleSignInSelect = (role: 'buyer' | 'seller') => {
    navigate('/signup', { state: { role, tab: 'signin' } });
    setIsSignInDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleApplyFilters = (filters: FilterState) => {
    // This can be used to apply filters globally
    // For now, just log them
    console.log('Filters applied:', filters);
    setIsFilterOpen(false);
  };

  // Get cart count from API
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const unreadMessages = 0; // TODO: Implement messages API
  const unreadNotifications = 0; // TODO: Implement notifications API 

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  const userMenuItems = [
    {
      label: 'Profile',
      onClick: () => navigate('/profile'),
      icon: <UserCircleIcon className="w-5 h-5" />,
    },
    {
      label: 'Orders',
      onClick: () => navigate('/orders'),
      icon: <ShoppingBagIcon className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      onClick: () => navigate('/profile/settings'),
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
    {
      label: 'Sign Out',
      onClick: handleSignOut,
      icon: <ArrowRightOnRectangleIcon className="w-5 h-5" />,
      variant: 'danger' as const,
    },
  ];

  const langItems = [
    { label: 'English (EN)', onClick: () => setCurrentLang('EN') },
    { label: 'Amharic (AM)', onClick: () => setCurrentLang('AM') },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        onClick={() => {
          if (isSearchOpen) setIsSearchOpen(false);
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20"
              >
                <span className="text-white font-bold text-xl font-display">Z</span>
              </motion.div>
              <span className="text-2xl font-bold text-grey-900 hidden sm:block tracking-tight">
                Zembil
              </span>
            </Link>

            {/* Search Bar - Center */}
            <div className="hidden md:flex flex-1 max-w-2xl relative group" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onClick={() => setIsSearchOpen(true)}
                  placeholder="Search for products..."
                  className="w-full px-6 py-3 pl-12 pr-12 rounded-2xl border border-grey-200 bg-grey-50/50
                           focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/10 focus:bg-white
                           transition-all duration-300 text-grey-900 placeholder-grey-400 shadow-sm"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400 group-focus-within:text-gold transition-colors pointer-events-none" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchOpen(true);
                    setIsFilterOpen(true);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gold transition-colors"
                  title="Open Filters"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions - Right */}
            <div className="hidden md:flex items-center space-x-3 shrink-0">
              {/* Language Selector */}
              <Dropdown
                align="right"
                trigger={
                  <button className="p-2.5 rounded-xl hover:bg-grey-100/80 text-grey-600 hover:text-gold transition-all duration-200 flex items-center gap-1 group">
                    <GlobeAltIcon className="w-6 h-6" />
                    <span className="text-sm font-medium">{currentLang}</span>
                    <ChevronDownIcon className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                  </button>
                }
                items={langItems}
              />

              {isAuthenticated ? (
                <>
                  {/* Wishlist */}
                  <Link to="/wishlist">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-xl hover:bg-grey-100/80 text-grey-600 hover:text-red-500 transition-all duration-200 relative group"
                    >
                      <HeartIcon className="w-6 h-6" />
                      <span className="absolute inset-0 rounded-xl bg-red-500/10 scale-0 group-hover:scale-100 transition-transform duration-200" />
                    </motion.button>
                  </Link>

                  {/* Messages */}
                  <Link to="/messages">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-xl hover:bg-grey-100/80 text-grey-600 hover:text-gold transition-all duration-200 relative group"
                    >
                      <ChatBubbleLeftRightIcon className="w-6 h-6" />
                      <span className="absolute inset-0 rounded-xl bg-gold/10 scale-0 group-hover:scale-100 transition-transform duration-200" />
                      {unreadMessages > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white 
                                   text-xs font-bold rounded-full flex items-center justify-center shadow-sm border-2 border-white"
                        >
                          {unreadMessages}
                        </motion.span>
                      )}
                    </motion.button>
                  </Link>

                  {/* Notifications */}
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNotificationOpen(!isNotificationOpen);
                      }}
                      className="p-2.5 rounded-xl hover:bg-grey-100/80 text-grey-600 hover:text-gold transition-all duration-200 relative group"
                    >
                      <BellIcon className="w-6 h-6" />
                      <span className="absolute inset-0 rounded-xl bg-gold/10 scale-0 group-hover:scale-100 transition-transform duration-200" />
                      {unreadNotifications > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white 
                                   text-xs font-bold rounded-full flex items-center justify-center shadow-sm border-2 border-white"
                        >
                          {unreadNotifications}
                        </motion.span>
                      )}
                    </button>

                    <NotificationDropdown 
                      isOpen={isNotificationOpen}
                      onClose={() => setIsNotificationOpen(false)}
                    />
                  </div>

                  {/* Cart */}
                  <Link to="/cart">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-xl hover:bg-grey-100/80 text-grey-600 hover:text-gold transition-all duration-200 relative group"
                    >
                      <ShoppingCartIcon className="w-6 h-6" />
                      <span className="absolute inset-0 rounded-xl bg-gold/10 scale-0 group-hover:scale-100 transition-transform duration-200" />
                      {cartItemCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white 
                                   text-xs font-bold rounded-full flex items-center justify-center shadow-sm border-2 border-white"
                        >
                          {cartItemCount}
                        </motion.span>
                      )}
                    </motion.button>
                  </Link>

                  {/* User Profile Dropdown */}
                  <div className="pl-2">
                    <Dropdown
                      align="right"
                      trigger={
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-3 pl-1 pr-2 py-1 rounded-full hover:bg-grey-50 border border-transparent hover:border-grey-200 transition-all duration-200"
                        >
                          {displayUser?.image ? (
                            <img
                              src={displayUser.image}
                              alt={displayUser.name}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-gold/20"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white font-bold text-sm shadow-md shadow-gold/20">
                              {displayUser?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="text-left hidden lg:block">
                            <p className="text-sm font-bold text-grey-900 leading-none mb-0.5">
                              {displayUser?.name?.split(' ')[0] || 'User'}
                            </p>
                            <p className="text-[10px] font-medium text-grey-500 uppercase tracking-wider">
                              {backendUser?.role || 'Buyer'}
                            </p>
                          </div>
                          <ChevronDownIcon className="w-4 h-4 text-grey-400" />
                        </motion.button>
                      }
                      items={userMenuItems}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 pl-2">
                  <div className="relative">
                    <button
                      onClick={() => setIsSignInDropdownOpen(!isSignInDropdownOpen)}
                      className="px-5 py-2.5 text-grey-700 hover:text-gold font-semibold transition-colors flex items-center gap-1.5"
                    >
                      Sign In
                      <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isSignInDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isSignInDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-grey-900/10 border border-grey-100 overflow-hidden z-50 origin-top-right p-2"
                        >
                          <button
                            onClick={() => handleSignInSelect('buyer')}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-3 group"
                          >
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <ShoppingBagIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="block font-semibold text-gray-900">Buyer</span>
                              <span className="block text-xs text-gray-500">Shop for products</span>
                            </div>
                          </button>
                          <button
                            onClick={() => handleSignInSelect('seller')}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-amber-50 transition-colors flex items-center gap-3 group mt-1"
                          >
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                              <TruckIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="block font-semibold text-gray-900">Seller</span>
                              <span className="block text-xs text-gray-500">Sell your products</span>
                            </div>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRoleModalOpen(true)}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold
                             hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <span>Sign Up</span>
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-grey-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-7 h-7 text-grey-900" />
              ) : (
                <Bars3Icon className="w-7 h-7 text-grey-900" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-grey-100 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-grey-900" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="pb-4 mb-4 border-b border-grey-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-grey-500 uppercase tracking-wider">Menu</span>
                  </div>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-grey-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-grey-900 font-bold">Profile</span>
                          <span className="block text-xs text-grey-500">Manage account</span>
                        </div>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-grey-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                          <HeartIcon className="w-5 h-5" />
                        </div>
                        <span className="text-grey-900 font-bold">Wishlist</span>
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-grey-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                          <ShoppingCartIcon className="w-5 h-5" />
                        </div>
                        <span className="text-grey-900 font-bold">Cart</span>
                        {cartItemCount > 0 && (
                          <span className="ml-auto px-2 py-1 bg-gold text-white text-xs font-bold rounded-full">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-grey-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-grey-100 flex items-center justify-center text-grey-600">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <span className="text-grey-900 font-bold">Sign In</span>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-gray-900 text-white shadow-lg shadow-gray-900/20 mt-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                          <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
                
                <div className="pt-2">
                  <span className="text-sm font-bold text-grey-500 uppercase tracking-wider mb-3 block px-3">Settings</span>
                  <button 
                    onClick={() => setCurrentLang(currentLang === 'EN' ? 'AM' : 'EN')}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-grey-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                      <GlobeAltIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-grey-900 font-bold">Language</span>
                      <span className="block text-xs text-grey-500">{currentLang === 'EN' ? 'English' : 'Amharic'}</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <RoleSelectionModal 
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Global Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchQuery}
      />

      {/* Global Filter Panel - Overlays any page */}
      <FilterPanel 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
};

export default TopNav;

