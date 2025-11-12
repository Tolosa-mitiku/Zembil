import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  XMarkIcon,
  InboxIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import MessagesSkeleton from '../components/MessagesSkeleton';

// Mock data - Replace with actual Firebase/API integration
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  type?: 'text' | 'image' | 'file';
}

interface Conversation {
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

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://i.pravatar.cc/150?u=sarah',
    lastMessage: 'Hi! Is this item still available?',
    lastMessageTime: new Date(Date.now() - 300000), // 5 mins ago
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Michael Chen',
    userAvatar: 'https://i.pravatar.cc/150?u=michael',
    lastMessage: 'Thank you for the quick response!',
    lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
    unreadCount: 0,
    online: true,
    typing: false,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Emma Williams',
    userAvatar: 'https://i.pravatar.cc/150?u=emma',
    lastMessage: 'Can I get a discount on bulk orders?',
    lastMessageTime: new Date(Date.now() - 7200000), // 2 hours ago
    unreadCount: 1,
    online: false,
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'James Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?u=james',
    lastMessage: 'Perfect! I\'ll place the order soon.',
    lastMessageTime: new Date(Date.now() - 86400000), // 1 day ago
    unreadCount: 0,
    online: false,
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Olivia Taylor',
    userAvatar: 'https://i.pravatar.cc/150?u=olivia',
    lastMessage: 'When will the item be shipped?',
    lastMessageTime: new Date(Date.now() - 172800000), // 2 days ago
    unreadCount: 3,
    online: true,
  },
];

// Mock messages for selected conversation
const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      senderId: 'user1',
      text: 'Hello! I\'m interested in your leather jacket.',
      timestamp: new Date(Date.now() - 600000),
      read: true,
    },
    {
      id: 'm2',
      senderId: 'seller',
      text: 'Hi Sarah! Yes, it\'s available. Which size are you looking for?',
      timestamp: new Date(Date.now() - 540000),
      read: true,
    },
    {
      id: 'm3',
      senderId: 'user1',
      text: 'I need a medium. Do you have it in stock?',
      timestamp: new Date(Date.now() - 480000),
      read: true,
    },
    {
      id: 'm4',
      senderId: 'seller',
      text: 'Yes, we have medium in stock! Would you like me to reserve it for you?',
      timestamp: new Date(Date.now() - 420000),
      read: true,
    },
    {
      id: 'm5',
      senderId: 'user1',
      text: 'Hi! Is this item still available?',
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
  ],
  '2': [
    {
      id: 'm6',
      senderId: 'user2',
      text: 'Hi, I received my order yesterday.',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
    {
      id: 'm7',
      senderId: 'seller',
      text: 'That\'s great! How do you like it?',
      timestamp: new Date(Date.now() - 7140000),
      read: true,
    },
    {
      id: 'm8',
      senderId: 'user2',
      text: 'Thank you for the quick response!',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
  ],
  '3': [
    {
      id: 'm9',
      senderId: 'user3',
      text: 'Can I get a discount on bulk orders?',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
  ],
};

const MessagesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setConversations(mockConversations);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      // Simulate loading messages
      const conversationMessages = mockMessages[selectedConversation.id] || [];
      setMessages(conversationMessages);
      
      // Mark messages as read
      if (selectedConversation.unreadCount > 0) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, unreadCount: 0 } 
              : conv
          )
        );
      }
    }
  }, [selectedConversation]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(conv => 
        conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by unread
    if (filter === 'unread') {
      filtered = filtered.filter(conv => conv.unreadCount > 0);
    }

    return filtered;
  }, [conversations, searchQuery, filter]);

  // Total unread count
  const totalUnreadCount = useMemo(() => 
    conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
    [conversations]
  );

  // Send message
  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'seller',
      text: messageInput,
      timestamp: new Date(),
      read: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: messageInput, 
              lastMessageTime: new Date(),
              typing: false,
            } 
          : conv
      )
    );

    toast.success('Message sent!');
  }, [messageInput, selectedConversation]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simulate typing indicator
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (messageInput && selectedConversation) {
      setIsTyping(true);
      timeout = setTimeout(() => setIsTyping(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [messageInput, selectedConversation]);

  // Show loading skeleton
  if (isLoading) {
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
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-grey-50 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-grey-400 p-8">
                <InboxIcon className="w-16 h-16 mb-4" />
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedConversation(conversation)}
                    className={clsx(
                      'p-4 border-b border-grey-100 cursor-pointer transition-all hover:bg-grey-50',
                      selectedConversation?.id === conversation.id && 'bg-gold/5 border-l-4 border-l-gold'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {conversation.userAvatar ? (
                          <img 
                            src={conversation.userAvatar} 
                            alt={conversation.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center">
                            <UserCircleIcon className="w-8 h-8 text-white" />
                          </div>
                        )}
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-grey-900 truncate">
                            {conversation.userName}
                          </h3>
                          <span className="text-xs text-grey-500 flex-shrink-0 ml-2">
                            {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={clsx(
                            'text-sm truncate',
                            conversation.unreadCount > 0 ? 'text-grey-900 font-medium' : 'text-grey-500'
                          )}>
                            {conversation.typing ? (
                              <span className="text-gold italic">Typing...</span>
                            ) : (
                              conversation.lastMessage
                            )}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex-shrink-0 ml-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded-full"
                            >
                              {conversation.unreadCount}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-grey-200 bg-gradient-to-r from-white to-gold/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    {selectedConversation.userAvatar ? (
                      <img 
                        src={selectedConversation.userAvatar} 
                        alt={selectedConversation.userName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center">
                        <UserCircleIcon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    {selectedConversation.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="font-semibold text-grey-900">{selectedConversation.userName}</h2>
                    <p className="text-sm text-grey-500">
                      {selectedConversation.online ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Active now
                        </span>
                      ) : (
                        `Last seen ${formatDistanceToNow(selectedConversation.lastMessageTime, { addSuffix: true })}`
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
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => {
                  const isFromSeller = message.senderId === 'seller';
                  const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={clsx(
                        'flex gap-3 items-end',
                        isFromSeller ? 'flex-row-reverse' : 'flex-row'
                      )}
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 flex-shrink-0">
                        {showAvatar && !isFromSeller && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-grey-300 to-grey-400 flex items-center justify-center">
                            <UserCircleIcon className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={clsx(
                          'max-w-md px-4 py-2.5 rounded-2xl shadow-sm',
                          isFromSeller
                            ? 'bg-gradient-to-br from-gold to-gold-dark text-white rounded-br-sm'
                            : 'bg-white border border-grey-200 text-grey-900 rounded-bl-sm'
                        )}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <div className={clsx(
                          'flex items-center gap-1 mt-1',
                          isFromSeller ? 'justify-end' : 'justify-start'
                        )}>
                          <span className={clsx(
                            'text-xs',
                            isFromSeller ? 'text-white/70' : 'text-grey-500'
                          )}>
                            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                          </span>
                          {isFromSeller && message.read && (
                            <CheckIconSolid className="w-3.5 h-3.5 text-white/70" />
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing Indicator */}
              {selectedConversation.typing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-grey-300 to-grey-400 flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white border border-grey-200 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-2 h-2 bg-grey-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-grey-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 bg-grey-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
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
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-3 pr-12 bg-grey-50 border border-grey-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none transition-all"
                    style={{ maxHeight: '120px' }}
                  />
                  
                  {/* Emoji Button */}
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-grey-200 rounded-lg transition-colors"
                  >
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
