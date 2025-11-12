import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  TagIcon,
  GiftIcon,
  ChartBarIcon,
  PlusIcon,
  ClockIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CalendarIcon,
  PercentBadgeIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { useGetSellerProductsQuery } from '../../products/api/productsApi';
import PromotionsPageSkeleton from '../components/PromotionsPageSkeleton';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Badge from '@/shared/components/Badge';
import toast from 'react-hot-toast';
import clsx from 'clsx';

// Types
interface PromotionType {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  benefits: string[];
}

interface ActivePromotion {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  originalPrice: number;
  discountedPrice: number;
  clicks: number;
  sales: number;
  revenue: number;
  status: 'active' | 'scheduled' | 'expired';
}

const PromotionsPage = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'active' | 'create'>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPromotionType, setSelectedPromotionType] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Simulate loading state to show shimmer (for demo purposes)
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading time
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500); // 1.5 second delay to show shimmer

    return () => clearTimeout(timer);
  }, []);

  const { data: productsData, isLoading: isLoadingProducts } = useGetSellerProductsQuery({});
  const products = productsData?.data || [];

  // Show shimmer while page is loading
  if (isPageLoading) {
    return <PromotionsPageSkeleton />;
  }

  // Promotion Types
  const promotionTypes: PromotionType[] = [
    {
      id: 'flash-sale',
      name: 'Flash Sale',
      description: 'Limited time offers that create urgency',
      icon: BoltIcon,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      benefits: ['High conversion', 'Quick results', 'Creates urgency'],
    },
    {
      id: 'seasonal',
      name: 'Seasonal Promotion',
      description: 'Holiday and seasonal campaigns',
      icon: GiftIcon,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      benefits: ['Seasonal boost', 'Themed campaigns', 'Long duration'],
    },
    {
      id: 'bundle',
      name: 'Bundle Deal',
      description: 'Package multiple products together',
      icon: TagIcon,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      benefits: ['Higher basket value', 'Move inventory', 'Customer value'],
    },
    {
      id: 'loyalty',
      name: 'Loyalty Rewards',
      description: 'Exclusive deals for repeat customers',
      icon: TrophyIcon,
      color: 'text-yellow-600',
      gradient: 'from-yellow-500 to-amber-500',
      benefits: ['Customer retention', 'Build loyalty', 'Repeat purchases'],
    },
  ];

  // Mock active promotions
  const activePromotions: ActivePromotion[] = [
    {
      id: '1',
      productId: 'p1',
      productTitle: 'Premium Wireless Headphones',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      discountPercentage: 25,
      startDate: '2025-11-20',
      endDate: '2025-12-05',
      originalPrice: 299.99,
      discountedPrice: 224.99,
      clicks: 1243,
      sales: 87,
      revenue: 19593.13,
      status: 'active',
    },
    {
      id: '2',
      productId: 'p2',
      productTitle: 'Smart Watch Pro',
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      discountPercentage: 15,
      startDate: '2025-11-25',
      endDate: '2025-12-10',
      originalPrice: 199.99,
      discountedPrice: 169.99,
      clicks: 856,
      sales: 52,
      revenue: 8839.48,
      status: 'active',
    },
    {
      id: '3',
      productId: 'p3',
      productTitle: 'Designer Backpack',
      productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      discountPercentage: 30,
      startDate: '2025-12-01',
      endDate: '2025-12-15',
      originalPrice: 89.99,
      discountedPrice: 62.99,
      clicks: 0,
      sales: 0,
      revenue: 0,
      status: 'scheduled',
    },
  ];

  // Statistics
  const stats = {
    totalPromotions: activePromotions.length,
    activeNow: activePromotions.filter(p => p.status === 'active').length,
    totalRevenue: activePromotions.reduce((sum, p) => sum + p.revenue, 0),
    totalSales: activePromotions.reduce((sum, p) => sum + p.sales, 0),
    avgDiscountRate: activePromotions.reduce((sum, p) => sum + p.discountPercentage, 0) / activePromotions.length,
    conversionRate: 6.8,
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const handleCreatePromotion = () => {
    if (!selectedProducts.length) {
      toast.error('Please select at least one product');
      return;
    }
    if (!discountPercentage || parseFloat(discountPercentage) <= 0) {
      toast.error('Please enter a valid discount percentage');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    toast.success('Promotion created successfully!');
    setIsCreateModalOpen(false);
    setSelectedProducts([]);
    setDiscountPercentage('');
    setStartDate('');
    setEndDate('');
    setSelectedPromotionType(null);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 text-white shadow-2xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                <SparklesIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Promotions Hub</h1>
                <p className="mt-1 text-white/90">Boost sales with powerful promotional campaigns</p>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white text-purple-600 hover:bg-white/90 shadow-xl"
          >
            Create Promotion
          </Button>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-white/20 p-2">
                <FireIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-white/80">Active Now</p>
                <p className="text-2xl font-bold">{stats.activeNow}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-white/20 p-2">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-white/80">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-white/20 p-2">
                <ArrowTrendingUpIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-white/80">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-grey-200">
        {[
          { id: 'overview', label: 'Overview', icon: ChartBarIcon },
          { id: 'active', label: 'Active Promotions', icon: FireIcon },
          { id: 'create', label: 'Promotion Types', icon: MegaphoneIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={clsx(
              'flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all border-b-2',
              selectedTab === tab.id
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-grey-600 hover:text-grey-900 hover:border-grey-300'
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: 'Total Promotions',
                  value: stats.totalPromotions,
                  icon: TagIcon,
                  color: 'from-blue-500 to-cyan-500',
                  textColor: 'text-blue-600',
                },
                {
                  label: 'Total Sales',
                  value: stats.totalSales,
                  icon: ShoppingCartIcon,
                  color: 'from-green-500 to-emerald-500',
                  textColor: 'text-green-600',
                },
                {
                  label: 'Avg Discount',
                  value: `${stats.avgDiscountRate.toFixed(0)}%`,
                  icon: PercentBadgeIcon,
                  color: 'from-purple-500 to-pink-500',
                  textColor: 'text-purple-600',
                },
                {
                  label: 'Revenue Impact',
                  value: `$${stats.totalRevenue.toLocaleString()}`,
                  icon: CurrencyDollarIcon,
                  color: 'from-orange-500 to-red-500',
                  textColor: 'text-orange-600',
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-grey-100">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-grey-600 font-medium">{stat.label}</p>
                        <p className={clsx('text-3xl font-bold', stat.textColor)}>{stat.value}</p>
                      </div>
                      <div className={clsx('rounded-2xl bg-gradient-to-br p-3 shadow-lg group-hover:scale-110 transition-transform', stat.color)}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Performance Chart Placeholder */}
            <Card title="Performance Overview" className="mt-6">
              <div className="h-80 flex items-center justify-center bg-gradient-to-br from-grey-50 to-grey-100 rounded-xl">
                <div className="text-center space-y-3">
                  <ChartBarIcon className="h-16 w-16 text-grey-400 mx-auto" />
                  <p className="text-grey-600 font-medium">Performance analytics coming soon</p>
                  <p className="text-sm text-grey-500">Track your promotion performance over time</p>
                </div>
              </div>
            </Card>

            {/* Top Performing Promotions */}
            <Card title="Top Performing Promotions" subtitle="Your best campaigns this month">
              <div className="space-y-4">
                {activePromotions
                  .filter(p => p.status === 'active')
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((promo, index) => (
                    <motion.div
                      key={promo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-grey-50 to-white border border-grey-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={promo.productImage}
                            alt={promo.productTitle}
                            className="h-16 w-16 object-cover rounded-xl"
                          />
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            -{promo.discountPercentage}%
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-grey-900 group-hover:text-purple-600 transition-colors">
                            {promo.productTitle}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-grey-600">
                            <span className="flex items-center">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              {promo.clicks} views
                            </span>
                            <span className="flex items-center">
                              <ShoppingCartIcon className="h-4 w-4 mr-1" />
                              {promo.sales} sales
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">${promo.revenue.toLocaleString()}</p>
                        <p className="text-sm text-grey-500">revenue</p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </Card>
          </motion.div>
        )}

        {selectedTab === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {activePromotions.map((promo) => (
                <motion.div key={promo.id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={promo.productImage}
                        alt={promo.productTitle}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Discount Badge */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="absolute top-4 right-4 bg-gradient-to-br from-orange-500 to-red-600 text-white px-4 py-2 rounded-full shadow-2xl"
                      >
                        <span className="text-2xl font-bold">-{promo.discountPercentage}%</span>
                      </motion.div>

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant={
                            promo.status === 'active'
                              ? 'success'
                              : promo.status === 'scheduled'
                              ? 'warning'
                              : 'error'
                          }
                          className="font-semibold shadow-lg"
                        >
                          {promo.status === 'active' && <FireIcon className="h-3 w-3 mr-1 inline" />}
                          {promo.status === 'scheduled' && <ClockIcon className="h-3 w-3 mr-1 inline" />}
                          {promo.status.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Product Title */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">{promo.productTitle}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Price Info */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-grey-600 mb-1">Price</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-green-600">
                              ${promo.discountedPrice}
                            </span>
                            <span className="text-sm text-grey-500 line-through">
                              ${promo.originalPrice}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-grey-600 mb-1">Saved</p>
                          <span className="text-xl font-bold text-orange-600">
                            ${(promo.originalPrice - promo.discountedPrice).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center space-x-2 text-sm text-grey-600 bg-grey-50 rounded-lg p-3">
                        <CalendarIcon className="h-5 w-5 text-purple-600" />
                        <span>
                          {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Stats */}
                      {promo.status === 'active' && (
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-grey-200">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-grey-600 mb-1">
                              <EyeIcon className="h-4 w-4" />
                            </div>
                            <p className="text-lg font-bold text-grey-900">{promo.clicks}</p>
                            <p className="text-xs text-grey-500">Views</p>
                          </div>
                          <div className="text-center border-l border-r border-grey-200">
                            <div className="flex items-center justify-center space-x-1 text-grey-600 mb-1">
                              <ShoppingCartIcon className="h-4 w-4" />
                            </div>
                            <p className="text-lg font-bold text-grey-900">{promo.sales}</p>
                            <p className="text-xs text-grey-500">Sales</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-grey-600 mb-1">
                              <CurrencyDollarIcon className="h-4 w-4" />
                            </div>
                            <p className="text-lg font-bold text-green-600">
                              ${promo.revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-grey-500">Revenue</p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button size="sm" variant="secondary" className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" variant="primary" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {activePromotions.length === 0 && (
              <Card>
                <div className="py-16 text-center">
                  <TagIcon className="h-16 w-16 text-grey-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-grey-900 mb-2">No Active Promotions</h3>
                  <p className="text-grey-600 mb-6">Create your first promotion to boost sales</p>
                  <Button
                    variant="primary"
                    leftIcon={<PlusIcon className="h-5 w-5" />}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Create Promotion
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {selectedTab === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {promotionTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="h-full cursor-pointer group hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-300">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className={clsx('rounded-2xl bg-gradient-to-br p-4 shadow-lg group-hover:scale-110 transition-transform', type.gradient)}>
                          <type.icon className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="info" className="text-xs">
                          {index === 0 ? 'Popular' : index === 1 ? 'Trending' : 'New'}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className={clsx('text-xl font-bold mb-2', type.color)}>
                          {type.name}
                        </h3>
                        <p className="text-grey-600 text-sm">{type.description}</p>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-2">
                        {type.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <div className={clsx('h-1.5 w-1.5 rounded-full', type.gradient)} />
                            <span className="text-grey-700">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action */}
                      <Button
                        variant="primary"
                        className={clsx('w-full bg-gradient-to-r', type.gradient)}
                        onClick={() => {
                          setSelectedPromotionType(type.id);
                          setIsCreateModalOpen(true);
                        }}
                      >
                        Start {type.name}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Tips Section */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="flex items-start space-x-4">
                <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-3 text-white">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-grey-900 mb-2">Pro Tips for Successful Promotions</h3>
                  <ul className="space-y-2 text-sm text-grey-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Create urgency with limited-time offers (24-48 hours for flash sales)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Use 15-30% discounts for optimal conversion without sacrificing margins</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Schedule promotions during peak shopping times (weekends, holidays)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Bundle complementary products to increase average order value</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Promotion Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedPromotionType(null);
          setSelectedProducts([]);
          setDiscountPercentage('');
          setStartDate('');
          setEndDate('');
        }}
        title="Create New Promotion"
        size="xl"
      >
        <div className="space-y-6">
          {/* Promotion Type */}
          {selectedPromotionType && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-grey-600 mb-1">Promotion Type</p>
              <p className="font-bold text-purple-600">
                {promotionTypes.find(t => t.id === selectedPromotionType)?.name}
              </p>
            </div>
          )}

          {/* Select Products */}
          <div>
            <label className="block text-sm font-medium text-grey-900 mb-3">
              Select Products
            </label>
            <div className="max-h-64 overflow-y-auto space-y-2 border border-grey-200 rounded-xl p-4 bg-grey-50">
              {isLoadingProducts ? (
                <p className="text-center text-grey-500 py-4">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-center text-grey-500 py-4">No products available</p>
              ) : (
                products.slice(0, 10).map((product) => (
                  <label
                    key={product._id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product._id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                        }
                      }}
                      className="rounded border-grey-300 text-purple-600 focus:ring-purple-500"
                    />
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/100'}
                      alt={product.title}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-grey-900 truncate">{product.title}</p>
                      <p className="text-sm text-grey-600">${product.price}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            {selectedProducts.length > 0 && (
              <p className="mt-2 text-sm text-purple-600 font-medium">
                {selectedProducts.length} product(s) selected
              </p>
            )}
          </div>

          {/* Discount Percentage */}
          <Input
            label="Discount Percentage"
            type="number"
            placeholder="e.g., 25"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            min="1"
            max="90"
          />

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Preview */}
          {discountPercentage && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-grey-600 mb-2">Discount Preview</p>
              <p className="text-2xl font-bold text-green-600">-{discountPercentage}% OFF</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4 border-t border-grey-200">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setSelectedPromotionType(null);
                setSelectedProducts([]);
                setDiscountPercentage('');
                setStartDate('');
                setEndDate('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreatePromotion}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Create Promotion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PromotionsPage;
