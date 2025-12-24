import { api } from '@/core/http/api';

export type RefundStatus = 'requested' | 'processing' | 'completed' | 'rejected';

export interface ReturnItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  reason: string;
}

export interface ReturnRequest {
  _id: string;
  orderId: string;
  orderNumber: string;
  buyerId: string;
  buyer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: ReturnItem[];
  totalAmount: number;
  reason: string;
  description?: string;
  images?: string[]; // Images uploaded by customer showing the issue
  status: RefundStatus;
  requestedAt: string;
  processedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequestsResponse {
  returns: ReturnRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReturnStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  rejected: number;
  totalRefundAmount: number;
  averageProcessingTime: number; // in hours
}

// Mock data for demonstration
const mockReturns: ReturnRequest[] = [
  {
    _id: '1',
    orderId: 'order_001',
    orderNumber: 'ZMB-20241128-1234',
    buyerId: 'buyer_001',
    buyer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
    },
    items: [
      {
        productId: 'prod_001',
        title: 'Premium Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        reason: 'Defective product',
      },
    ],
    totalAmount: 299.99,
    reason: 'Defective product',
    description: 'The left ear cup stopped working after 2 days of use. Audio only plays from the right side.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
    ],
    status: 'requested',
    requestedAt: '2024-11-27T10:30:00Z',
    createdAt: '2024-11-27T10:30:00Z',
    updatedAt: '2024-11-27T10:30:00Z',
  },
  {
    _id: '2',
    orderId: 'order_002',
    orderNumber: 'ZMB-20241127-5678',
    buyerId: 'buyer_002',
    buyer: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
    },
    items: [
      {
        productId: 'prod_002',
        title: 'Smart Watch Series 5',
        price: 449.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        reason: 'Wrong item received',
      },
    ],
    totalAmount: 449.99,
    reason: 'Wrong item received',
    description: 'I ordered the black model but received the silver one instead.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    status: 'processing',
    requestedAt: '2024-11-26T14:20:00Z',
    processedAt: '2024-11-27T09:15:00Z',
    createdAt: '2024-11-26T14:20:00Z',
    updatedAt: '2024-11-27T09:15:00Z',
  },
  {
    _id: '3',
    orderId: 'order_003',
    orderNumber: 'ZMB-20241125-9012',
    buyerId: 'buyer_003',
    buyer: {
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
    },
    items: [
      {
        productId: 'prod_003',
        title: 'Designer Handbag',
        price: 599.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
        reason: 'Changed mind',
      },
    ],
    totalAmount: 599.99,
    reason: 'Changed mind',
    description: 'The color doesn\'t match what I was looking for. Would like to return it.',
    status: 'completed',
    requestedAt: '2024-11-24T11:00:00Z',
    processedAt: '2024-11-25T16:30:00Z',
    createdAt: '2024-11-24T11:00:00Z',
    updatedAt: '2024-11-25T16:30:00Z',
  },
  {
    _id: '4',
    orderId: 'order_004',
    orderNumber: 'ZMB-20241124-3456',
    buyerId: 'buyer_004',
    buyer: {
      name: 'David Park',
      email: 'david.park@email.com',
      phone: '+1 (555) 246-8135',
    },
    items: [
      {
        productId: 'prod_004',
        title: 'Mechanical Keyboard RGB',
        price: 129.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        reason: 'Damaged during shipping',
      },
    ],
    totalAmount: 129.99,
    reason: 'Damaged during shipping',
    description: 'Package was damaged and the keyboard has several scratches on the frame.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600',
    ],
    status: 'requested',
    requestedAt: '2024-11-23T16:45:00Z',
    createdAt: '2024-11-23T16:45:00Z',
    updatedAt: '2024-11-23T16:45:00Z',
  },
  {
    _id: '5',
    orderId: 'order_005',
    orderNumber: 'ZMB-20241123-7890',
    buyerId: 'buyer_005',
    buyer: {
      name: 'Lisa Martinez',
      email: 'lisa.m@email.com',
    },
    items: [
      {
        productId: 'prod_005',
        title: 'Running Shoes Pro',
        price: 159.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        reason: 'Size doesn\'t fit',
      },
    ],
    totalAmount: 159.99,
    reason: 'Size doesn\'t fit',
    description: 'Shoes are too small. Need to exchange for a larger size.',
    status: 'rejected',
    requestedAt: '2024-11-22T13:20:00Z',
    processedAt: '2024-11-23T10:00:00Z',
    rejectionReason: 'Item has been worn and cannot be returned per our policy.',
    createdAt: '2024-11-22T13:20:00Z',
    updatedAt: '2024-11-23T10:00:00Z',
  },
  {
    _id: '6',
    orderId: 'order_006',
    orderNumber: 'ZMB-20241122-2468',
    buyerId: 'buyer_006',
    buyer: {
      name: 'James Wilson',
      email: 'james.w@email.com',
      phone: '+1 (555) 369-2581',
    },
    items: [
      {
        productId: 'prod_006',
        title: 'Laptop Stand Aluminum',
        price: 79.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        reason: 'Defective product',
      },
    ],
    totalAmount: 159.98,
    reason: 'Defective product',
    description: 'One of the stands is unstable and wobbles. The adjustable joint is loose.',
    status: 'processing',
    requestedAt: '2024-11-21T09:30:00Z',
    processedAt: '2024-11-21T15:00:00Z',
    createdAt: '2024-11-21T09:30:00Z',
    updatedAt: '2024-11-21T15:00:00Z',
  },
];

