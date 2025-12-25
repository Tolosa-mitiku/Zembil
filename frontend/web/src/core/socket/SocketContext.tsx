/**
 * Socket.IO Context for Real-time Communication
 * Provides WebSocket connection management and event handling
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '@/store/hooks';
import { auth } from '@/core/firebase/config';

// Types
interface Message {
  _id: string;
  chatRoomId: string;
  senderId: string | { _id: string; name: string; image?: string };
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
  createdAt: string;
  updatedAt: string;
}

interface Chat {
  _id: string;
  buyerId: string | { _id: string; name: string; image?: string };
  sellerId: string | { _id: string; businessName: string; profileImage?: string };
  chatRoomId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadMessagesCount: {
    buyer: number;
    seller: number;
  };
  isActive: boolean;
}

interface TypingEvent {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

interface UserStatusEvent {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface MessagesReadEvent {
  chatId: string;
  readBy: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  
  // Actions
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string, type?: string, attachment?: any) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  markAsRead: (chatId: string) => void;
  
  // Event handlers - these will be overwritten by components
  onNewMessage: ((data: { chatId: string; message: Message }) => void) | null;
  onChatUpdated: ((chat: Chat) => void) | null;
  onUserTyping: ((data: TypingEvent) => void) | null;
  onUserStatus: ((data: UserStatusEvent) => void) | null;
  onMessagesRead: ((data: MessagesReadEvent) => void) | null;
  
  // Setters for event handlers
  setOnNewMessage: (handler: ((data: { chatId: string; message: Message }) => void) | null) => void;
  setOnChatUpdated: (handler: ((chat: Chat) => void) | null) => void;
  setOnUserTyping: (handler: ((data: TypingEvent) => void) | null) => void;
  setOnUserStatus: (handler: ((data: UserStatusEvent) => void) | null) => void;
  setOnMessagesRead: (handler: ((data: MessagesReadEvent) => void) | null) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

// Socket.IO server URL
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Event handlers refs (to avoid stale closures)
  const onNewMessageRef = useRef<((data: { chatId: string; message: Message }) => void) | null>(null);
  const onChatUpdatedRef = useRef<((chat: Chat) => void) | null>(null);
  const onUserTypingRef = useRef<((data: TypingEvent) => void) | null>(null);
  const onUserStatusRef = useRef<((data: UserStatusEvent) => void) | null>(null);
  const onMessagesReadRef = useRef<((data: MessagesReadEvent) => void) | null>(null);

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect if not authenticated
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const connectSocket = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        // Get Firebase auth token
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No authenticated user');
        }

        const token = await user.getIdToken();

        // Create socket connection
        const newSocket = io(SOCKET_URL, {
          auth: { token },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
        });

        // Connection events
        newSocket.on('connect', () => {
          setIsConnected(true);
          setIsConnecting(false);
          setError(null);
        });

        newSocket.on('disconnect', (reason) => {
          setIsConnected(false);
          
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            newSocket.connect();
          }
        });

        newSocket.on('connect_error', (err) => {
          console.error('🔌 Socket connection error:', err.message);
          setError(err.message);
          setIsConnecting(false);
        });

        // Message events
        newSocket.on('new_message', (data: { chatId: string; message: Message }) => {
          if (onNewMessageRef.current) {
            onNewMessageRef.current(data);
          }
        });

        newSocket.on('chat_updated', (chat: Chat) => {
          if (onChatUpdatedRef.current) {
            onChatUpdatedRef.current(chat);
          }
        });

        newSocket.on('user_typing', (data: TypingEvent) => {
          if (onUserTypingRef.current) {
            onUserTypingRef.current(data);
          }
        });

        newSocket.on('user_status', (data: UserStatusEvent) => {
          if (onUserStatusRef.current) {
            onUserStatusRef.current(data);
          }
        });

        newSocket.on('messages_read', (data: MessagesReadEvent) => {
          if (onMessagesReadRef.current) {
            onMessagesReadRef.current(data);
          }
        });

        newSocket.on('error', (data: { message: string }) => {
          console.error('🔌 Socket error:', data.message);
          setError(data.message);
        });

        setSocket(newSocket);
      } catch (err: any) {
        console.error('Failed to connect socket:', err);
        setError(err.message);
        setIsConnecting(false);
      }
    };

    connectSocket();

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated]);

  // Actions
  const joinChat = useCallback((chatId: string) => {
    if (socket && isConnected) {
      socket.emit('join_chat', chatId);
    }
  }, [socket, isConnected]);

  const leaveChat = useCallback((chatId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_chat', chatId);
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((
    chatId: string,
    content: string,
    type: string = 'text',
    attachment?: any
  ) => {
    if (socket && isConnected) {
      socket.emit('send_message', { chatId, content, type, attachment });
    }
  }, [socket, isConnected]);

  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit('typing', { chatId, isTyping });
    }
  }, [socket, isConnected]);

  const markAsRead = useCallback((chatId: string) => {
    if (socket && isConnected) {
      socket.emit('mark_read', chatId);
    }
  }, [socket, isConnected]);

  // Setters for event handlers
  const setOnNewMessage = useCallback((handler: ((data: { chatId: string; message: Message }) => void) | null) => {
    onNewMessageRef.current = handler;
  }, []);

  const setOnChatUpdated = useCallback((handler: ((chat: Chat) => void) | null) => {
    onChatUpdatedRef.current = handler;
  }, []);

  const setOnUserTyping = useCallback((handler: ((data: TypingEvent) => void) | null) => {
    onUserTypingRef.current = handler;
  }, []);

  const setOnUserStatus = useCallback((handler: ((data: UserStatusEvent) => void) | null) => {
    onUserStatusRef.current = handler;
  }, []);

  const setOnMessagesRead = useCallback((handler: ((data: MessagesReadEvent) => void) | null) => {
    onMessagesReadRef.current = handler;
  }, []);

  const value: SocketContextType = {
    socket,
    isConnected,
    isConnecting,
    error,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    markAsRead,
    onNewMessage: onNewMessageRef.current,
    onChatUpdated: onChatUpdatedRef.current,
    onUserTyping: onUserTypingRef.current,
    onUserStatus: onUserStatusRef.current,
    onMessagesRead: onMessagesReadRef.current,
    setOnNewMessage,
    setOnChatUpdated,
    setOnUserTyping,
    setOnUserStatus,
    setOnMessagesRead,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};

export default SocketContext;

