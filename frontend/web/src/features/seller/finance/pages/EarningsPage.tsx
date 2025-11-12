import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  CalendarIcon,
  FunnelIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useGetEarningsQuery, useGetEarningDetailsQuery, useGetPayoutsQuery, useRequestPayoutMutation } from '../api/financeApi';
import { formatCurrency, formatDate, formatRelativeTime } from '@/core/utils/format';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Badge from '@/shared/components/Badge';
import EarningsPageSkeleton from '../components/EarningsPageSkeleton';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface StatCardProps {
  title: string;
  amount: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
  iconColor: string;
  trend?: number;
  delay?: number;
}

const StatCard = ({ title, amount, icon: Icon, gradient, iconBg, iconColor, trend, delay = 0 }: StatCardProps) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = amount;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayAmount(end);
        clearInterval(timer);
      } else {
        setDisplayAmount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [amount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-lg`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white blur-2xl" />
          <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white blur-2xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-white/80 mb-2">{title}</p>
              <motion.p
                className="text-3xl font-bold text-white mb-2"
                key={displayAmount}
              >
                {formatCurrency(displayAmount)}
              </motion.p>
              {trend !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  <ArrowTrendingUpIcon className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                  <span>{Math.abs(trend)}% from last month</span>
                </div>
              )}
            </div>
            <motion.div
              className={`${iconBg} p-3 rounded-xl`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon className={`w-7 h-7 ${iconColor}`} />
            </motion.div>
          </div>
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay }}
        />
      </div>
    </motion.div>
  );
};

const EarningsPage = () => {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { data: earningsData, isLoading: isLoadingEarnings } = useGetEarningsQuery();
  const { data: earningDetails, isLoading: isLoadingDetails } = useGetEarningDetailsQuery({
    page: 1,
    limit: 20,
    status: selectedFilter !== 'all' ? selectedFilter : undefined,
  });
  const { data: payoutsData, isLoading: isLoadingPayouts } = useGetPayoutsQuery({ page: 1, limit: 10 });
  const [requestPayout, { isLoading: isRequesting }] = useRequestPayoutMutation();

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > (earningsData?.availableForPayout || 0)) {
      toast.error('Amount exceeds available balance');
      return;
    }

    try {
      await requestPayout({ amount, payoutMethod: 'bank_transfer' }).unwrap();
      toast.success('Payout requested successfully! 🎉', {
        icon: '💰',
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      });
      setIsPayoutModalOpen(false);
      setPayoutAmount('');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to request payout');
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string; badge: 'success' | 'warning' | 'info' | 'error' }> = {
      paid: { bg: 'bg-green-50', text: 'text-green-700', badge: 'success' },
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'warning' },
      processing: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'info' },
      failed: { bg: 'bg-red-50', text: 'text-red-700', badge: 'error' },
      on_hold: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'warning' },
    };
    return statusColors[status] || statusColors.pending;
  };

  // Chart data for earnings trend
  const earningsTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Earnings',
        data: [3000, 4500, 3800, 5200, 6100, 7200],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: '#D4AF37',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleColor: '#fff',
        bodyColor: '#fff',
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Earnings by status chart
  const earningsByStatusData = {
    labels: ['Available', 'Pending', 'Paid Out'],
    datasets: [
      {
        data: [
          earningsData?.availableForPayout || 0,
          earningsData?.pendingClearing || 0,
          earningsData?.paidOut || 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(212, 175, 55, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(212, 175, 55, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    cutout: '70%',
  };

  if (isLoadingEarnings) {
    return <EarningsPageSkeleton />;
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header with Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <SparklesIcon className="w-8 h-8 text-gold" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent">
              Earnings Dashboard
            </h1>
          </div>
          <p className="text-grey-600 text-lg">
            Track your revenue, manage payouts, and monitor financial performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => {}}
            className="flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              onClick={() => setIsPayoutModalOpen(true)}
              disabled={!earningsData?.availableForPayout || earningsData.availableForPayout <= 0}
              className="flex items-center gap-2"
            >
              <CurrencyDollarIcon className="w-5 h-5" />
              Request Payout
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          amount={earningsData?.totalEarnings || 0}
          icon={BanknotesIcon}
          gradient="from-purple-500 via-purple-600 to-purple-700"
          iconBg="bg-white/20"
          iconColor="text-white"
          trend={12.5}
          delay={0}
        />
        <StatCard
          title="Available for Payout"
          amount={earningsData?.availableForPayout || 0}
          icon={CheckCircleIcon}
          gradient="from-green-500 via-green-600 to-emerald-600"
          iconBg="bg-white/20"
          iconColor="text-white"
          trend={8.3}
          delay={0.1}
        />
        <StatCard
          title="Pending Clearing"
          amount={earningsData?.pendingClearing || 0}
          icon={ClockIcon}
          gradient="from-orange-500 via-orange-600 to-amber-600"
          iconBg="bg-white/20"
          iconColor="text-white"
          delay={0.2}
        />
        <StatCard
          title="Total Paid Out"
          amount={earningsData?.paidOut || 0}
          icon={ArrowDownTrayIcon}
          gradient="from-blue-500 via-blue-600 to-indigo-600"
          iconBg="bg-white/20"
          iconColor="text-white"
          trend={15.7}
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-pale rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-grey-900">Earnings Trend</h3>
                  <p className="text-sm text-grey-600">Last 6 months performance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-4 py-2 border border-grey-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
            <div className="h-[300px]">
              <Line data={earningsTrendData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>

        {/* Earnings Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-grey-900">Distribution</h3>
                <p className="text-sm text-grey-600">By status</p>
              </div>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut data={earningsByStatusData} options={doughnutOptions} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-grey-900">Transaction History</h3>
                <p className="text-sm text-grey-600">Recent earnings and payouts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {}}
                className="flex items-center gap-2 px-4 py-2 border border-grey-200 rounded-lg hover:bg-grey-50 transition-colors"
              >
                <FunnelIcon className="w-5 h-5 text-grey-600" />
                <span className="text-sm">Filter</span>
              </button>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-grey-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>

          {isLoadingDetails ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-16 bg-grey-100 rounded-lg animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : !earningDetails?.earnings?.length ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="inline-block p-4 bg-grey-100 rounded-full mb-4"
              >
                <BanknotesIcon className="w-12 h-12 text-grey-400" />
              </motion.div>
              <p className="text-grey-600 text-lg">No transactions yet</p>
              <p className="text-grey-500 text-sm mt-2">Your earnings will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {earningDetails.earnings.map((earning: any, index: number) => {
                  const statusInfo = getStatusColor(earning.payoutStatus);
                  return (
                    <motion.div
                      key={earning._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                      className={`p-4 rounded-xl border-2 border-grey-100 hover:border-gold transition-all cursor-pointer ${statusInfo.bg}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <motion.div
                            className="p-3 bg-white rounded-lg shadow-sm"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <BanknotesIcon className="w-6 h-6 text-gold" />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-grey-900">
                                Order #{earning.orderNumber || earning.orderId}
                              </p>
                              <Badge variant={statusInfo.badge}>{earning.payoutStatus}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-grey-600">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {formatDate(earning.createdAt)}
                              </span>
                              {earning.eligibleForPayoutAt && (
                                <span className="flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  Available {formatRelativeTime(earning.eligibleForPayoutAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-grey-900">
                            {formatCurrency(earning.sellerAmount)}
                          </p>
                          <p className="text-sm text-grey-600">
                            Fee: {formatCurrency(earning.platformFee)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Payout Request Modal */}
      <AnimatePresence>
        {isPayoutModalOpen && (
          <Modal
            isOpen={isPayoutModalOpen}
            onClose={() => setIsPayoutModalOpen(false)}
            title="Request Payout"
            size="md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Available Balance Card */}
              <motion.div
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white blur-2xl" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-white/80 mb-2">Available Balance</p>
                  <p className="text-4xl font-bold text-white">
                    {formatCurrency(earningsData?.availableForPayout || 0)}
                  </p>
                </div>
              </motion.div>

              {/* Payout Amount Input */}
              <div>
                <label className="block text-sm font-medium text-grey-700 mb-2">
                  Payout Amount
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <CurrencyDollarIcon className="w-5 h-5 text-grey-400" />
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-grey-600">Minimum: $50</p>
                  <button
                    onClick={() => setPayoutAmount((earningsData?.availableForPayout || 0).toString())}
                    className="text-xs text-gold hover:text-gold-dark font-medium"
                  >
                    Use max amount
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex gap-3">
                  <ClockIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Processing time: 3-5 business days</p>
                    <p className="text-blue-700">
                      Funds will be transferred to your registered bank account
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsPayoutModalOpen(false)}
                  disabled={isRequesting}
                >
                  Cancel
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="primary"
                    onClick={handleRequestPayout}
                    isLoading={isRequesting}
                    className="flex items-center gap-2"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Request Payout
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EarningsPage;