const getMockReturnsPage = (
  page: number = 1,
  limit: number = 12,
  status?: string
): ReturnRequestsResponse => {
  let filteredReturns = [...mockReturns];
  
  // Filter by status if provided
  if (status && status !== 'all') {
    filteredReturns = filteredReturns.filter(r => r.status === status);
  }
  
  const total = filteredReturns.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    returns: filteredReturns.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const getMockStats = (): ReturnStats => {
  return {
    total: mockReturns.length,
    pending: mockReturns.filter(r => r.status === 'requested').length,
    processing: mockReturns.filter(r => r.status === 'processing').length,
    completed: mockReturns.filter(r => r.status === 'completed').length,
    rejected: mockReturns.filter(r => r.status === 'rejected').length,
    totalRefundAmount: mockReturns
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.totalAmount, 0),
    averageProcessingTime: 18.5, // hours
  };
};

export const returnsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReturnRequests: builder.query<ReturnRequestsResponse, {
      page?: number;
      limit?: number;
      status?: string;
    }>({
      queryFn: async (params) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const page = params.page || 1;
        const limit = params.limit || 12;
        
        const result = getMockReturnsPage(page, limit, params.status);
        return { data: result };
      },
      providesTags: ['Returns'],
    }),

    getReturnRequestById: builder.query<ReturnRequest, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const returnRequest = mockReturns.find(r => r._id === id);
        if (!returnRequest) {
          return { error: { status: 404, data: 'Return request not found' } };
        }
        
        return { data: returnRequest };
      },
      providesTags: ['Returns'],
    }),

    getReturnStats: builder.query<ReturnStats, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return { data: getMockStats() };
      },
      providesTags: ['Returns'],
    }),

    approveReturn: builder.mutation<ReturnRequest, { id: string; note?: string }>({
      queryFn: async ({ id }) => {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const returnRequest = mockReturns.find(r => r._id === id);
        if (!returnRequest) {
          return { error: { status: 404, data: 'Return request not found' } };
        }
        
        return { 
          data: { 
            ...returnRequest, 
            status: 'processing' as RefundStatus,
            processedAt: new Date().toISOString(),
          } 
        };
      },
      invalidatesTags: ['Returns'],
    }),

    rejectReturn: builder.mutation<ReturnRequest, { id: string; reason: string }>({
      queryFn: async ({ id, reason }) => {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const returnRequest = mockReturns.find(r => r._id === id);
        if (!returnRequest) {
          return { error: { status: 404, data: 'Return request not found' } };
        }
        
        return { 
          data: { 
            ...returnRequest, 
            status: 'rejected' as RefundStatus,
            processedAt: new Date().toISOString(),
            rejectionReason: reason,
          } 
        };
      },
      invalidatesTags: ['Returns'],
    }),

    completeRefund: builder.mutation<ReturnRequest, { id: string; amount: number }>({
      queryFn: async ({ id }) => {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const returnRequest = mockReturns.find(r => r._id === id);
        if (!returnRequest) {
          return { error: { status: 404, data: 'Return request not found' } };
        }
        
        return { 
          data: { 
            ...returnRequest, 
            status: 'completed' as RefundStatus,
            processedAt: new Date().toISOString(),
          } 
        };
      },
      invalidatesTags: ['Returns'],
    }),
  }),
});

export const {
  useGetReturnRequestsQuery,
  useGetReturnRequestByIdQuery,
  useGetReturnStatsQuery,
  useApproveReturnMutation,
  useRejectReturnMutation,
  useCompleteRefundMutation,
} = returnsApi;

















