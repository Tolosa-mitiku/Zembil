import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  DocumentDuplicateIcon,
  StarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Badge from '@/shared/components/Badge';
import { Product } from '../api/productsApi';
import { formatCurrency } from '@/core/utils/format';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  onSelect?: (productId: string, selected: boolean) => void;
  isSelected?: boolean;
  index: number;
}

const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onSelect,
  isSelected,
  index
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  const statusColors = {
    active: 'success',
    pending: 'warning',
    inactive: 'error',
    rejected: 'error',
  } as const;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleNextImage = () => {
    if (product.images.length > 1) {
      setImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(product)}
      className={clsx(
        'group relative bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer',
        'border border-grey-200 hover:border-gold hover:shadow-heavy',
        isSelected && 'ring-2 ring-gold ring-offset-2',
        isHovered && 'transform -translate-y-2'
      )}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-3 left-3 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered || isSelected ? 1 : 0, 
              scale: isHovered || isSelected ? 1 : 0.8 
            }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(product._id, e.target.checked)}
              className="w-5 h-5 rounded border-2 border-white bg-white/80 backdrop-blur-sm 
                       checked:bg-gold checked:border-gold cursor-pointer transition-all
                       hover:scale-110 focus:ring-2 focus:ring-gold focus:ring-offset-2"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-grey-100">
        {!imageError && product.images[imageIndex] ? (
          <motion.img
            key={imageIndex}
            src={product.images[imageIndex]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-grey-100">
            <svg
              className="w-20 h-20 text-grey-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badges Overlay - Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-error text-white px-2 py-1 rounded-md text-label-medium font-bold shadow-md"
            >
              -{discountPercentage}%
            </motion.div>
          )}

          {/* Featured Star */}
          {product.isFeatured && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="bg-gold text-white p-1.5 rounded-full shadow-md"
            >
              <StarIconSolid className="w-4 h-4" />
            </motion.div>
          )}
        </div>

        {/* Stock Warning - Bottom Overlay */}
        {(isLowStock || isOutOfStock) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center gap-1.5 text-white">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="text-label-small font-medium">
                {isOutOfStock ? 'Out of Stock' : `Low Stock: ${product.stock} left`}
              </span>
            </div>
          </div>
        )}

        {/* Image Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                className={clsx(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  idx === imageIndex ? 'bg-gold w-4' : 'bg-white/60'
                )}
              />
            ))}
          </div>
        )}

        {/* Quick Actions - Appear on Hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2 pointer-events-none"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gold hover:text-white 
                     transition-colors shadow-md pointer-events-auto"
            title="Edit Product"
          >
            <PencilIcon className="w-5 h-5" />
          </motion.button>

          {onDuplicate && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(product);
              }}
              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-info hover:text-white 
                       transition-colors shadow-md pointer-events-auto"
              title="Duplicate Product"
            >
              <DocumentDuplicateIcon className="w-5 h-5" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product._id);
            }}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-error hover:text-white 
                     transition-colors shadow-md pointer-events-auto"
            title="Delete Product"
          >
            <TrashIcon className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Product Information */}
      <div className="p-4 space-y-2">
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-label-small text-grey-600 uppercase truncate">
            {product.category}
          </span>
          <Badge variant={statusColors[product.status]} size="sm">
            {product.status}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-body-medium font-semibold text-grey-900 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating !== undefined && product.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid
                  key={i}
                  className={clsx(
                    'w-3.5 h-3.5',
                    i < Math.floor(product.rating!) ? 'text-gold' : 'text-grey-300'
                  )}
                />
              ))}
            </div>
            <span className="text-label-small text-grey-600">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-title-medium text-grey-900 font-bold">
            {formatCurrency(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-body-small text-grey-500 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-2 border-t border-grey-100">
          <div className="flex items-center gap-3 text-label-small text-grey-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">{product.sold || 0}</span>
              <span>sold</span>
            </div>
            <div className="w-px h-3 bg-grey-300" />
            <div className="flex items-center gap-1">
              <span className="font-medium">{product.stock}</span>
              <span>stock</span>
            </div>
          </div>

          {/* Stock Status Badge */}
          <Badge 
            variant={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'} 
            size="sm"
          >
            {isOutOfStock ? 'Out' : isLowStock ? 'Low' : 'In Stock'}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

