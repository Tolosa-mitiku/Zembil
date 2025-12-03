/**
 * Seller Messages Page
 * Real-time messaging with Socket.IO integration
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  InboxIcon,
  ChatBubbleLeftRightIcon,
  WifiIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

// API and Socket imports
import {
  useGetSellerChatsQuery,
  useGetSellerMessagesQuery,
  useSendSellerMessageMutation,
  Chat,
  Message,
  getChatDisplayInfo,
} from '../api/messagesApi';
import { useSocket } from '@/core/socket/SocketContext';
import MessagesSkeleton from '../components/MessagesSkeleton';

// ============= COMPONENTS =============

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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-grey-300 to-grey-400 flex items-center justify-center">
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
            : 'bg-white border border-grey-200 text-grey-900 rounded-bl-sm'
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
            isOwn ? 'text-white/70' : 'text-grey-500'
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
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-grey-300 to-grey-400 flex items-center justify-center">
      <UserCircleIcon className="w-6 h-6 text-white" />
    </div>
    <div className="bg-white border border-grey-200 px-4 py-3 rounded-2xl rounded-bl-sm">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
            className="w-2 h-2 bg-grey-400 rounded-full"
          />
        ))}
      </div>
    </div>
  </motion.div>
);

// ============= MAIN COMPONENT =============

const MessagesPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
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
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  
  // API hooks
  const { 
    data: chats = [], 
    isLoading: chatsLoading,
    refetch: refetchChats,
  } = useGetSellerChatsQuery();
  
  const { 
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useGetSellerMessagesQuery(
    { chatId: selectedChatId! },
    { skip: !selectedChatId }
  );
  
  const [sendMessageMutation] = useSendSellerMessageMutation();

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

  // Filter conversations
  const filteredChats = useMemo(() => {
    let filtered = chats;

    if (searchQuery) {
      filtered = filtered.filter(chat => {
        const info = getChatDisplayInfo(chat, 'seller');
        return info.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (filter === 'unread') {
      filtered = filtered.filter(chat => 
        (chat.unreadMessagesCount?.seller || 0) > 0
      );
    }

    return filtered;
  }, [chats, searchQuery, filter]);

  const totalUnreadCount = useMemo(() => 
    chats.reduce((sum, chat) => sum + (chat.unreadMessagesCount?.seller || 0), 0),
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
    return <MessagesSkeleton />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-grey-50 via-white to-gold/5">
      {/* Header */}
      <div className="bg-white border-b border-grey-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-grey-900 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              Message Center
            </h1>
            <p className="text-sm text-grey-500 mt-1">
              {totalUnreadCount > 0 ? (
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-medium text-red-600">
                      {totalUnreadCount} unread message{totalUnreadCount !== 1 ? 's' : ''}
                    </span>
                  </span>
                </span>
              ) : (
                'All caught up!'
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ConnectionStatus isConnected={isConnected} isConnecting={isConnecting} />
            
            {/* Filter tabs */}
            <div className="flex items-center gap-2 bg-grey-100 rounded-xl p-1">
              <button
                onClick={() => setFilter('all')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  filter === 'all'
                    ? 'bg-white text-gold shadow-sm'
                    : 'text-grey-600 hover:text-grey-900'
                )}
              >
                All Messages
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                  filter === 'unread'
                    ? 'bg-white text-gold shadow-sm'
                    : 'text-grey-600 hover:text-grey-900'
                )}
              >
                Unread
                {totalUnreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {totalUnreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-96 border-r border-grey-200 bg-white flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-grey-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-grey-50 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-grey-400 p-8">
                <InboxIcon className="w-16 h-16 mb-4" />
                <p className="text-sm text-center">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </p>
                <p className="text-xs text-grey-400 mt-2 text-center">
                  Customers will appear here when they message you
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredChats.map((chat, index) => {
                  const displayInfo = getChatDisplayInfo(chat, 'seller');
                  const isSelected = selectedChatId === chat._id;
                  
                  return (
                    <motion.div
                      key={chat._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedChatId(chat._id)}
                      className={clsx(
                        'p-4 border-b border-grey-100 cursor-pointer transition-all hover:bg-grey-50',
                        isSelected && 'bg-gold/5 border-l-4 border-l-gold'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          {displayInfo.avatar ? (
                            <img 
                              src={displayInfo.avatar} 
                              alt={displayInfo.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center">
                              <UserCircleIcon className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-grey-900 truncate">
                              {displayInfo.name}
                            </h3>
                            <span className="text-xs text-grey-500 flex-shrink-0 ml-2">
                              {chat.lastMessageAt && formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className={clsx(
                              'text-sm truncate',
                              displayInfo.unreadCount > 0 ? 'text-grey-900 font-medium' : 'text-grey-500'
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
                                className="flex-shrink-0 ml-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded-full"
                              >
                                {displayInfo.unreadCount}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-grey-200 bg-gradient-to-r from-white to-gold/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    {(() => {
                      const info = getChatDisplayInfo(selectedChat, 'seller');
                      return info.avatar ? (
                        <img 
                          src={info.avatar} 
                          alt={info.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center">
                          <UserCircleIcon className="w-8 h-8 text-white" />
                        </div>
                      );
                    })()}
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="font-semibold text-grey-900">
                      {getChatDisplayInfo(selectedChat, 'seller').name}
                    </h2>
                    <p className="text-sm text-grey-500">
                      {isOtherTyping ? (
                        <span className="text-gold">Typing...</span>
                      ) : (
                        'Customer'
                      )}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <button className="p-2 hover:bg-grey-100 rounded-lg transition-colors">
                  <EllipsisVerticalIcon className="w-5 h-5 text-grey-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-grey-50/50 to-white">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ChatBubbleLeftRightIcon className="w-16 h-16 text-grey-300 mb-4" />
                  <p className="text-grey-500">No messages yet</p>
                  <p className="text-sm text-grey-400 mt-1">Send a message to start the conversation</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isOwn = message.senderRole === 'seller';
                    const senderId = typeof message.senderId === 'string' 
                      ? message.senderId 
                      : message.senderId._id;
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
            <div className="p-4 border-t border-grey-200 bg-white">
              <div className="flex items-end gap-3">
                {/* Attachment Button */}
                <button className="p-2.5 hover:bg-grey-100 rounded-xl transition-colors flex-shrink-0">
                  <PaperClipIcon className="w-5 h-5 text-grey-600" />
                </button>

                {/* Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-3 pr-12 bg-grey-50 border border-grey-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none transition-all"
                    style={{ maxHeight: '120px' }}
                  />
                  
                  {/* Emoji Button */}
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-grey-200 rounded-lg transition-colors">
                    <FaceSmileIcon className="w-5 h-5 text-grey-600" />
                  </button>
                </div>

                {/* Send Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className={clsx(
                    'p-3 rounded-xl transition-all flex-shrink-0',
                    messageInput.trim()
                      ? 'bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg hover:shadow-xl'
                      : 'bg-grey-200 text-grey-400 cursor-not-allowed'
                  )}
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-grey-50 via-white to-gold/5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-grey-900 mb-2">No conversation selected</h2>
              <p className="text-grey-500 max-w-sm">
                Select a conversation from the list to start chatting with your customers
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
