import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Product } from '../types';
import { useState } from 'react';

/**
 * ProductCard - Reusable product card component
 * Features:
 * - Product image with hover zoom
 * - Discount badge
 * - Quick add to cart
 * - Wishlist toggle
 * - Rating display
 * - Smooth animations
 */

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: string, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
  index?: number; // For stagger animation
}

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  index = 0,
}: ProductCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [localWishlisted, setLocalWishlisted] = useState(isWishlisted);

  const discountPercentage = product.discount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalWishlisted(!localWishlisted);
    onToggleWishlist?.(product._id, !localWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05, // Stagger effect
        ease: 'easeOut',
      }}
    >
      <Link to={`/product/${product._id}`}>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-white rounded-lg shadow-light hover:shadow-heavy 
                   transition-shadow duration-300 overflow-hidden group h-full flex flex-col"
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-grey-100">
            {/* Image */}
            <motion.img
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.title}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
              loading="lazy"
            />

            {/* Shimmer while loading */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 animate-shimmer" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-3 py-1 bg-info text-white text-xs font-bold rounded-full">
                  NEW
                </span>
              )}
              {product.isFeatured && (
                <span className="px-3 py-1 bg-gold text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <StarIcon className="w-3 h-3 fill-current" />
                  FEATURED
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="px-3 py-1 bg-error text-white text-xs font-bold rounded-full">
                  -{discountPercentage}%
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm 
                       rounded-full flex items-center justify-center shadow-medium
                       hover:bg-white transition-colors"
            >
              {localWishlisted ? (
                <HeartIconSolid className="w-5 h-5 text-error" />
              ) : (
                <HeartIcon className="w-5 h-5 text-grey-700" />
              )}
            </motion.button>

            {/* Quick Add to Cart - Shows on hover */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="absolute bottom-3 left-3 right-3 py-2.5 bg-gold text-white 
                       rounded-lg font-medium flex items-center justify-center gap-2
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300
                       hover:bg-gold-dark"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              Quick Add
            </motion.button>
          </div>

          {/* Product Info */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Category */}
            <p className="text-xs text-grey-600 mb-1 uppercase tracking-wide">
              {product.category}
            </p>

            {/* Title */}
            <h3 className="text-base font-semibold text-grey-900 mb-2 line-clamp-2 flex-1">
              {product.title}
            </h3>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!)
                          ? 'text-gold fill-gold'
                          : 'text-grey-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-grey-600">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gold">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-grey-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.stock < 10 && product.stock > 0 && (
              <p className="text-xs text-warning mt-2 font-medium">
                Only {product.stock} left in stock!
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-xs text-error mt-2 font-medium">Out of stock</p>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

