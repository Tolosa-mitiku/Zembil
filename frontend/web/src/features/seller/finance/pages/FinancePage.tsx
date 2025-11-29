import { useState } from 'react';
import { useGetEarningsQuery, useGetPayoutsQuery, useRequestPayoutMutation } from '../api/financeApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import { formatCurrency, formatDate } from '@/core/utils/format';
import { BanknotesIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FinancePage = () => {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  
  const { data: earningsData, isLoading: isLoadingEarnings } = useGetEarningsQuery();
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
      toast.success('Payout requested successfully');
      setIsPayoutModalOpen(false);
      setPayoutAmount('');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to request payout');
    }
  };

  const getPayoutStatusVariant = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
      completed: 'success',
      processing: 'info',
      pending: 'warning',
      failed: 'error',
    };
    return statusMap[status] || 'default';
  };

  if (isLoadingEarnings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-large text-grey-900 mb-2">Finance</h1>
          <p className="text-body-medium text-grey-600">
            Manage your earnings and payouts
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsPayoutModalOpen(true)}
          disabled={!earningsData?.availableForPayout || earningsData.availableForPayout <= 0}
        >
          Request Payout
        </Button>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Total Earnings</p>
              <p className="text-headline-small text-grey-900 font-semibold">
                {formatCurrency(earningsData?.totalEarnings || 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gold-pale">
              <BanknotesIcon className="w-6 h-6 text-gold" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Available for Payout</p>
              <p className="text-headline-small text-green-600 font-semibold">
                {formatCurrency(earningsData?.availableForPayout || 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Pending Clearing</p>
              <p className="text-headline-small text-orange-600 font-semibold">
                {formatCurrency(earningsData?.pendingClearing || 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-small text-grey-600 mb-1">Paid Out</p>
              <p className="text-headline-small text-grey-900 font-semibold">
                {formatCurrency(earningsData?.paidOut || 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-grey-100">
              <CheckCircleIcon className="w-6 h-6 text-grey-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payout History */}
      <Card title="Payout History">
        {isLoadingPayouts ? (
          <div className="text-center py-8">Loading...</div>
        ) : !payoutsData?.payouts.length ? (
          <div className="text-center py-8 text-grey-500">
            <p>No payout history yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-grey-200">
                <tr>
                  <th className="text-left py-3 px-4 text-label-large text-grey-700">Amount</th>
                  <th className="text-left py-3 px-4 text-label-large text-grey-700">Method</th>
                  <th className="text-left py-3 px-4 text-label-large text-grey-700">Status</th>
                  <th className="text-left py-3 px-4 text-label-large text-grey-700">Requested</th>
                  <th className="text-left py-3 px-4 text-label-large text-grey-700">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-200">
                {payoutsData.payouts.map((payout) => (
                  <tr key={payout._id} className="hover:bg-grey-50">
                    <td className="py-3 px-4 text-body-medium text-grey-900">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="py-3 px-4 text-body-medium text-grey-900">
                      {payout.payoutMethod}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getPayoutStatusVariant(payout.status)}>
                        {payout.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-body-small text-grey-600">
                      {formatDate(payout.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-body-small text-grey-600">
                      {payout.completedAt ? formatDate(payout.completedAt) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Payout Request Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Request Payout"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gold-pale p-4 rounded-md">
            <p className="text-body-small text-grey-600">Available Balance</p>
            <p className="text-title-large text-grey-900 font-semibold">
              {formatCurrency(earningsData?.availableForPayout || 0)}
            </p>
          </div>

          <Input
            label="Payout Amount"
            type="number"
            step="0.01"
            placeholder="Enter amount"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRequestPayout} isLoading={isRequesting}>
              Request Payout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FinancePage;

