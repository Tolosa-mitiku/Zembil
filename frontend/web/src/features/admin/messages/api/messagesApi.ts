import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'seller' | 'buyer';
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'escalated';
}

const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    participants: [
      { id: 'u1', name: 'John Doe', role: 'buyer' },
      { id: 's1', name: 'TechStore', role: 'seller' }
    ],
    lastMessage: 'Where is my order?',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 1,
    status: 'escalated'
  },
  {
    id: 'conv_2',
    participants: [
      { id: 'u2', name: 'Jane Smith', role: 'seller' },
      { id: 'a1', name: 'Admin Support', role: 'admin' }
    ],
    lastMessage: 'I need help with product listing',
    lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0,
    status: 'active'
  }
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'u1',
    senderName: 'John Doe',
    senderRole: 'buyer',
    recipientId: 's1',
    content: 'Where is my order?',
    timestamp: new Date().toISOString(),
    read: false
  }
];

export const adminMessagesApi = createApi({
  reducerPath: 'adminMessagesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/messages',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    getAllConversations: builder.query<Conversation[], void>({
      queryFn: () => ({ data: mockConversations }),
      providesTags: ['Messages'],
    }),
    getMessages: builder.query<Message[], string>({
      queryFn: (conversationId) => ({ data: mockMessages }),
      providesTags: ['Messages'],
    }),
    sendMessage: builder.mutation<void, { conversationId: string; content: string }>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const {
  useGetAllConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = adminMessagesApi;




