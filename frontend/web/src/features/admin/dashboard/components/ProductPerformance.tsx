import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import clsx from 'clsx';
import { formatCurrency } from '@/core/utils/format';
import {
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  image?: string;
  sales: number;
  revenue: number;
  stock: number;
  trend: number;
  rating?: number;
}

interface ProductPerformanceProps {
  topProducts: Product[];
  lowStockProducts: Product[];
  poorPerformers?: Product[];
}

const ProductPerformance = ({
  topProducts = [],
  lowStockProducts = [],
  poorPerformers = [],
}: ProductPerformanceProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-full">
      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <StarIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-grey-900">Top Performers</h3>
              <p className="text-sm text-grey-500">Best selling products</p>
            </div>
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-grey-400">
                <p className="text-sm">No sales data yet</p>
              </div>
            ) : (
              topProducts.slice(0, 5).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-grey-50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-grey-200 flex items-center justify-center">
                        <span className="text-2xl text-grey-400">📦</span>
                      </div>
                    )}
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-grey-900 truncate mb-1">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-grey-500">
                      <span>{product.sales} sales</span>
                      <span>•</span>
                      <span className="font-semibold text-grey-900">
                        {formatCurrency(product.revenue)}
                      </span>
                    </div>
                    {/* Stock Bar */}
                    <div className="mt-2 h-1.5 bg-grey-200 rounded-full overflow-hidden">
                      <motion.div
                        className={clsx(
                          'h-full rounded-full',
                          product.stock > 20
                            ? 'bg-emerald-500'
                            : product.stock > 10
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Trend */}
                  <div
                    className={clsx(
                      'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold',
                      product.trend > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    )}
                  >
                    {product.trend > 0 ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    <span>{Math.abs(product.trend)}%</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {/* Needs Attention */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-orange-50 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-grey-900">Needs Attention</h3>
              <p className="text-sm text-grey-500">Products requiring action</p>
            </div>
          </div>

          <div className="space-y-4">
            {lowStockProducts.length === 0 && poorPerformers.length === 0 ? (
              <div className="text-center py-8 text-grey-400">
                <p className="text-sm">All products are healthy!</p>
              </div>
            ) : (
              <>
                {lowStockProducts.slice(0, 3).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl border-2 border-orange-200 bg-orange-50/50 hover:border-orange-300 transition-colors"
                  >
                    {/* Product Image */}
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-grey-200 flex items-center justify-center">
                        <span className="text-xl text-grey-400">📦</span>
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-grey-900 truncate mb-1">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            'text-xs font-bold px-2 py-0.5 rounded-full',
                            product.stock === 0
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                          )}
                        >
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors">
                      Restock
                    </button>
                  </motion.div>
                ))}

                {poorPerformers.slice(0, 2).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (lowStockProducts.length + index) * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl border-2 border-grey-200 hover:border-grey-300 transition-colors"
                  >
                    {/* Product Image */}
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-grey-200 flex items-center justify-center">
                        <span className="text-xl text-grey-400">📦</span>
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-grey-900 truncate mb-1">
                        {product.name}
                      </p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-grey-100 text-grey-700">
                        Low Sales
                      </span>
                    </div>

                    {/* Action Button */}
                    <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">
                      Promote
                    </button>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProductPerformance;

