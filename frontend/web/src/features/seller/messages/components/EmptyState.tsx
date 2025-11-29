import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState = ({ 
  title = "No conversation selected",
  description = "Select a conversation from the list to start chatting with your customers"
}: EmptyStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-grey-50 via-white to-gold/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 100,
          damping: 15
        }}
        className="text-center max-w-md px-6"
      >
        {/* Animated Icon Container */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: 'easeInOut'
          }}
          className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold/20 via-gold/10 to-gold-dark/20 flex items-center justify-center relative overflow-hidden"
        >
          {/* Pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full border-2 border-gold"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-gold"
          />
          
          {/* Icon */}
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-gold relative z-10" />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-grey-900 mb-2">
            {title}
          </h2>
          <p className="text-grey-500 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                delay: i * 0.2
              }}
              className="w-2 h-2 rounded-full bg-gold"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyState;

