import { SellerProfile, ProfileStats } from '../api/profileApi';
import Card from '@/shared/components/Card';
import { formatCurrency } from '@/core/utils/format';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  StarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface StatisticsTabProps {
  profile: SellerProfile;
  stats?: ProfileStats;
  isLoading: boolean;
}

const StatisticsTab = ({ profile, stats, isLoading }: StatisticsTabProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    } else if (trend < 0) {
      return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-grey-500';
  };

  const formatTrend = (trend: number) => {
    const abs = Math.abs(trend);
    const sign = trend > 0 ? '+' : '';
    return `${sign}${abs.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gold-pale rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-gold" />
            </div>
            {stats?.revenue && (
              <div className="flex items-center gap-1">
                {getTrendIcon(stats.revenue.trend)}
                <span className={clsx('text-sm font-medium', getTrendColor(stats.revenue.trend))}>
                  {formatTrend(stats.revenue.trend)}
                </span>
              </div>
            )}
          </div>
          <h3 className="text-sm font-medium text-grey-500 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-grey-900">
            {formatCurrency(stats?.revenue?.total || 0)}
          </p>
          <p className="text-sm text-grey-500 mt-2">
            This month: {formatCurrency(stats?.revenue?.thisMonth || 0)}
          </p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-grey-500 mb-1">Total Orders</h3>
          <p className="text-2xl font-bold text-grey-900">{stats?.orders?.total || 0}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-grey-500">
            <span>Pending: {stats?.orders?.pending || 0}</span>
            <span>Completed: {stats?.orders?.completed || 0}</span>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <ShoppingBagIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-grey-500 mb-1">Total Products</h3>
          <p className="text-2xl font-bold text-grey-900">{stats?.products?.total || 0}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-grey-500">
            <span>Active: {stats?.products?.active || 0}</span>
            <span>Low Stock: {stats?.products?.lowStock || 0}</span>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <h3 className="text-lg font-semibold text-grey-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StarIcon className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium text-grey-700">Customer Satisfaction</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-grey-900">
                {stats?.performance?.customerSatisfaction?.toFixed(1) || '0.0'}
              </span>
              <span className="text-lg text-grey-500">/ 5.0</span>
            </div>
            <div className="w-full bg-grey-200 rounded-full h-2 mt-2">
              <div
                className="bg-gold h-2 rounded-full"
                style={{ width: `${((stats?.performance?.customerSatisfaction || 0) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-grey-700">Response Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-grey-900">
                {stats?.performance?.responseRate?.toFixed(0) || '0'}
              </span>
              <span className="text-lg text-grey-500">%</span>
            </div>
            <div className="w-full bg-grey-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${stats?.performance?.responseRate || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-grey-700">Avg Response Time</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-grey-900">
                {stats?.performance?.averageResponseTime?.toFixed(0) || '0'}
              </span>
              <span className="text-lg text-grey-500">min</span>
            </div>
            <p className="text-xs text-grey-500 mt-2">
              {stats?.performance?.averageResponseTime && stats.performance.averageResponseTime < 60
                ? 'Excellent response time!'
                : 'Try to respond faster'}
            </p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <h3 className="text-lg font-semibold text-grey-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-grey-500 mb-2">Verification Status</h4>
            <div className="flex items-center gap-2">
              <div className={clsx(
                'w-3 h-3 rounded-full',
                profile.verificationStatus === 'verified' ? 'bg-green-500' :
                profile.verificationStatus === 'pending' ? 'bg-orange-500' :
                'bg-red-500'
              )} />
              <span className="text-base font-medium text-grey-900 capitalize">
                {profile.verificationStatus}
              </span>
            </div>
            {profile.verificationStatus !== 'verified' && (
              <p className="text-sm text-grey-500 mt-1">
                Complete your verification to unlock all features
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-grey-500 mb-2">Account Status</h4>
            <div className="flex items-center gap-2">
              <div className={clsx(
                'w-3 h-3 rounded-full',
                profile.accountStatus === 'active' ? 'bg-green-500' :
                profile.accountStatus === 'suspended' ? 'bg-orange-500' :
                'bg-red-500'
              )} />
              <span className="text-base font-medium text-grey-900 capitalize">
                {profile.accountStatus}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-grey-500 mb-2">Profile Completion</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-grey-200 rounded-full h-2">
                <div
                  className="bg-gold h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profile.profileCompletion || 0}%` }}
                />
              </div>
              <span className="text-base font-medium text-grey-900">
                {profile.profileCompletion || 0}%
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-grey-500 mb-2">Member Since</h4>
            <span className="text-base font-medium text-grey-900">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder for Charts */}
      <div className="bg-gradient-to-br from-grey-50 to-white rounded-xl border border-grey-200 p-8 text-center">
        <h3 className="text-lg font-semibold text-grey-900 mb-2">Analytics Charts</h3>
        <p className="text-grey-500 mb-4">
          Detailed charts and analytics will be available here
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-grey-600">
          <div className="p-4 bg-white rounded-lg border border-grey-200">
            <p className="font-medium">Sales Trend</p>
            <p className="text-xs text-grey-400 mt-1">Coming Soon</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-grey-200">
            <p className="font-medium">Top Products</p>
            <p className="text-xs text-grey-400 mt-1">Coming Soon</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-grey-200">
            <p className="font-medium">Peak Hours</p>
            <p className="text-xs text-grey-400 mt-1">Coming Soon</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-grey-200">
            <p className="font-medium">Retention</p>
            <p className="text-xs text-grey-400 mt-1">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTab;

