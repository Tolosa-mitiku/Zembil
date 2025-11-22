import { useState } from 'react';
import { useGetAllConversationsQuery, useSendMessageMutation } from '../api/messagesApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime } from '@/core/utils/format';

const MessagesPage = () => {
  const { data: conversations, isLoading } = useGetAllConversationsQuery();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-fade-in">
      <div className="mb-4">
        <h1 className="text-headline-large font-bold text-grey-900">Message Center</h1>
        <p className="text-body-small text-grey-600">Monitor and manage platform communications</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Conversation List */}
        <Card className="w-1/3 flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b border-grey-100">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2 bg-grey-50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations?.map((conv) => (
              <div 
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-4 border-b border-grey-100 cursor-pointer hover:bg-grey-50 transition-colors ${
                  selectedConversation === conv.id ? 'bg-gold-50 hover:bg-gold-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="w-8 h-8 text-grey-400" />
                    <div>
                      <p className="font-semibold text-grey-900 text-sm">
                        {conv.participants.map(p => p.name).join(', ')}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        conv.status === 'escalated' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {conv.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-grey-500 whitespace-nowrap">
                    {formatRelativeTime(conv.lastMessageTime)}
                  </span>
                </div>
                <p className="text-sm text-grey-600 truncate pl-10">
                  {conv.lastMessage}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col p-0 overflow-hidden">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-grey-100 bg-white shadow-sm flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="w-10 h-10 text-grey-400" />
                  <div>
                    <h3 className="font-bold text-grey-900">Conversation Details</h3>
                    <p className="text-xs text-grey-500">ID: {selectedConversation}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">View Order</Button>
                  <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 border-red-600">Resolve Dispute</Button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-grey-50">
                {/* Mock Message Bubbles */}
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[70%]">
                    <p className="text-sm text-grey-800">Where is my order? It was supposed to arrive yesterday.</p>
                    <span className="text-[10px] text-grey-400 block mt-1">10:30 AM</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-gold-100 p-3 rounded-lg rounded-tr-none shadow-sm max-w-[70%]">
                    <p className="text-sm text-grey-900">Checking the status for you now.</p>
                    <span className="text-[10px] text-grey-500 block mt-1">10:32 AM</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-grey-100 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 p-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <Button variant="primary" size="sm">
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-grey-400">
              <ChatBubbleLeftRightIcon className="w-16 h-16 mb-4" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;




