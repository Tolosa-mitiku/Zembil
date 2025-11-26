import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import FloatingCart from './FloatingCart';

/**
 * BuyerLayout - Main layout for buyer-facing pages
 * Features:
 * - Modern top navigation with search
 * - Mobile bottom navigation
 * - Floating cart button
 * - Smooth page transitions
 */
const BuyerLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation - Fixed */}
      <TopNav />

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="pt-16 pb-20 lg:pb-8"
      >
        <Outlet />
      </motion.main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />

      {/* Floating Cart Button - Desktop */}
      <FloatingCart />
    </div>
  );
};

export default BuyerLayout;

