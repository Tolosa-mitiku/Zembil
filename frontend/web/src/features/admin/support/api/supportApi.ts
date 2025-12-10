import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: 'seller' | 'buyer';
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'account' | 'other';
  createdAt: string;
  lastUpdate: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'tkt_1',
    userId: 's1',
    userName: 'TechStore',
    userRole: 'seller',
    subject: 'Cannot upload products',
    status: 'open',
    priority: 'high',
    category: 'technical',
    createdAt: new Date().toISOString(),
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'tkt_2',
    userId: 'u5',
    userName: 'Mary Johnson',
    userRole: 'buyer',
    subject: 'Refund not received',
    status: 'in_progress',
    priority: 'medium',
    category: 'billing',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    lastUpdate: new Date(Date.now() - 3600000).toISOString()
  }
];

export const adminSupportApi = createApi({
  reducerPath: 'adminSupportApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/support',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tickets'],
  endpoints: (builder) => ({
    getTickets: builder.query<SupportTicket[], void>({
      queryFn: () => ({ data: mockTickets }),
      providesTags: ['Tickets'],
    }),
    updateTicketStatus: builder.mutation<void, { id: string; status: SupportTicket['status'] }>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['Tickets'],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useUpdateTicketStatusMutation,
} = adminSupportApi;












