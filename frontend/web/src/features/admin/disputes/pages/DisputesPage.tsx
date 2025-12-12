import { useState } from 'react';
import { useGetDisputesQuery, useResolveDisputeMutation } from '../api/disputesApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { formatDate, formatCurrency } from '@/core/utils/format';
import { 
  ScaleIcon, 
  ChatBubbleBottomCenterTextIcon,
  ShieldExclamationIcon 
} from '@heroicons/react/24/outline';

const DisputesPage = () => {
  const { data: disputes, isLoading } = useGetDisputesQuery();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline-large font-bold text-grey-900 mb-1">Dispute Resolution</h1>
        <p className="text-body-small text-grey-600">Mediate and resolve buyer-seller conflicts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {disputes?.map((dispute) => (
          <Card key={dispute.id} className="border-l-4 border-l-red-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <ScaleIcon className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-grey-900">Dispute #{dispute.id}</h3>
                </div>
                <p className="text-xs text-grey-500 mt-1">Order: {dispute.orderId}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                dispute.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                'bg-grey-100 text-grey-800'
              }`}>
                {dispute.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-grey-600">Amount in Dispute:</span>
                <span className="font-bold text-grey-900">{formatCurrency(dispute.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-grey-600">Buyer:</span>
                <span className="text-grey-900">{dispute.buyerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-grey-600">Seller:</span>
                <span className="text-grey-900">{dispute.sellerName}</span>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-800 font-medium">Reason: {dispute.reason}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                <ChatBubbleBottomCenterTextIcon className="w-4 h-4 mr-2" /> Message Parties
              </Button>
              <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 border-red-600">
                <ShieldExclamationIcon className="w-4 h-4 mr-2" /> Resolve
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DisputesPage;














