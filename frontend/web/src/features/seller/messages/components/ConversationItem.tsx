import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

interface ConversationItemProps {
  conversation: {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    online: boolean;
    typing?: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const ConversationItem = ({ 
  conversation, 
  isSelected, 
  onClick, 
  index 
}: ConversationItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={clsx(
        'p-4 border-b border-grey-100 cursor-pointer transition-all hover:bg-grey-50 group',
        isSelected && 'bg-gold/5 border-l-4 border-l-gold'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {conversation.userAvatar ? (
            <img 
              src={conversation.userAvatar} 
              alt={conversation.userName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-gold/20 transition-all"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCircleIcon className="w-8 h-8 text-white" />
            </div>
          )}
          {conversation.online && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-grey-900 truncate group-hover:text-gold transition-colors">
              {conversation.userName}
            </h3>
            <span className="text-xs text-grey-500 flex-shrink-0 ml-2">
              {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className={clsx(
              'text-sm truncate transition-colors',
              conversation.unreadCount > 0 
                ? 'text-grey-900 font-medium' 
                : 'text-grey-500 group-hover:text-grey-700'
            )}>
              {conversation.typing ? (
                <span className="text-gold italic flex items-center gap-1">
                  <span className="inline-flex gap-0.5">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-1 h-1 bg-gold rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-1 h-1 bg-gold rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-1 h-1 bg-gold rounded-full"
                    />
                  </span>
                  Typing...
                </span>
              ) : (
                conversation.lastMessage
              )}
            </p>
            {conversation.unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 ml-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm"
              >
                {conversation.unreadCount}
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationItem;

