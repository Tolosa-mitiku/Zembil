import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { auth } from '@/core/firebase/config';

// Types
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  type?: 'text' | 'image' | 'file';
  attachmentUrl?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  typing?: boolean;
}

export interface SendMessageRequest {
  conversationId: string;
  text: string;
  type?: 'text' | 'image' | 'file';
  attachmentUrl?: string;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
  total: number;
}

export interface GetMessagesResponse {
  messages: Message[];
  conversationId: string;
}

// API
export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    prepareHeaders: async (headers) => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          headers.set('authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
      return headers;
    },
  }),
  tagTypes: ['Conversations', 'Messages'],
  endpoints: (builder) => ({
    // Get all conversations
    getConversations: builder.query<GetConversationsResponse, void>({
      query: () => '/chats',
      providesTags: ['Conversations'],
    }),

    // Get messages for a conversation
    getMessages: builder.query<GetMessagesResponse, string>({
      query: (conversationId) => `/chats/${conversationId}/messages`,
      providesTags: (_result, _error, conversationId) => [
        { type: 'Messages', id: conversationId },
      ],
    }),

    // Send a message
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: ({ conversationId, ...body }) => ({
        url: `/chats/${conversationId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
        'Conversations',
      ],
    }),

    // Mark messages as read
    markAsRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/chats/${conversationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversations'],
    }),

    // Start a new conversation
    startConversation: builder.mutation<Conversation, { userId: string }>({
      query: (body) => ({
        url: '/chats',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversations'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useStartConversationMutation,
} = messagesApi;

