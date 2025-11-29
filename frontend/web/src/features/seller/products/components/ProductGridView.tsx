import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import EmptyState from '@/shared/components/EmptyState';
import { Product } from '../api/productsApi';

interface ProductGridViewProps {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  onSelect?: (productId: string, selected: boolean) => void;
  selectedIds?: Set<string>;
  skeletonCount?: number;
}

const ProductGridView = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onSelect,
  selectedIds = new Set(),
  skeletonCount = 12
}: ProductGridViewProps) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your filters or search query to find what you're looking for."
        action={{
          label: 'Clear Filters',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  // Products Grid
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onDuplicate={onDuplicate}
          onSelect={onSelect}
          isSelected={selectedIds.has(product._id)}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default ProductGridView;

