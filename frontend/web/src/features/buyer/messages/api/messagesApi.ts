/**
 * Buyer Messages API
 * RTK Query API for chat and messaging operations
 */

import { api } from '@/core/http/api';

// ============= INTERFACES =============

export interface UserInfo {
  _id: string;
  name?: string;
  businessName?: string;
  image?: string;
  profileImage?: string;
}

export interface Message {
  _id: string;
  chatRoomId: string;
  senderId: string | UserInfo;
  senderRole: 'buyer' | 'seller' | 'admin';
  recipientId: string;
  type: 'text' | 'image' | 'file' | 'system';
  content: string;
  attachment?: {
    type: string;
    url: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
  isRead: boolean;
  readAt?: string;
  isSystem?: boolean;
  systemEventType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  buyerId: string | UserInfo;
  sellerId: string | UserInfo;
  chatRoomId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadMessagesCount: {
    buyer: number;
    seller: number;
  };
  participants?: Array<{
    userId: string;
    role: string;
    isOnline: boolean;
    lastSeen?: string;
    isTyping?: boolean;
  }>;
  isActive: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  chatId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
  attachment?: {
    type: string;
    url: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
}

export interface CreateChatPayload {
  sellerId: string;
}

// ============= HELPER FUNCTIONS =============

/**
 * Get user display info from chat
 */
export const getChatDisplayInfo = (chat: Chat, currentUserRole: 'buyer' | 'seller') => {
  if (currentUserRole === 'buyer') {
    const seller = chat.sellerId as UserInfo;
    return {
      name: seller?.businessName || seller?.name || 'Seller',
      avatar: seller?.profileImage || seller?.image,
      unreadCount: chat.unreadMessagesCount?.buyer || 0,
    };
  } else {
    const buyer = chat.buyerId as UserInfo;
    return {
      name: buyer?.name || 'Buyer',
      avatar: buyer?.image,
      unreadCount: chat.unreadMessagesCount?.seller || 0,
    };
  }
};

/**
 * Get sender info from message
 */
export const getMessageSenderInfo = (message: Message) => {
  const sender = message.senderId as UserInfo;
  if (typeof message.senderId === 'string') {
    return { id: message.senderId, name: 'User', avatar: undefined };
  }
  return {
    id: sender._id,
    name: sender.businessName || sender.name || 'User',
    avatar: sender.profileImage || sender.image,
  };
};

// ============= API SLICE =============

export const messagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's chats (conversations list)
    getChats: builder.query<Chat[], void>({
      query: () => '/messages/chats',
      transformResponse: (response: { success: boolean; data: Chat[] }) => 
        response.data || [],
      providesTags: (result) => {
        if (!result) {
          return [{ type: 'Chat' as const, id: 'LIST' }];
        }
        return [
          { type: 'Chat' as const, id: 'LIST' },
          ...result.map((chat) => ({ type: 'Chat' as const, id: chat._id })),
        ];
      },
      keepUnusedDataFor: 30,
    }),

    // Get messages for a specific chat
    getMessages: builder.query<{ data: Message[]; pagination: any }, { chatId: string; page?: number; limit?: number }>({
      query: ({ chatId, page = 1, limit = 50 }) => 
        `/messages/chats/${chatId}?page=${page}&limit=${limit}`,
      transformResponse: (response: { success: boolean; data: Message[]; pagination: any }) => ({
        data: response.data || [],
        pagination: response.pagination,
      }),
      providesTags: (_result, _error, { chatId }) => [
        { type: 'Message' as const, id: chatId },
      ],
      keepUnusedDataFor: 60,
    }),

    // Create or get existing chat with a seller
    createOrGetChat: builder.mutation<{ data: Chat; exists: boolean }, CreateChatPayload>({
      query: (payload) => ({
        url: '/messages/chats',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: { success: boolean; data: Chat; exists: boolean }) => ({
        data: response.data,
        exists: response.exists,
      }),
      invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
    }),

    // Send a message (HTTP fallback - prefer socket for real-time)
    sendMessage: builder.mutation<Message, SendMessagePayload>({
      query: ({ chatId, ...body }) => ({
        url: `/messages/chats/${chatId}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { success: boolean; data: Message }) => 
        response.data,
      // Optimistic update for instant feedback
      async onQueryStarted({ chatId, content }, { dispatch, queryFulfilled }) {
        // Create optimistic message
        const optimisticMessage: Partial<Message> = {
          _id: `temp-${Date.now()}`,
          content,
          type: 'text',
          senderRole: 'buyer',
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        // Optimistically add to messages
        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', { chatId }, (draft) => {
            draft.data.push(optimisticMessage as Message);
          })
        );

        try {
          const { data: sentMessage } = await queryFulfilled;
          // Replace optimistic message with real one
          dispatch(
            messagesApi.util.updateQueryData('getMessages', { chatId }, (draft) => {
              const index = draft.data.findIndex(m => m._id === optimisticMessage._id);
              if (index !== -1) {
                draft.data[index] = sentMessage;
              }
            })
          );
        } catch {
          // Revert on error
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { chatId }) => [
        { type: 'Message', id: chatId },
        { type: 'Chat', id: 'LIST' },
      ],
    }),

    // Get unread message count across all chats
    getUnreadCount: builder.query<number, void>({
      query: () => '/messages/chats',
      transformResponse: (response: { success: boolean; data: Chat[] }) => {
        const chats = response.data || [];
        return chats.reduce((sum, chat) => sum + (chat.unreadMessagesCount?.buyer || 0), 0);
      },
      providesTags: ['Chat'],
      keepUnusedDataFor: 30,
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetChatsQuery,
  useGetMessagesQuery,
  useCreateOrGetChatMutation,
  useSendMessageMutation,
  useGetUnreadCountQuery,
} = messagesApi;

