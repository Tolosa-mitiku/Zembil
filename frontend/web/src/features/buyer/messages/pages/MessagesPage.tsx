/**
 * Buyer Messages Page
 * Real-time messaging with Socket.IO integration
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  InboxIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  WifiIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

// API and Socket imports
import {
  useGetChatsQuery,
  useGetMessagesQuery,
  useCreateOrGetChatMutation,
  useSendMessageMutation,
  Chat,
  Message,
  getChatDisplayInfo,
} from '../api/messagesApi';
import { useSocket } from '@/core/socket/SocketContext';
import { useAppSelector } from '@/store/hooks';

// ============= COMPONENTS =============

// Loading skeleton for chat list
const ChatListSkeleton = () => (
  <div className="space-y-2 p-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-full" />
        </div>
      </div>
    ))}
  </div>
);

// Loading skeleton for messages
const MessagesSkeleton = () => (
  <div className="space-y-4 p-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className={clsx('flex gap-3', i % 2 === 0 ? 'flex-row-reverse' : '')}>
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <div className={clsx(
          'max-w-md px-4 py-3 rounded-2xl animate-pulse',
          i % 2 === 0 ? 'bg-gold/20' : 'bg-gray-200'
        )}>
          <div className="h-4 w-48 bg-gray-300 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-300 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Connection status indicator
const ConnectionStatus: React.FC<{ isConnected: boolean; isConnecting: boolean }> = ({ 
  isConnected, 
  isConnecting 
}) => {
  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full">
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        <span className="text-xs font-medium text-yellow-700">Connecting...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
        <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
        <span className="text-xs font-medium text-red-700">Offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
      <WifiIcon className="w-4 h-4 text-green-500" />
      <span className="text-xs font-medium text-green-700">Connected</span>
    </div>
  );
};

// Message bubble component
const MessageBubble: React.FC<{
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}> = ({ message, isOwn, showAvatar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={clsx(
        'flex gap-3 items-end',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div className="w-8 h-8 flex-shrink-0">
        {showAvatar && !isOwn && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <UserCircleIcon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={clsx(
          'max-w-md px-4 py-2.5 rounded-2xl shadow-sm',
          isOwn
            ? 'bg-gradient-to-br from-gold to-gold-dark text-white rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        
        {/* Attachment */}
        {message.attachment && (
          <div className="mt-2 p-2 bg-white/10 rounded-lg">
            <a 
              href={message.attachment.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs underline"
            >
              {message.attachment.fileName || 'Attachment'}
            </a>
          </div>
        )}
        
        <div className={clsx(
          'flex items-center gap-1 mt-1',
          isOwn ? 'justify-end' : 'justify-start'
        )}>
          <span className={clsx(
            'text-xs',
            isOwn ? 'text-white/70' : 'text-gray-500'
          )}>
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
          {isOwn && (
            <CheckIconSolid className={clsx(
              'w-3.5 h-3.5',
              message.isRead ? 'text-blue-300' : 'text-white/70'
            )} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Typing indicator component
const TypingIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex items-center gap-3"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
      <UserCircleIcon className="w-6 h-6 text-white" />
    </div>
    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
        ))}
      </div>
    </div>
  </motion.div>
);

// ============= MAIN COMPONENT =============

const BuyerMessagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Auth state
  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = user?.uid;
  
  // Socket connection
  const { 
    isConnected, 
    isConnecting, 
    joinChat, 
    leaveChat, 
    sendMessage: socketSendMessage,
    sendTyping,
    markAsRead,
    setOnNewMessage,
    setOnChatUpdated,
    setOnUserTyping,
    setOnMessagesRead,
  } = useSocket();
  
  // Local state
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isMobileView, setIsMobileView] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  
  // API hooks
  const { 
    data: chats = [], 
    isLoading: chatsLoading,
    refetch: refetchChats,
  } = useGetChatsQuery();
  
  const { 
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useGetMessagesQuery(
    { chatId: selectedChatId! },
    { skip: !selectedChatId }
  );
  
  const [createOrGetChat] = useCreateOrGetChatMutation();
  const [sendMessageMutation] = useSendMessageMutation();

  // Get selected chat info
  const selectedChat = useMemo(() => 
    chats.find(c => c._id === selectedChatId),
    [chats, selectedChatId]
  );

  // Combined messages (API + local optimistic)
  const messages = useMemo(() => {
    const apiMessages = messagesData?.data || [];
    // Merge and sort by date, removing duplicates
    const allMessages = [...apiMessages, ...localMessages];
    const uniqueMessages = allMessages.filter((msg, index, self) => 
      index === self.findIndex(m => m._id === msg._id)
    );
    return uniqueMessages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messagesData, localMessages]);

  // Set up socket event handlers
  useEffect(() => {
    setOnNewMessage((data) => {
      if (data.chatId === selectedChatId) {
        // Add new message to local state for instant display
        setLocalMessages(prev => {
          // Check if message already exists
          if (prev.some(m => m._id === data.message._id)) {
            return prev;
          }
          return [...prev, data.message];
        });
        
        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      
      // Refetch chats to update unread counts
      refetchChats();
    });

    setOnChatUpdated(() => {
      refetchChats();
    });

    setOnUserTyping((data) => {
      if (data.chatId === selectedChatId) {
        setTypingUsers(prev => ({
          ...prev,
          [data.userId]: data.isTyping,
        }));
      }
    });

    setOnMessagesRead((data) => {
      if (data.chatId === selectedChatId) {
        // Update read status in local messages
        setLocalMessages(prev => 
          prev.map(m => ({ ...m, isRead: true }))
        );
        refetchMessages();
      }
    });

    return () => {
      setOnNewMessage(null);
      setOnChatUpdated(null);
      setOnUserTyping(null);
      setOnMessagesRead(null);
    };
  }, [selectedChatId, refetchChats, refetchMessages, setOnNewMessage, setOnChatUpdated, setOnUserTyping, setOnMessagesRead]);

  // Join/leave chat room when selection changes
  useEffect(() => {
    if (selectedChatId && isConnected) {
      joinChat(selectedChatId);
      markAsRead(selectedChatId);
      setLocalMessages([]); // Clear local messages when switching chats
    }

    return () => {
      if (selectedChatId && isConnected) {
        leaveChat(selectedChatId);
      }
    };
  }, [selectedChatId, isConnected, joinChat, leaveChat, markAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle new conversation from product detail page
  useEffect(() => {
    if (location.state?.sellerId) {
      const { sellerId, sellerName, productName } = location.state;
      
      // Create or get existing chat
      createOrGetChat({ sellerId })
        .unwrap()
        .then(({ data: chat }) => {
          setSelectedChatId(chat._id);
          setIsMobileView(true);
          
          if (!location.state.exists) {
            toast.success(`Started conversation with ${sellerName || 'seller'}`);
          }
        })
        .catch(() => {
          toast.error('Failed to start conversation');
        });
      
      // Clear location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, createOrGetChat, navigate, location.pathname]);

  // Filter conversations
  const filteredChats = useMemo(() => {
    let filtered = chats;

    if (searchQuery) {
      filtered = filtered.filter(chat => {
        const info = getChatDisplayInfo(chat, 'buyer');
        return info.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (filter === 'unread') {
      filtered = filtered.filter(chat => 
        (chat.unreadMessagesCount?.buyer || 0) > 0
      );
    }

    return filtered;
  }, [chats, searchQuery, filter]);

  const totalUnreadCount = useMemo(() => 
    chats.reduce((sum, chat) => sum + (chat.unreadMessagesCount?.buyer || 0), 0),
    [chats]
  );

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedChatId) return;

    const content = messageInput.trim();
    setMessageInput('');

    // Stop typing indicator
    sendTyping(selectedChatId, false);

    if (isConnected) {
      // Send via socket for real-time delivery
      socketSendMessage(selectedChatId, content);
    } else {
      // Fallback to HTTP
      try {
        await sendMessageMutation({ chatId: selectedChatId, content }).unwrap();
        refetchMessages();
      } catch {
        toast.error('Failed to send message');
        setMessageInput(content); // Restore message on error
      }
    }
  }, [messageInput, selectedChatId, isConnected, socketSendMessage, sendMessageMutation, sendTyping, refetchMessages]);

  // Handle typing
  const handleTyping = useCallback((value: string) => {
    setMessageInput(value);

    if (!selectedChatId || !isConnected) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    if (value.trim()) {
      sendTyping(selectedChatId, true);
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(selectedChatId, false);
      }, 2000);
    } else {
      sendTyping(selectedChatId, false);
    }
  }, [selectedChatId, isConnected, sendTyping]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Check if someone is typing
  const isOtherTyping = Object.values(typingUsers).some(Boolean);

  // Loading state
  if (chatsLoading) {
    return (
      <div className="h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden h-full flex">
            <div className="w-full lg:w-96 border-r border-gray-200">
              <ChatListSkeleton />
            </div>
            <div className="flex-1 hidden lg:flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              
              {totalUnreadCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-semibold text-red-600">
                    {totalUnreadCount} unread
                  </span>
                </div>
              )}
            </div>
            
            <ConnectionStatus isConnected={isConnected} isConnecting={isConnecting} />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 w-fit">
            <button
              onClick={() => setFilter('all')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              All Chats
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Unread
              {totalUnreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {totalUnreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex min-h-0">
          {/* Conversations Sidebar */}
          <div className={clsx(
            'w-full lg:w-96 border-r border-gray-200 flex flex-col bg-gray-50 h-full',
            selectedChatId && isMobileView && 'hidden lg:flex'
          )}>
            {/* Search */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <InboxIcon className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-sm text-gray-500 text-center">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Start chatting with sellers from product pages
                  </p>
                </div>
              ) : (
                filteredChats.map((chat, index) => {
                  const displayInfo = getChatDisplayInfo(chat, 'buyer');
                  const isSelected = selectedChatId === chat._id;
                  
                  return (
                    <motion.div
                      key={chat._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => {
                        setSelectedChatId(chat._id);
                        setIsMobileView(true);
                      }}
                      className={clsx(
                        'p-4 border-b border-gray-200 cursor-pointer transition-all hover:bg-white',
                        isSelected && 'bg-white border-l-4 border-l-gold'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          {displayInfo.avatar ? (
                            <img 
                              src={displayInfo.avatar} 
                              alt={displayInfo.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/20"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                              <UserCircleIcon className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-sm text-gray-900 truncate">
                              {displayInfo.name}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {chat.lastMessageAt && formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className={clsx(
                              'text-xs truncate',
                              displayInfo.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'
                            )}>
                              {typingUsers[chat._id] ? (
                                <span className="text-gold italic">Typing...</span>
                              ) : (
                                chat.lastMessage || 'No messages yet'
                              )}
                            </p>
                            {displayInfo.unreadCount > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex-shrink-0 ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                              >
                                {displayInfo.unreadCount}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedChat ? (
            <div className={clsx(
              'flex-1 flex flex-col bg-white h-full',
              !isMobileView && 'hidden lg:flex'
            )}>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-white to-gold/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setIsMobileView(false);
                        setSelectedChatId(null);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                    >
                      <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="relative">
                      {(() => {
                        const info = getChatDisplayInfo(selectedChat, 'buyer');
                        return info.avatar ? (
                          <img 
                            src={info.avatar} 
                            alt={info.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/20"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                            <UserCircleIcon className="w-8 h-8 text-white" />
                          </div>
                        );
                      })()}
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        {getChatDisplayInfo(selectedChat, 'buyer').name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {isOtherTyping ? (
                          <span className="text-gold">Typing...</span>
                        ) : (
                          'Online'
                        )}
                      </p>
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                {messagesLoading ? (
                  <MessagesSkeleton />
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Send a message to start the conversation</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const senderId = typeof message.senderId === 'string' 
                        ? message.senderId 
                        : message.senderId._id;
                      const isOwn = message.senderRole === 'buyer';
                      const showAvatar = index === 0 || 
                        (typeof messages[index - 1].senderId === 'string' 
                          ? messages[index - 1].senderId 
                          : messages[index - 1].senderId._id) !== senderId;
                      
                      return (
                        <MessageBubble
                          key={message._id}
                          message={message}
                          isOwn={isOwn}
                          showAvatar={showAvatar}
                        />
                      );
                    })}

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isOtherTyping && <TypingIndicator />}
                    </AnimatePresence>
                  </>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-3">
                  <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0">
                    <PaperClipIcon className="w-5 h-5 text-gray-600" />
                  </button>

                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none transition-all text-sm"
                      style={{ maxHeight: '120px' }}
                    />
                    
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <FaceSmileIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className={clsx(
                      'p-3 rounded-xl transition-all flex-shrink-0',
                      messageInput.trim()
                        ? 'bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            // Empty State
            <div className="flex-1 hidden lg:flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8"
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-16 h-16 text-gold" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a conversation</h2>
                <p className="text-gray-500 max-w-sm">
                  Choose a seller from the list to view your conversation and send messages
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerMessagesPage;
