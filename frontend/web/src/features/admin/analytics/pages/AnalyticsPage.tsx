import { useState } from 'react';
import { useGetAdminRevenueQuery, useGetAdminSalesQuery, useGetAdminUserGrowthQuery } from '../api/analyticsApi';
import Card from '@/shared/components/Card';
import { formatCurrency, formatNumber } from '@/core/utils/format';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { CHART_COLORS } from '@/core/constants';
import { subDays, format } from 'date-fns';

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: revenueData, isLoading: isLoadingRevenue } = useGetAdminRevenueQuery(dateRange);
  const { data: salesData, isLoading: isLoadingSales } = useGetAdminSalesQuery(dateRange);
  const { data: userGrowthData, isLoading: isLoadingUsers } = useGetAdminUserGrowthQuery();

  if (isLoadingRevenue || isLoadingSales || isLoadingUsers) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  const revenueChartData = {
    labels: revenueData?.data?.map((item) => format(new Date(item.date), 'MMM dd')) || [],
    datasets: [
      {
        label: 'Revenue',
        data: revenueData?.data?.map((item) => item.revenue) || [],
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.primary + '20',
        tension: 0.4,
      },
      {
        label: 'Platform Fees',
        data: revenueData?.data?.map((item) => item.platformFees) || [],
        borderColor: CHART_COLORS.success,
        backgroundColor: CHART_COLORS.success + '20',
        tension: 0.4,
      },
    ],
  };

  const userGrowthChartData = {
    labels: userGrowthData?.userGrowth?.map((item) => format(new Date(item.date), 'MMM dd')) || [],
    datasets: [
      {
        label: 'New Users',
        data: userGrowthData?.userGrowth?.map((item) => item.count) || [],
        borderColor: CHART_COLORS.info,
        backgroundColor: CHART_COLORS.info + '20',
        tension: 0.4,
      },
    ],
  };

  const salesStatusData = {
    labels: salesData?.salesByStatus?.map((item) => item.status) || [],
    datasets: [
      {
        data: salesData?.salesByStatus?.map((item) => item.count) || [],
        backgroundColor: [
          CHART_COLORS.success,
          CHART_COLORS.info,
          CHART_COLORS.warning,
          CHART_COLORS.error,
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-large text-grey-900 mb-2">Platform Analytics</h1>
          <p className="text-body-medium text-grey-600">Comprehensive platform insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="input-base"
          />
          <span className="text-grey-600">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="input-base"
          />
        </div>
      </div>

      {/* Revenue Chart */}
      <Card title="Revenue & Platform Fees">
        <div className="h-80">
          <Line
            data={revenueChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top' as const } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="User Growth (Last 30 Days)">
          <div className="h-80">
            <Line
              data={userGrowthChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </Card>

        <Card title="Sales by Status">
          <div className="h-80 flex items-center justify-center">
            <Doughnut
              data={salesStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' as const } },
              }}
            />
          </div>
        </Card>
      </div>

      {/* Top Products */}
      {salesData?.topProducts && salesData.topProducts.length > 0 && (
        <Card title="Top Products by Revenue">
          <div className="space-y-3">
            {salesData.topProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-grey-200 last:border-b-0">
                <div>
                  <p className="text-body-medium text-grey-900">{product.title}</p>
                  <p className="text-label-small text-grey-600">Sold: {formatNumber(product.sold)}</p>
                </div>
                <p className="text-title-medium text-grey-900 font-semibold">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsPage;

