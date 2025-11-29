import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  EyeIcon,
  ShoppingBagIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {  StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useGetSellerProductQuery, useDeleteProductMutation } from '../api/productsApi';
import { ImageGalleryViewer, ProductViewSkeleton } from '../components';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const ProductViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useGetSellerProductQuery(id!);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  useEffect(() => {
    if (product) {
      document.title = `${product.title} - Product Details | Zembil`;
    }
  }, [product]);

  const handleEdit = () => {
    navigate(`/seller/products/${id}/edit`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product?.title}"? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteProduct(id!).unwrap();
        toast.success('Product deleted successfully');
        navigate('/seller/products');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/products/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Product link copied to clipboard!');
  };

  if (isLoading) {
    return <ProductViewSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-grey-900 mb-2">Product not found</h2>
          <p className="text-grey-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/seller/products"
            className="px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    inactive: { bg: 'bg-grey-100', text: 'text-grey-700', border: 'border-grey-200' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    draft: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  };

  const statusColor = statusColors[product.status as keyof typeof statusColors];

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-50 via-white to-gold/5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-grey-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/seller/products')}
                className="p-2 rounded-lg hover:bg-grey-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-grey-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-grey-900 flex items-center gap-2">
                  {product.title}
                  {product.isFeatured && (
                    <SparklesIcon className="w-6 h-6 text-gold" />
                  )}
                </h1>
                <p className="text-sm text-grey-500">SKU: {product.sku || 'N/A'}</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-xl border-2 border-grey-200 text-grey-700 font-semibold hover:border-gold hover:text-gold transition-all flex items-center gap-2"
              >
                <ShareIcon className="w-5 h-5" />
                Share
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <PencilSquareIcon className="w-5 h-5" />
                Edit Product
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <ImageGalleryViewer images={product.images} productName={product.title} />

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 grid grid-cols-2 gap-4"
            >
              <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-100">
                <EyeIcon className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-600">{product.views || 0}</p>
                <p className="text-xs font-medium text-blue-600/70">Views</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border-2 border-green-100">
                <ShoppingBagIcon className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-600">{product.sold || product.totalSold || 0}</p>
                <p className="text-xs font-medium text-green-600/70">Sold</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2',
                  statusColor?.bg,
                  statusColor?.text,
                  statusColor?.border
                )}
              >
                {product.status === 'active' && <CheckCircleIcon className="w-4 h-4" />}
                {product.status === 'inactive' && <XCircleIcon className="w-4 h-4" />}
                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
              </span>
              {product.isFeatured && (
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-gold/20 to-gold/10 text-gold border-2 border-gold/30">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Pricing Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gold/10 via-white to-white border-2 border-gold/20">
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-sm font-medium text-grey-600 mb-1">Price</p>
                  <p className="text-4xl font-bold text-grey-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                {product.discountPrice && (
                  <div>
                    <p className="text-sm font-medium text-grey-500 line-through">
                      ${product.discountPrice.toFixed(2)}
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      {Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}% OFF
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-2xl bg-white border-2 border-grey-200">
              <h3 className="text-lg font-bold text-grey-900 mb-3">Description</h3>
              <p className="text-base text-grey-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="p-4 rounded-xl bg-white border-2 border-grey-200">
                <p className="text-sm font-medium text-grey-500 mb-1">Category</p>
                <p className="text-base font-semibold text-grey-900">{product.category}</p>
              </div>

              {/* Brand */}
              {product.brand && (
                <div className="p-4 rounded-xl bg-white border-2 border-grey-200">
                  <p className="text-sm font-medium text-grey-500 mb-1">Brand</p>
                  <p className="text-base font-semibold text-grey-900">{product.brand}</p>
                </div>
              )}

              {/* Stock */}
              <div className="p-4 rounded-xl bg-white border-2 border-grey-200">
                <p className="text-sm font-medium text-grey-500 mb-1">Stock</p>
                <p className={clsx(
                  'text-base font-semibold',
                  (product.stock || product.stockQuantity || 0) > 10 ? 'text-green-600' : 'text-red-600'
                )}>
                  {product.stock || product.stockQuantity || 0} units
                </p>
              </div>

              {/* Rating */}
              <div className="p-4 rounded-xl bg-white border-2 border-grey-200">
                <p className="text-sm font-medium text-grey-500 mb-1">Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid
                        key={i}
                        className={clsx(
                          'w-5 h-5',
                          i < Math.floor(product.rating || product.averageRating || 0)
                            ? 'text-gold'
                            : 'text-grey-300'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-grey-700">
                    ({product.reviewCount || product.totalReviews || 0})
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border-2 border-grey-200">
                <h3 className="text-lg font-bold text-grey-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-sm font-medium text-gold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="p-6 rounded-2xl bg-white border-2 border-grey-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-grey-500 mb-1 flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    Created
                  </p>
                  <p className="text-sm font-semibold text-grey-900">
                    {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-grey-500 mb-1 flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-grey-900">
                    {formatDistanceToNow(new Date(product.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;

