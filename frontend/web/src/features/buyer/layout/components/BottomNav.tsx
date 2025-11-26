import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';

/**
 * BottomNav - Mobile bottom navigation bar
 * Features:
 * - Fixed at bottom on mobile
 * - Active state indicators
 * - Gold accent for active items
 * - Smooth animations
 */

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    path: '/shop',
    label: 'Shop',
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid,
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: ShoppingBagIcon,
    iconSolid: ShoppingBagIconSolid,
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: UserIcon,
    iconSolid: UserIconSolid,
  },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-grey-200 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex-1 flex flex-col items-center justify-center h-full group"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-gold' : 'text-grey-600 group-hover:text-gold'
                  }`}
                />
                <span
                  className={`text-xs mt-1 font-medium transition-colors ${
                    isActive ? 'text-gold' : 'text-grey-600 group-hover:text-gold'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gold rounded-b-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

