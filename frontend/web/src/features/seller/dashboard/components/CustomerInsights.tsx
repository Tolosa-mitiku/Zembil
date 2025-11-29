import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '@/shared/components/Card';
import { UsersIcon, UserPlusIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/core/utils/format';

interface CustomerInsightsProps {
  newCustomers: number;
  returningCustomers: number;
  customerLifetimeValue: number;
  repeatPurchaseRate: number;
  topLocations?: Array<{ city: string; count: number }>;
}

const CustomerInsights = ({
  newCustomers = 0,
  returningCustomers = 0,
  customerLifetimeValue = 0,
  repeatPurchaseRate = 0,
  topLocations = [],
}: CustomerInsightsProps) => {
  const customerData = [
    { name: 'New Customers', value: newCustomers, color: '#3B82F6' },
    { name: 'Returning Customers', value: returningCustomers, color: '#10B981' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border border-grey-100">
          <p className="text-sm font-semibold text-grey-900">{payload[0].name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 col-span-full">
      {/* Customer Split */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-1"
      >
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-grey-900">Customer Split</h3>
              <p className="text-sm text-grey-500">New vs Returning</p>
            </div>
          </div>

          <div className="h-64">
            {newCustomers === 0 && returningCustomers === 0 ? (
              <div className="flex items-center justify-center h-full text-grey-400">
                <p className="text-sm">No customer data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {customerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value, entry: any) => (
                      <span className="text-sm text-grey-700">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Customer Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-1"
      >
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserPlusIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-grey-900">Key Metrics</h3>
              <p className="text-sm text-grey-500">Customer behavior</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer Lifetime Value */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-grey-600">Lifetime Value</span>
                <span className="text-lg font-bold text-grey-900">
                  {formatCurrency(customerLifetimeValue)}
                </span>
              </div>
              <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
            </div>

            {/* Repeat Purchase Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-grey-600">Repeat Purchase Rate</span>
                <span className="text-lg font-bold text-grey-900">
                  {repeatPurchaseRate}%
                </span>
              </div>
              <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${repeatPurchaseRate}%` }}
                  transition={{ delay: 0.7, duration: 1 }}
                />
              </div>
            </div>

            {/* Total Customers */}
            <div className="pt-4 border-t border-grey-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{newCustomers}</p>
                  <p className="text-xs text-blue-700 mt-1">New</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">{returningCustomers}</p>
                  <p className="text-xs text-emerald-700 mt-1">Returning</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Top Locations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-1"
      >
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-orange-50 rounded-lg">
              <MapPinIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-grey-900">Top Locations</h3>
              <p className="text-sm text-grey-500">Customer distribution</p>
            </div>
          </div>

          <div className="space-y-3">
            {topLocations.length === 0 ? (
              <div className="text-center py-8 text-grey-400">
                <p className="text-sm">No location data yet</p>
              </div>
            ) : (
              topLocations.slice(0, 5).map((location, index) => {
                const maxCount = Math.max(...topLocations.map((l) => l.count));
                const percentage = (location.count / maxCount) * 100;

                return (
                  <motion.div
                    key={location.city}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📍'}</span>
                        <span className="text-sm font-semibold text-grey-900">
                          {location.city}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-grey-700">
                        {location.count}
                      </span>
                    </div>
                    <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1 + 0.2, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CustomerInsights;

