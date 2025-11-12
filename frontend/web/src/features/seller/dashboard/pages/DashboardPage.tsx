import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { useGetSellerDashboardQuery } from '../api/sellerApi';
import HeroBanner from '../components/HeroBanner';
import TimeRangeSelector from '../components/TimeRangeSelector';
import EnhancedStatsCard from '../components/EnhancedStatsCard';
import SalesChart from '../components/SalesChart';
import OrderKanban from '../components/OrderKanban';
import ProductPerformance from '../components/ProductPerformance';
import CustomerInsights from '../components/CustomerInsights';
import AlertsPanel from '../components/AlertsPanel';
import QuickActionsGrid from '../components/QuickActionsGrid';
import InsightsCard from '../components/InsightsCard';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { formatCurrency } from '@/core/utils/format';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CubeIcon,
  StarIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock data until API is integrated
const mockDashboardData = {
  stats: {
    totalRevenue: 15850.50,
    totalSales: 127,
    activeProducts: 45,
    totalProducts: 52,
    pendingOrders: 8,
    lowStockProducts: 5,
  },
  recentOrders: [
    {
      _id: '1',
      orderNumber: 'ORD-2024-001',
      totalPrice: 129.99,
      status: 'pending',
      createdAt: new Date().toISOString(),
      customer: { name: 'John Doe', email: 'john@example.com' },
    },
    {
      _id: '2',
      orderNumber: 'ORD-2024-002',
      totalPrice: 89.50,
      status: 'processing',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      customer: { name: 'Jane Smith', email: 'jane@example.com' },
    },
    {
      _id: '3',
      orderNumber: 'ORD-2024-003',
      totalPrice: 245.00,
      status: 'shipped',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      customer: { name: 'Bob Johnson', email: 'bob@example.com' },
    },
    {
      _id: '4',
      orderNumber: 'ORD-2024-004',
      totalPrice: 67.25,
      status: 'delivered',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      customer: { name: 'Alice Brown', email: 'alice@example.com' },
    },
    {
      _id: '5',
      orderNumber: 'ORD-2024-005',
      totalPrice: 156.75,
      status: 'pending',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      customer: { name: 'Charlie Wilson', email: 'charlie@example.com' },
    },
  ],
  salesByDate: [
    { date: 'Jan 1', revenue: 1200, orders: 15, profit: 400 },
    { date: 'Jan 2', revenue: 1900, orders: 22, profit: 650 },
    { date: 'Jan 3', revenue: 1500, orders: 18, profit: 500 },
    { date: 'Jan 4', revenue: 2100, orders: 28, profit: 750 },
    { date: 'Jan 5', revenue: 1800, orders: 20, profit: 600 },
    { date: 'Jan 6', revenue: 2400, orders: 32, profit: 850 },
    { date: 'Jan 7', revenue: 2200, orders: 29, profit: 780 },
  ],
};

