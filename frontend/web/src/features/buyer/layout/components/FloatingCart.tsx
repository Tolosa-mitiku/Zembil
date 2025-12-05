import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

/**
 * FloatingCart - Floating cart button for desktop
 * Features:
 * - Fixed position bottom-right
 * - Shows cart item count
 * - Pulse animation when items added
 * - Hidden on mobile (uses bottom nav)
 */
const FloatingCart = () => {
  // Get cart count from Redux (to be implemented)
  const cartItemCount = 0; // useSelector((state: RootState) => state.cart.items.length);

  return (
    <Link to="/cart">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="hidden lg:flex fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br 
                   from-gold-light to-gold-dark text-white rounded-full shadow-heavy
                   items-center justify-center z-40 hover:shadow-glow-purple group"
      >
        <ShoppingCartIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />

        {/* Cart Count Badge */}
        <AnimatePresence>
          {cartItemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white 
                       text-xs font-bold rounded-full flex items-center justify-center
                       ring-4 ring-white"
            >
              {cartItemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </Link>
  );
};

export default FloatingCart;

