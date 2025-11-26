import { useState, useEffect, useCallback, useMemo } from 'react';
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
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

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
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  productName?: string;
  productImage?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  typing?: boolean;
}

// Mock conversations for buyer
const mockConversations: Conversation[] = [
  {
    id: '1',
    sellerId: 'seller1',
    sellerName: 'AudioTech Store',
    sellerAvatar: 'https://i.pravatar.cc/150?u=audiotech',
    productName: 'Premium Wireless Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    lastMessage: 'The headphones are in stock! Would you like to place an order?',
    lastMessageTime: new Date(Date.now() - 300000),
    unreadCount: 1,
    online: true,
  },
  {
    id: '2',
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    sellerAvatar: 'https://i.pravatar.cc/150?u=fashionhub',
    productName: 'Handcrafted Leather Bag',
    productImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100',
    lastMessage: 'We offer free shipping on this item!',
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 0,
    online: true,
  },
  {
    id: '3',
    sellerId: 'seller3',
    sellerName: 'Home Decor Plus',
    sellerAvatar: 'https://i.pravatar.cc/150?u=homedecor',
    productName: 'Minimalist Desk Lamp',
    lastMessage: 'Thank you for your interest!',
    lastMessageTime: new Date(Date.now() - 7200000),
    unreadCount: 0,
    online: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      senderId: 'buyer',
      text: 'Hi! I\'m interested in the Premium Wireless Headphones. Is it still available?',
      timestamp: new Date(Date.now() - 600000),
      read: true,
    },
    {
      id: 'm2',
      senderId: 'seller1',
      text: 'Hello! Yes, the headphones are in stock. We have both black and silver colors available.',
      timestamp: new Date(Date.now() - 540000),
      read: true,
    },
    {
      id: 'm3',
      senderId: 'buyer',
      text: 'Great! How long does shipping usually take?',
      timestamp: new Date(Date.now() - 480000),
      read: true,
    },
    {
      id: 'm4',
      senderId: 'seller1',
      text: 'The headphones are in stock! Would you like to place an order?',
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
  ],
  '2': [
    {
      id: 'm5',
      senderId: 'buyer',
      text: 'Can you tell me more about the leather quality?',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
    {
      id: 'm6',
      senderId: 'seller2',
      text: 'It\'s genuine Italian leather, very durable and high quality. We offer free shipping on this item!',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
  ],
};

const BuyerMessagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isMobileView, setIsMobileView] = useState(false);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setConversations(mockConversations);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Handle new conversation from product detail page
  useEffect(() => {
    if (location.state && location.state.sellerId) {
      const { sellerId, sellerName, productName, productImage } = location.state;
      
      // Check if conversation already exists
      const existingConv = conversations.find(c => c.sellerId === sellerId && c.productName === productName);
      
      if (existingConv) {
        setSelectedConversation(existingConv);
        setIsMobileView(true);
      } else {
        // Create new conversation
        const newConv: Conversation = {
          id: `new-${Date.now()}`,
          sellerId,
          sellerName,
          productName,
          productImage,
          lastMessage: '',
          lastMessageTime: new Date(),
          unreadCount: 0,
          online: true,
        };
        
        setConversations(prev => [newConv, ...prev]);
        setSelectedConversation(newConv);
        setIsMobileView(true);
        setMessages([]);
      }
      
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, conversations, navigate, location.pathname]);

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const conversationMessages = mockMessages[selectedConversation.id] || [];
      setMessages(conversationMessages);
      
      // Mark as read
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

    if (searchQuery) {
      filtered = filtered.filter(conv => 
        conv.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter === 'unread') {
      filtered = filtered.filter(conv => conv.unreadCount > 0);
    }

    return filtered;
  }, [conversations, searchQuery, filter]);

  const totalUnreadCount = useMemo(() => 
    conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
    [conversations]
  );

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'buyer',
      text: messageInput,
      timestamp: new Date(),
      read: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: messageInput, 
              lastMessageTime: new Date(),
            } 
          : conv
      )
    );

    toast.success('Message sent!');
  }, [messageInput, selectedConversation]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6 shrink-0">
          <div className="flex items-center gap-4 mb-4">
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
                  {totalUnreadCount} unread message{totalUnreadCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
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
              selectedConversation && isMobileView && 'hidden lg:flex'
            )}>
              {/* Search */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sellers or products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <InboxIcon className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-sm text-gray-500">No conversations</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setIsMobileView(true);
                      }}
                      className={clsx(
                        'p-4 border-b border-gray-200 cursor-pointer transition-all hover:bg-white',
                        selectedConversation?.id === conversation.id && 'bg-white border-l-4 border-l-gold'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Seller Avatar */}
                        <div className="relative flex-shrink-0">
                          {conversation.sellerAvatar ? (
                            <img 
                              src={conversation.sellerAvatar} 
                              alt={conversation.sellerName}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/20"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
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
                            <h3 className="font-bold text-sm text-gray-900 truncate">
                              {conversation.sellerName}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true })}
                            </span>
                          </div>
                          {conversation.productName && (
                            <p className="text-xs text-gold mb-1 truncate flex items-center gap-1">
                              <span className="font-medium">Re: {conversation.productName}</span>
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className={clsx(
                              'text-xs truncate',
                              conversation.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'
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
                                className="flex-shrink-0 ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                              >
                                {conversation.unreadCount}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
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
                          setSelectedConversation(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                      >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                      </button>

                      <div className="relative">
                        {selectedConversation.sellerAvatar ? (
                          <img 
                            src={selectedConversation.sellerAvatar} 
                            alt={selectedConversation.sellerName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/20"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                            <UserCircleIcon className="w-8 h-8 text-white" />
                          </div>
                        )}
                        {selectedConversation.online && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div>
                        <h2 className="font-bold text-gray-900">{selectedConversation.sellerName}</h2>
                        {selectedConversation.productName && (
                          <p className="text-xs text-gold">About: {selectedConversation.productName}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {selectedConversation.online ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              Online
                            </span>
                          ) : (
                            `Last seen ${formatDistanceToNow(selectedConversation.lastMessageTime, { addSuffix: true })}`
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
                  {messages.map((message, index) => {
                    const isFromBuyer = message.senderId === 'buyer';
                    const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                    
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={clsx(
                          'flex gap-3 items-end',
                          isFromBuyer ? 'flex-row-reverse' : 'flex-row'
                        )}
                      >
                        {/* Avatar */}
                        <div className="w-8 h-8 flex-shrink-0">
                          {showAvatar && !isFromBuyer && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                              <UserCircleIcon className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={clsx(
                            'max-w-md px-4 py-2.5 rounded-2xl shadow-sm',
                            isFromBuyer
                              ? 'bg-gradient-to-br from-gold to-gold-dark text-white rounded-br-sm'
                              : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
                          )}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <div className={clsx(
                            'flex items-center gap-1 mt-1',
                            isFromBuyer ? 'justify-end' : 'justify-start'
                          )}>
                            <span className={clsx(
                              'text-xs',
                              isFromBuyer ? 'text-white/70' : 'text-gray-500'
                            )}>
                              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                            </span>
                            {isFromBuyer && message.read && (
                              <CheckIconSolid className="w-3.5 h-3.5 text-white/70" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {selectedConversation.typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
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
                  )}
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
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none transition-all text-sm"
                        style={{ maxHeight: '120px' }}
                      />
                      
                      <button 
                        onClick={() => {}}
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
              <div className={clsx(
                'flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white h-full',
                selectedConversation && isMobileView && 'hidden lg:flex'
              )}>
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