const DashboardPage = () => {
  // Using mock data for now - replace with API call when ready
  // const { data, isLoading, error } = useGetSellerDashboardQuery();
  const data = mockDashboardData;
  
  // TEMPORARY: Simulate loading for 1 second to see the shimmer
  const [isLoading, setIsLoading] = useState(true);
  const error = null;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second delay
    
    return () => clearTimeout(timer);
  }, []);
  
  const [timeRange, setTimeRange] = useState('30days');
  const [showComparison, setShowComparison] = useState(false);

  console.log('Dashboard - Using mock data:', data);

  // Loading State with Skeleton
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error State
  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-grey-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-grey-600 mb-6">
            We encountered an error while loading your dashboard data. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gold hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </motion.div>
      </div>
    );
  }

  const stats = data.stats;
  const recentOrders = data.recentOrders || [];
  const salesData = data.salesByDate;

  // Mock product data (replace with actual API data)
  const topProducts = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      sales: 245,
      revenue: 12250,
      stock: 45,
      trend: 15,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      sales: 189,
      revenue: 28350,
      stock: 32,
      trend: 8,
      rating: 4.6,
    },
    {
      id: '3',
      name: 'Portable Bluetooth Speaker',
      sales: 156,
      revenue: 7800,
      stock: 78,
      trend: 22,
      rating: 4.9,
    },
  ];

  const lowStockProducts = [
    {
      id: '4',
      name: 'USB-C Cable 2m',
      sales: 89,
      revenue: 890,
      stock: 5,
      trend: -3,
    },
    {
      id: '5',
      name: 'Phone Case Clear',
      sales: 67,
      revenue: 670,
      stock: 8,
      trend: 2,
    },
  ];

  const poorPerformers = [
    {
      id: '6',
      name: 'Old Model Keyboard',
      sales: 12,
      revenue: 360,
      stock: 45,
      trend: -15,
    },
  ];

  // Calculate some metrics
  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalSales || 0;
  const activeProducts = stats?.activeProducts || 0;
  const totalProducts = stats?.totalProducts || 0;

  // Mock calculations for enhanced metrics
  const conversionRate = 3.2; // Mock data
  const avgOrderValue = totalRevenue / (totalOrders || 1);
  const customerSatisfaction = 4.7; // Mock data
  const fulfillmentTime = 2.3; // Mock data in days
  const returnRate = 2.1; // Mock data

  // Handle actions
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast.success(`Time range changed to ${range}`);
  };

  const handleComparisonToggle = (enabled: boolean) => {
    setShowComparison(enabled);
    toast.success(enabled ? 'Comparison enabled' : 'Comparison disabled');
  };

  const handleExport = () => {
    toast.success('Exporting dashboard data...');
    // Implement export logic
  };

  const handleOrderStatusChange = (orderId: string, newStatus: string) => {
    toast.success(`Order ${orderId} updated to ${newStatus}`);
    // Implement status update logic
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <HeroBanner
        sellerName="John"
        storeStatus="active"
        notificationCount={15}
      />

      {/* Time Range Selector */}
      <TimeRangeSelector
        onRangeChange={handleTimeRangeChange}
        onComparisonToggle={handleComparisonToggle}
        onExport={handleExport}
      />

      {/* Primary KPIs - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedStatsCard
          title="Total Revenue"
          value={totalRevenue}
          icon={<CurrencyDollarIcon />}
          trend={{ value: 12.5, isPositive: true, label: 'vs last month' }}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          prefix="$"
          decimals={2}
          sparkline={[1200, 1500, 1300, 1800, 2100, 1900, 2400]}
          delay={0}
        />
        <EnhancedStatsCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCartIcon />}
          trend={{ value: 8.3, isPositive: true, label: 'vs last month' }}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          badge={{ text: 'Today: 5', color: 'bg-blue-100 text-blue-700' }}
          sparkline={[15, 22, 18, 28, 20, 32, 29]}
          delay={0.1}
        />
        <EnhancedStatsCard
          title="Conversion Rate"
          value={conversionRate}
          icon={<ArrowTrendingUpIcon />}
          trend={{ value: 2.1, isPositive: true, label: 'vs last month' }}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          suffix="%"
          decimals={1}
          badge={{ text: 'Grade: A', color: 'bg-emerald-100 text-emerald-700' }}
          delay={0.2}
        />
        <EnhancedStatsCard
          title="Avg Order Value"
          value={avgOrderValue}
          icon={<BanknotesIcon />}
          trend={{ value: 5.7, isPositive: true, label: 'vs last month' }}
          iconBgColor="bg-gold-50"
          iconColor="text-gold-600"
          prefix="$"
          decimals={2}
          sparkline={[75, 82, 78, 85, 90, 88, 95]}
          delay={0.3}
        />
      </div>

      {/* Secondary KPIs - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedStatsCard
          title="Active Products"
          value={activeProducts}
          icon={<CubeIcon />}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
          suffix={` / ${totalProducts}`}
          badge={
            stats?.lowStockProducts
              ? { text: `${stats.lowStockProducts} Low`, color: 'bg-orange-100 text-orange-700' }
              : undefined
          }
          delay={0}
        />
        <EnhancedStatsCard
          title="Customer Rating"
          value={customerSatisfaction}
          icon={<StarIcon />}
          trend={{ value: 0.3, isPositive: true, label: 'vs last month' }}
          iconBgColor="bg-yellow-50"
          iconColor="text-yellow-600"
          suffix=" ★"
          decimals={1}
          delay={0.1}
        />
        <EnhancedStatsCard
          title="Fulfillment Time"
          value={fulfillmentTime}
          icon={<ClockIcon />}
          trend={{ value: 0.5, isPositive: false, label: 'vs last month' }}
          iconBgColor="bg-cyan-50"
          iconColor="text-cyan-600"
          suffix=" days"
          decimals={1}
          delay={0.2}
        />
        <EnhancedStatsCard
          title="Return Rate"
          value={returnRate}
          icon={<ArrowPathIcon />}
          trend={{ value: 0.3, isPositive: false, label: 'vs last month' }}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-600"
          suffix="%"
          decimals={1}
          delay={0.3}
        />
      </div>

      {/* Sales Analytics Chart */}
      <SalesChart data={salesData} />

      {/* Order Pipeline Kanban */}
      <OrderKanban
        orders={recentOrders.map((order) => ({
          ...order,
          status: order.status as any,
          isUrgent: Math.random() > 0.7,
        }))}
        onStatusChange={handleOrderStatusChange}
      />

      {/* Product Performance */}
      <ProductPerformance
        topProducts={topProducts}
        lowStockProducts={lowStockProducts}
        poorPerformers={poorPerformers}
      />

      {/* Customer Insights */}
      <CustomerInsights
        newCustomers={45}
        returningCustomers={78}
        customerLifetimeValue={245}
        repeatPurchaseRate={63}
        topLocations={[
          { city: 'New York', count: 89 },
          { city: 'Los Angeles', count: 67 },
          { city: 'Chicago', count: 54 },
          { city: 'Houston', count: 42 },
          { city: 'Phoenix', count: 38 },
        ]}
      />

      {/* Alerts & Action Required */}
      <AlertsPanel />

      {/* AI Insights */}
      <InsightsCard />

      {/* Quick Actions */}
      <QuickActionsGrid />

      {/* Footer Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm text-grey-500 pt-8 border-t border-grey-200"
      >
        <p>
          Dashboard auto-refreshes every 5 minutes • Last updated:{' '}
          {new Date().toLocaleTimeString()}
        </p>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
