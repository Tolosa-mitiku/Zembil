import { useState } from 'react';
import { useGetAllReviewsQuery, useUpdateReviewStatusMutation, useDeleteReviewMutation } from '../api/reviewsApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import { formatDate } from '@/core/utils/format';
import { 
  StarIcon, 
  TrashIcon, 
  EyeSlashIcon, 
  EyeIcon,
  FlagIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ReviewsPage = () => {
  const { data: reviews, isLoading } = useGetAllReviewsQuery();
  const [updateStatus] = useUpdateReviewStatusMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleStatusChange = async (id: string, newStatus: 'published' | 'hidden') => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Review ${newStatus === 'hidden' ? 'hidden' : 'published'}`);
    } catch (err) {
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id).unwrap();
        toast.success('Review deleted');
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-headline-large font-bold text-grey-900 mb-1">Reviews Management</h1>
        <p className="text-body-small text-grey-600">Moderate product reviews and ratings</p>
      </div>

      <div className="space-y-4">
        {reviews?.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < review.rating ? (
                          <StarIconSolid className="w-5 h-5" />
                        ) : (
                          <StarIcon className="w-5 h-5 text-grey-300" />
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold text-grey-900">{review.productName}</span>
                  {review.status === 'flagged' && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                      <FlagIcon className="w-3 h-3 mr-1" /> Flagged
                    </span>
                  )}
                  {review.status === 'hidden' && (
                    <span className="bg-grey-100 text-grey-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                      <EyeSlashIcon className="w-3 h-3 mr-1" /> Hidden
                    </span>
                  )}
                </div>
                
                <p className="text-body-medium text-grey-700 mb-3">{review.comment}</p>
                
                <div className="flex items-center text-xs text-grey-500 space-x-4">
                  <span>By: {review.userName}</span>
                  <span>Seller: {review.sellerName}</span>
                  <span>{formatDate(review.date)}</span>
                  <span>{review.helpfulCount} people found this helpful</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                {review.status === 'hidden' ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusChange(review.id, 'published')}
                  >
                    <EyeIcon className="w-4 h-4 mr-1" /> Publish
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={() => handleStatusChange(review.id, 'hidden')}
                  >
                    <EyeSlashIcon className="w-4 h-4 mr-1" /> Hide
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  onClick={() => handleDelete(review.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;












