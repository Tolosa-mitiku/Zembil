import { useState } from 'react';
import { useGetReturnsQuery, useResolveReturnMutation } from '../api/returnsApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { formatDate, formatCurrency } from '@/core/utils/format';
import { 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ReturnsPage = () => {
  const { data: returns, isLoading } = useGetReturnsQuery();
  const [resolveReturn] = useResolveReturnMutation();

  const handleResolve = async (id: string, decision: 'approve' | 'reject') => {
    try {
      await resolveReturn({ id, decision }).unwrap();
      toast.success(`Return ${decision}d successfully`);
    } catch (err) {
      toast.error('Failed to resolve return');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline-large font-bold text-grey-900 mb-1">Returns & Refunds</h1>
        <p className="text-body-small text-grey-600">Manage return requests and resolve disputes</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-200">
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Return Details</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Product & Amount</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Reason</th>
                <th className="text-left py-3 px-4 text-label-medium font-medium text-grey-600">Status</th>
                <th className="text-right py-3 px-4 text-label-medium font-medium text-grey-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns?.map((req) => (
                <tr key={req.id} className="border-b border-grey-100 hover:bg-grey-50">
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-grey-900">{req.orderId}</span>
                      <span className="text-xs text-grey-500">From: {req.buyerName}</span>
                      <span className="text-xs text-grey-500">To: {req.sellerName}</span>
                      <span className="text-xs text-grey-400">{formatDate(req.requestedAt)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-body-medium text-grey-900">{req.productName}</span>
                      <span className="font-bold text-grey-900">{formatCurrency(req.amount)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-body-medium text-grey-600">
                    {req.reason}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      req.status === 'dispute' ? 'bg-red-100 text-red-800' :
                      req.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-grey-100 text-grey-800'
                    }`}>
                      {req.status === 'dispute' && <ExclamationTriangleIcon className="w-3 h-3 mr-1" />}
                      {req.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Button variant="ghost" size="sm" title="View Details">
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    {(req.status === 'pending' || req.status === 'dispute') && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-800"
                          onClick={() => handleResolve(req.id, 'approve')}
                          title="Approve Refund"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleResolve(req.id, 'reject')}
                          title="Reject Return"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </Button>
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

export default ReturnsPage;












