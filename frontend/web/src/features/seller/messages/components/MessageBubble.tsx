import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    read: boolean;
    type?: 'text' | 'image' | 'file';
  };
  isFromSeller: boolean;
  showAvatar: boolean;
  index: number;
  senderAvatar?: string;
}

const MessageBubble = ({ 
  message, 
  isFromSeller, 
  showAvatar, 
  index,
  senderAvatar 
}: MessageBubbleProps) => {
  return (
    <motion.div
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {senderAvatar ? (
              <img 
                src={senderAvatar} 
                alt="Sender"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-grey-300 to-grey-400 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Message Bubble */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={clsx(
          'max-w-md px-4 py-2.5 rounded-2xl shadow-sm transition-shadow hover:shadow-md',
          isFromSeller
            ? 'bg-gradient-to-br from-gold to-gold-dark text-white rounded-br-sm'
            : 'bg-white border border-grey-200 text-grey-900 rounded-bl-sm'
        )}
      >
        {/* Message Text */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>
        
        {/* Timestamp & Status */}
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckIconSolid className="w-3.5 h-3.5 text-white/70" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MessageBubble;

