import { useState } from 'react';
import { useGetAllPromotionsQuery, useApprovePromotionMutation, useRejectPromotionMutation } from '../api/promotionsApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { formatDate } from '@/core/utils/format';
import { 
  MegaphoneIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PromotionsPage = () => {
  const { data: promotions, isLoading } = useGetAllPromotionsQuery();
  const [approvePromotion] = useApprovePromotionMutation();
  const [rejectPromotion] = useRejectPromotionMutation();

  const handleApprove = async (id: string) => {
    try {
      await approvePromotion(id).unwrap();
      toast.success('Promotion approved');
    } catch (err) {
      toast.error('Failed to approve promotion');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectPromotion(id).unwrap();
      toast.success('Promotion rejected');
    } catch (err) {
      toast.error('Failed to reject promotion');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline-large font-bold text-grey-900 mb-1">Promotions Management</h1>
        <p className="text-body-small text-grey-600">Review and manage seller promotional campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions?.map((promo) => (
          <Card key={promo.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 w-1 h-full ${
              promo.status === 'active' ? 'bg-green-500' :
              promo.status === 'pending' ? 'bg-yellow-500' :
              promo.status === 'rejected' ? 'bg-red-500' : 'bg-grey-300'
            }`} />
            
            <div className="pl-3">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <TagIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-grey-900">{promo.title}</h3>
                    <p className="text-xs text-grey-500">by {promo.sellerName}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  promo.status === 'active' ? 'bg-green-100 text-green-800' :
                  promo.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  promo.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-grey-100 text-grey-600'
                }`}>
                  {promo.status.toUpperCase()}
                </span>
              </div>

              <p className="text-body-medium text-grey-600 mb-4 line-clamp-2">
                {promo.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-grey-500">
                  <ClockIcon className="w-4 h-4 mr-1.5" />
                  <span>{formatDate(promo.startDate)} - {formatDate(promo.endDate)}</span>
                </div>
                <div className="flex items-center text-xs text-grey-500">
                  <MegaphoneIcon className="w-4 h-4 mr-1.5" />
                  <span>{promo.type.replace('_', ' ').toUpperCase()} • {promo.discountValue}{promo.discountType === 'percentage' ? '%' : '$'} OFF</span>
                </div>
              </div>

              {promo.status === 'pending' && (
                <div className="flex space-x-2 pt-2 border-t border-grey-100">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700 border-green-600"
                    onClick={() => handleApprove(promo.id)}
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleReject(promo.id)}
                  >
                    <XCircleIcon className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromotionsPage;












