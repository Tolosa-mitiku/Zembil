import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useGetFinanceStatsQuery, useGetPayoutRequestsQuery, useApprovePayoutMutation, useRejectPayoutMutation } from '../api/financeApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { formatCurrency, formatDate } from '@/core/utils/format';
import toast from 'react-hot-toast';

const FinancePage = () => {
  const { data: stats, isLoading: statsLoading } = useGetFinanceStatsQuery();
  const { data: payouts, isLoading: payoutsLoading } = useGetPayoutRequestsQuery();
  const [approvePayout] = useApprovePayoutMutation();
  const [rejectPayout] = useRejectPayoutMutation();

  const handleApprove = async (id: string) => {
    try {
      await approvePayout(id).unwrap();
      toast.success('Payout approved successfully');
    } catch (error) {
      toast.error('Failed to approve payout');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectPayout(id).unwrap();
      toast.success('Payout rejected');
    } catch (error) {
      toast.error('Failed to reject payout');
    }
  };

  if (statsLoading || payoutsLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-headline-large font-bold text-grey-900 mb-1">Financial Overview</h1>
        <p className="text-body-small text-grey-600">Track platform revenue and manage seller payouts</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-green-700 font-medium">Total Revenue</p>
              <h3 className="text-headline-medium font-bold text-green-900 mt-1">
                {formatCurrency(stats?.totalRevenue || 0)}
              </h3>
              <div className="flex items-center mt-2 text-green-700 text-label-small">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span>+{stats?.revenueGrowth}% vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-white bg-opacity-60 rounded-xl shadow-sm">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-blue-700 font-medium">Total Commission</p>
              <h3 className="text-headline-medium font-bold text-blue-900 mt-1">
                {formatCurrency(stats?.totalCommission || 0)}
              </h3>
              <div className="flex items-center mt-2 text-blue-700 text-label-small">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span>+{stats?.commissionGrowth}% vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-white bg-opacity-60 rounded-xl shadow-sm">
              <BanknotesIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-orange-700 font-medium">Pending Payouts</p>
              <h3 className="text-headline-medium font-bold text-orange-900 mt-1">
                {formatCurrency(stats?.pendingPayouts || 0)}
              </h3>
              <p className="text-label-small text-orange-700 mt-2">
                {payouts?.filter(p => p.status === 'pending').length} requests waiting
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-60 rounded-xl shadow-sm">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-purple-700 font-medium">Active Sellers</p>
              <h3 className="text-headline-medium font-bold text-purple-900 mt-1">
                {stats?.activeSellers}
              </h3>
              <p className="text-label-small text-purple-700 mt-2">
                Generating revenue
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-60 rounded-xl shadow-sm">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payout Requests */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-title-medium font-bold text-grey-900">Payout Requests</h2>
          <Button variant="outline" size="sm">Export History</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-200">
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Seller</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Amount</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Bank Account</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Requested</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Status</th>
                <th className="text-right py-3 px-4 text-label-medium font-medium text-grey-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts?.map((payout) => (
                <tr key={payout.id} className="border-b border-grey-100 hover:bg-grey-50">
                  <td className="py-3 px-4">
                    <p className="text-body-medium font-medium text-grey-900">{payout.sellerName}</p>
                    <p className="text-label-small text-grey-500">ID: {payout.sellerId}</p>
                  </td>
                  <td className="py-3 px-4 text-body-medium font-bold text-grey-900">
                    {formatCurrency(payout.amount)}
                  </td>
                  <td className="py-3 px-4 text-body-medium text-grey-600">
                    {payout.bankAccount}
                  </td>
                  <td className="py-3 px-4 text-body-medium text-grey-600">
                    {formatDate(payout.dateRequested)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      payout.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {payout.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(payout.id)}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                          title="Approve Payout"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(payout.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Reject Payout"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default FinancePage;
















