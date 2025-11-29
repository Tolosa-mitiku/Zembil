import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '@/shared/components/Card';
import clsx from 'clsx';
import { formatCurrency } from '@/core/utils/format';

interface SalesChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
    profit?: number;
  }>;
}

type ChartType = 'revenue' | 'orders' | 'profit';

const SalesChart = ({ data }: SalesChartProps) => {
  const [chartType, setChartType] = useState<ChartType>('revenue');
  const [showComparison, setShowComparison] = useState(false);

  const chartOptions: Array<{ type: ChartType; label: string; color: string }> = [
    { type: 'revenue', label: 'Revenue', color: '#10B981' },
    { type: 'orders', label: 'Orders', color: '#3B82F6' },
    { type: 'profit', label: 'Profit', color: '#8B5CF6' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 rounded-xl shadow-xl border border-grey-100"
        >
          <p className="text-sm font-semibold text-grey-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-grey-600">{entry.name}:</span>
              <span className="text-sm font-semibold text-grey-900">
                {entry.name === 'Orders'
                  ? entry.value
                  : formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-grey-900">Sales Analytics</h3>
            <p className="text-sm text-grey-500">Track your revenue and order trends</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Chart Type Selector */}
            <div className="flex items-center bg-grey-100 rounded-lg p-1">
              {chartOptions.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={clsx(
                    'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    chartType === type
                      ? 'bg-white text-grey-900 shadow-sm'
                      : 'text-grey-600 hover:text-grey-900'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Comparison Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showComparison}
                onChange={(e) => setShowComparison(e.target.checked)}
                className="sr-only"
              />
              <div
                className={clsx(
                  'w-11 h-6 rounded-full transition-colors duration-200',
                  showComparison ? 'bg-gold' : 'bg-grey-300'
                )}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full m-0.5"
                  animate={{ x: showComparison ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
              <span className="text-sm text-grey-600">Compare</span>
            </label>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="h-96"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
              iconType="circle"
            />
            {chartType === 'revenue' && (
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
                animationDuration={1000}
              />
            )}
            {chartType === 'orders' && (
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOrders)"
                name="Orders"
                animationDuration={1000}
              />
            )}
            {chartType === 'profit' && (
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#8B5CF6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorProfit)"
                name="Profit"
                animationDuration={1000}
              />
            )}
            {showComparison && (
              <Line
                type="monotone"
                dataKey={chartType}
                stroke="#D1D5DB"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Previous Period"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
};

export default SalesChart;

