/**
 * Empty Orders State
 * Empty state component for when user has no orders
 */

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const EmptyOrdersState = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
      <p className="text-gray-600 mb-6">
        You haven't placed any orders yet. Start shopping to see your order history here.
      </p>
      <button
        onClick={() => navigate('/shop')}
        className="px-6 py-3 bg-gold text-white rounded-xl font-bold hover:bg-gold-dark transition-all shadow-lg"
      >
        Start Shopping
      </button>
    </div>
  );
};

export default EmptyOrdersState;

