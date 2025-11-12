import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useGetSellerAnalyticsQuery, 
  useGetSellerDashboardQuery,
  useGetSellerRevenueQuery 
} from '../api/analyticsApi';
import { formatCurrency } from '@/core/utils/format';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { subDays, format, parseISO } from 'date-fns';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CubeIcon,
  StarIcon,
  ArrowPathIcon,
  SparklesIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Title, Tooltip, Legend);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Colorful Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon: React.ReactNode;
  gradient: string[];
  delay?: number;
}

const MetricCard = ({ title, value, subtitle, trend, icon, gradient, delay = 0 }: MetricCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        boxShadow: `0 10px 25px -5px ${gradient[0]}40, 0 8px 10px -6px ${gradient[1]}30`,
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-20">
        <div className="w-32 h-32 rounded-full bg-white blur-3xl transform translate-x-8 -translate-y-8" />
      </div>
      
      <div className="relative">
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-6 h-6 text-white">{icon}</div>
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
              trend.value >= 0 ? 'bg-white/20' : 'bg-white/20'
            }`}>
              {trend.value >= 0 ? (
                <ArrowUpRightIcon className="w-4 h-4 text-white" />
              ) : (
                <ArrowDownRightIcon className="w-4 h-4 text-white" />
              )}
              <span className="text-white">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white/90 text-sm font-medium mb-2">{title}</h3>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5, type: 'spring' }}
          className="text-3xl font-bold text-white mb-1"
        >
          {value}
        </motion.div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-white/70 text-xs">{subtitle}</p>
        )}
        {trend && (
          <p className="text-white/70 text-xs mt-1">{trend.label}</p>
        )}
      </div>
    </motion.div>
  );
};

// Period selector component
const PeriodSelector = ({ selected, onChange }: { selected: string; onChange: (period: string) => void }) => {
  const periods = [
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <div className="flex items-center space-x-2 p-1 bg-grey-100 rounded-xl">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selected === period.value
              ? 'bg-white text-gold shadow-md'
              : 'text-grey-600 hover:text-grey-900'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

// Skeleton Loader
const AnalyticsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-40 bg-grey-200 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-96 bg-grey-200 rounded-2xl" />
      ))}
    </div>
  </div>
);

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('30days');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  // Calculate date range based on period
  const dateRange = useMemo(() => {
    const end = new Date();
    let start = new Date();
    
    switch (period) {
      case '7days':
        start = subDays(end, 7);
        break;
      case '30days':
        start = subDays(end, 30);
        break;
      case '90days':
        start = subDays(end, 90);
        break;
      case 'year':
        start = subDays(end, 365);
        break;
    }
    
    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    };
  }, [period]);

  // Fetch data
  const { data: dashboardData, isLoading: dashboardLoading } = useGetSellerDashboardQuery();
  const { data: analyticsData, isLoading: analyticsLoading } = useGetSellerAnalyticsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    period: period === 'year' || period === '90days' ? 'monthly' : 'daily',
  });
  const { data: revenueData, isLoading: revenueLoading } = useGetSellerRevenueQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const isLoading = dashboardLoading || analyticsLoading || revenueLoading;

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-10 w-48 bg-grey-200 rounded animate-pulse mb-2" />
            <div className="h-6 w-64 bg-grey-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-96 bg-grey-200 rounded-xl animate-pulse" />
        </div>
        <AnalyticsSkeleton />
      </div>
    );
  }

  const overview = dashboardData?.overview;
  
  // Calculate metrics
  const totalRevenue = overview?.totalRevenue || 0;
  const totalOrders = overview?.totalOrders || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = 3.4; // Mock - calculate from actual data
  const growthRate = parseFloat(dashboardData?.growth?.ordersGrowth || '0');

  // Prepare chart data
  const salesChartData = {
    labels: analyticsData?.salesByDate.map((item) => 
      format(parseISO(item._id), period === 'year' || period === '90days' ? 'MMM yyyy' : 'MMM dd')
    ) || [],
    datasets: [
      {
        label: 'Revenue',
        data: analyticsData?.salesByDate.map((item) => item.revenue) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Orders',
        data: analyticsData?.salesByDate.map((item) => item.count) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        bodySpacing: 8,
        usePointStyle: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: (value: any) => {
            if (typeof value === 'number' && value >= 1000) {
              return '$' + (value / 1000).toFixed(1) + 'k';
            }
            return '$' + value;
          },
        },
      },
    },
  };

  // Top Products Chart
  const topProductsData = {
    labels: analyticsData?.topProducts.slice(0, 5).map((p) => 
      p.productDetails?.title || 'Unknown Product'
    ) || [],
    datasets: [
      {
        label: 'Revenue',
        data: analyticsData?.topProducts.slice(0, 5).map((p) => p.revenue) || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Order Status Distribution
  const orderStatusData = {
    labels: analyticsData?.ordersByStatus.map((item) => 
      item._id.charAt(0).toUpperCase() + item._id.slice(1)
    ) || [],
    datasets: [
      {
        data: analyticsData?.ordersByStatus.map((item) => item.count) || [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: '#fff',
        borderWidth: 3,
      },
    ],
  };

  // Revenue breakdown
  const revenueSummary = revenueData?.summary;

  return (
    <motion.div 
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-grey-900 mb-2 flex items-center space-x-3">
            <SparklesIcon className="w-8 h-8 text-gold" />
            <span>Analytics Dashboard</span>
          </h1>
          <p className="text-lg text-grey-600">
            Deep insights into your store's performance
          </p>
        </div>
        <PeriodSelector selected={period} onChange={setPeriod} />
      </motion.div>

      {/* Key Metrics - Top Row */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle={`From ${totalOrders} orders`}
          trend={{ value: growthRate, label: 'vs previous period' }}
          icon={<CurrencyDollarIcon className="w-full h-full" />}
          gradient={['#10B981', '#059669']}
          delay={0}
        />
        <MetricCard
          title="Total Orders"
          value={totalOrders.toString()}
          subtitle={`${overview?.pendingOrders || 0} pending`}
          trend={{ value: 12.5, label: 'vs previous period' }}
          icon={<ShoppingCartIcon className="w-full h-full" />}
          gradient={['#3B82F6', '#2563EB']}
          delay={0.1}
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(avgOrderValue)}
          subtitle="Per transaction"
          trend={{ value: 8.2, label: 'vs previous period' }}
          icon={<BanknotesIcon className="w-full h-full" />}
          gradient={['#8B5CF6', '#7C3AED']}
          delay={0.2}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          subtitle="Visitors to customers"
          trend={{ value: 3.1, label: 'vs previous period' }}
          icon={<ArrowTrendingUpIcon className="w-full h-full" />}
          gradient={['#F59E0B', '#D97706']}
          delay={0.3}
        />
      </motion.div>

      {/* Secondary Metrics */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Active Products"
          value={overview?.activeProducts || 0}
          subtitle={`${overview?.outOfStock || 0} out of stock`}
          icon={<CubeIcon className="w-full h-full" />}
          gradient={['#EC4899', '#DB2777']}
          delay={0}
        />
        <MetricCard
          title="Net Earnings"
          value={formatCurrency(overview?.totalEarnings || 0)}
          subtitle={`${formatCurrency(revenueSummary?.totalPending || 0)} pending`}
          icon={<BanknotesIcon className="w-full h-full" />}
          gradient={['#06B6D4', '#0891B2']}
          delay={0.1}
        />
        <MetricCard
          title="Customer Rating"
          value={`${dashboardData?.sellerInfo?.averageRating?.toFixed(1) || '0.0'} ★`}
          subtitle={`${dashboardData?.sellerInfo?.totalReviews || 0} reviews`}
          icon={<StarIcon className="w-full h-full" />}
          gradient={['#F59E0B', '#D97706']}
          delay={0.2}
        />
        <MetricCard
          title="Growth Rate"
          value={`${growthRate >= 0 ? '+' : ''}${growthRate}%`}
          subtitle="Last 7 days"
          trend={{ value: Math.abs(growthRate), label: 'Weekly change' }}
          icon={<ArrowTrendingUpIcon className="w-full h-full" />}
          gradient={['#EF4444', '#DC2626']}
          delay={0.3}
        />
      </motion.div>

      {/* Sales Trend Chart */}
      <motion.div
        variants={scaleVariants}
        className="bg-white rounded-2xl p-8 shadow-lg border border-grey-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-grey-900 flex items-center space-x-2">
              <PresentationChartLineIcon className="w-6 h-6 text-gold" />
              <span>Sales Performance</span>
            </h2>
            <p className="text-grey-600 mt-1">Revenue and order trends over time</p>
          </div>
          <div className="flex items-center space-x-2 bg-grey-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                chartType === 'line'
                  ? 'bg-white text-gold shadow-sm'
                  : 'text-grey-600 hover:text-grey-900'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                chartType === 'bar'
                  ? 'bg-white text-gold shadow-sm'
                  : 'text-grey-600 hover:text-grey-900'
              }`}
            >
              Bar
            </button>
          </div>
        </div>
        <div className="h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={chartType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {chartType === 'line' ? (
                <Line data={salesChartData} options={chartOptions} />
              ) : (
                <Bar data={salesChartData} options={chartOptions} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          variants={scaleVariants}
          className="bg-white rounded-2xl p-8 shadow-lg border border-grey-100"
        >
          <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center space-x-2">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
            <span>Top Products</span>
          </h2>
          <div className="h-80">
            <Bar
              data={topProductsData}
              options={{
                ...chartOptions,
                indexAxis: 'y' as const,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                      label: (context) => `Revenue: ${formatCurrency(context.parsed.x)}`,
                    },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          variants={scaleVariants}
          className="bg-white rounded-2xl p-8 shadow-lg border border-grey-100"
        >
          <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center space-x-2">
            <ChartPieIcon className="w-6 h-6 text-purple-600" />
            <span>Order Status</span>
          </h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut
              data={orderStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: {
                        size: 12,
                        weight: '600',
                      },
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                  },
                },
                cutout: '65%',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Revenue Breakdown */}
      {revenueSummary && (
        <motion.div
          variants={scaleVariants}
          className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl p-8 border border-gold-200"
        >
          <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center space-x-2">
            <BanknotesIcon className="w-6 h-6 text-gold" />
            <span>Revenue Breakdown</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-grey-600 text-sm mb-2">Total Revenue</p>
              <p className="text-2xl font-bold text-grey-900">
                {formatCurrency(revenueSummary.totalRevenue)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-grey-600 text-sm mb-2">Platform Fees</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(revenueSummary.totalPlatformFees)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-grey-600 text-sm mb-2">Net Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueSummary.totalEarnings)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-grey-600 text-sm mb-2">Paid Out</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(revenueSummary.totalPaid)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-grey-600 text-sm mb-2">Pending</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(revenueSummary.totalPending)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalyticsPage;

