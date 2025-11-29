import { useGetAdminDashboardQuery } from '../api/adminApi';
import Card from '@/shared/components/Card';
import { formatCurrency, formatNumber, formatRelativeTime } from '@/core/utils/format';
import {
  UsersIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { data, isLoading, error } = useGetAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-body-large text-error">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-headline-large text-grey-900 mb-2">Admin Dashboard</h1>
        <p className="text-body-medium text-grey-600">
          Platform overview and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Total Users</p>
              <p className="text-headline-small text-grey-900 font-semibold">
                {formatNumber(stats?.totalUsers || 0)}
              </p>
              <p className="text-label-small text-success mt-1">
                +{stats?.newUsersToday || 0} today
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Total Sellers</p>
              <p className="text-headline-small text-grey-900 font-semibold">
                {formatNumber(stats?.totalSellers || 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <UserGroupIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Total Products</p>
              <p className="text-headline-small text-grey-900 font-semibold">
                {formatNumber(stats?.totalProducts || 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Total Orders</p>
              <p className="text-headline-small text-grey-900 font-semibold">
                {formatNumber(stats?.totalOrders || 0)}
              </p>
              <p className="text-label-small text-success mt-1">
                +{stats?.newOrdersToday || 0} today
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <ShoppingCartIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Total Revenue</p>
              <p className="text-headline-small text-grey-900 font-semibold">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gold-pale">
              <CurrencyDollarIcon className="w-6 h-6 text-gold" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Platform Fees</p>
              <p className="text-headline-small text-grey-900 font-semibold">
                {formatCurrency(stats?.platformFees || 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <BanknotesIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        {!data?.recentActivity || data.recentActivity.length === 0 ? (
          <div className="text-center py-8 text-grey-500">
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 pb-4 border-b border-grey-200 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="text-body-medium text-grey-900">
                    {activity.description}
                  </p>
                  <p className="text-label-small text-grey-600 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;

