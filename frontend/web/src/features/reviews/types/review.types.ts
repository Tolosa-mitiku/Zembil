export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
  productId: string | {
    _id: string;
    title: string;
    images: string[];
  };
  sellerId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  helpful: number;
  helpfulBy: string[];
  status: 'pending' | 'approved' | 'rejected';
  sellerResponse?: {
    message: string;
    respondedAt: Date;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface RatingDistribution {
  _id: number;
  count: number;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  ratingDistribution: RatingDistribution[];
}

export interface AddReviewRequest {
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  orderId?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
  verifiedPurchasePercentage: number;
}

















