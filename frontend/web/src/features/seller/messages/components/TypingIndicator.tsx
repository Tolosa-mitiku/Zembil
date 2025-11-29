import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-3"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-grey-300 to-grey-400 flex items-center justify-center" />
      
      {/* Typing Bubble */}
      <div className="bg-white border border-grey-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
        <div className="flex gap-1">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.6, 
                delay,
                ease: 'easeInOut'
              }}
              className="w-2 h-2 bg-grey-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;

