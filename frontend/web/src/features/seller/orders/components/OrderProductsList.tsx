import { Order } from '../api/ordersApi';
import { motion } from 'framer-motion';
import { ShoppingBagIcon, CubeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface OrderProductsListProps {
  order: Order;
}

const OrderProductsList = ({ order }: OrderProductsListProps) => {
  // Calculate totals
  const itemsSubtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 0; // Free shipping
  const tax = 0; // No tax for now
  const discount = 0; // No discount for now
  const platformFee = order.totalPrice * 0.05; // 5% platform fee
  const sellerEarnings = order.totalPrice - platformFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-grey-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-grey-900">Products Ordered</h2>
              <p className="text-sm text-grey-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-grey-600">Total Items</div>
            <div className="text-2xl font-bold text-purple-600">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {order.items.map((item, index) => (
            <motion.div
              key={`${item.productId}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={clsx(
                'group relative bg-grey-50 rounded-xl p-4 border border-grey-200',
                'hover:shadow-lg hover:border-gold/50 hover:-translate-y-1',
                'transition-all duration-300 cursor-pointer'
              )}
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-lg overflow-hidden bg-white border border-grey-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-grey-100">
                        <CubeIcon className="w-12 h-12 text-grey-400" />
                      </div>
                    )}
                  </div>
                  {/* Quantity Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-sm font-bold shadow-lg">
                    ×{item.quantity}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-grey-900 mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* SKU */}
                  <div className="text-xs text-grey-500 mb-2 font-mono">
                    ID: {item.productId.slice(-8)}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-grey-600">Unit Price:</span>
                      <span className="font-semibold text-grey-900">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-grey-600">Quantity:</span>
                      <span className="font-semibold text-grey-900">×{item.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-grey-200">
                      <span className="font-semibold text-grey-700">Subtotal:</span>
                      <span className="text-lg font-bold text-gold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="mt-6 p-6 bg-gradient-to-br from-grey-50 to-grey-100 rounded-xl border border-grey-200">
          <h3 className="text-lg font-bold text-grey-900 mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            {/* Items Subtotal */}
            <div className="flex items-center justify-between text-grey-700">
              <span className="text-sm">Items Subtotal ({order.items.length} items)</span>
              <span className="font-semibold">${itemsSubtotal.toFixed(2)}</span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-grey-700">
                Shipping Cost
                {order.carrier && (
                  <span className="ml-2 text-xs text-grey-500">via {order.carrier}</span>
                )}
              </span>
              <span className="font-semibold text-green-600">
                {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>

            {/* Tax */}
            {tax > 0 && (
              <div className="flex items-center justify-between text-grey-700">
                <span className="text-sm">Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
            )}

            {/* Discount */}
            {discount > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span className="text-sm">Discount</span>
                <span className="font-semibold">-${discount.toFixed(2)}</span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t-2 border-grey-300 pt-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-semibold text-grey-900">Order Total</span>
                <span className="text-2xl font-bold text-gold">${order.totalPrice.toFixed(2)}</span>
              </div>

              {/* Platform Fee (Collapsible) */}
              <details className="group mt-4 p-4 bg-white rounded-lg border border-grey-200">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="text-sm font-medium text-grey-700">Breakdown</span>
                  <svg
                    className="w-5 h-5 text-grey-500 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                
                <div className="mt-4 pt-4 border-t border-grey-200 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-grey-600">Platform Fee (5%)</span>
                    <span className="text-red-600 font-semibold">-${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-grey-200">
                    <span className="font-semibold text-grey-900">Your Earnings</span>
                    <span className="text-lg font-bold text-green-600">${sellerEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderProductsList;

