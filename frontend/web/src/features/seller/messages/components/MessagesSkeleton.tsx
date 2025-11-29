import { motion } from 'framer-motion';

const Shimmer = () => (
  <div className="shimmer-wrapper">
    <div className="shimmer" />
    <style>{`
      .shimmer-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: inherit;
      }
      .shimmer {
        width: 50%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(212, 175, 55, 0.2) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 2s infinite;
        transform: skewX(-20deg);
      }
      @keyframes shimmer {
        0% {
          transform: translateX(-100%) skewX(-20deg);
        }
        100% {
          transform: translateX(200%) skewX(-20deg);
        }
      }
    `}</style>
  </div>
);

const MessagesSkeleton = () => {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-grey-50 via-white to-gold/5">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-grey-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-grey-200 relative overflow-hidden">
              <Shimmer />
            </div>
            <div>
              <div className="h-8 w-48 bg-grey-200 rounded-lg relative overflow-hidden mb-2">
                <Shimmer />
              </div>
              <div className="h-4 w-32 bg-grey-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-32 bg-grey-200 rounded-xl relative overflow-hidden">
              <Shimmer />
            </div>
            <div className="h-10 w-32 bg-grey-200 rounded-xl relative overflow-hidden">
              <Shimmer />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List Skeleton */}
        <div className="w-96 border-r border-grey-200 bg-white flex flex-col">
          {/* Search Skeleton */}
          <div className="p-4 border-b border-grey-200">
            <div className="h-10 bg-grey-200 rounded-xl relative overflow-hidden">
              <Shimmer />
            </div>
          </div>

          {/* Conversation Items Skeleton */}
          <div className="flex-1 overflow-y-auto">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border-b border-grey-100"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar Skeleton */}
                  <div className="w-12 h-12 rounded-full bg-grey-200 relative overflow-hidden flex-shrink-0">
                    <Shimmer />
                  </div>

                  {/* Content Skeleton */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 bg-grey-200 rounded relative overflow-hidden">
                        <Shimmer />
                      </div>
                      <div className="h-3 w-16 bg-grey-200 rounded relative overflow-hidden">
                        <Shimmer />
                      </div>
                    </div>
                    <div className="h-3 w-full bg-grey-200 rounded relative overflow-hidden">
                      <Shimmer />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area Skeleton */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header Skeleton */}
          <div className="px-6 py-4 border-b border-grey-200 bg-gradient-to-r from-white to-gold/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar Skeleton */}
                <div className="w-12 h-12 rounded-full bg-grey-200 relative overflow-hidden">
                  <Shimmer />
                </div>

                {/* Info Skeleton */}
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-grey-200 rounded relative overflow-hidden">
                    <Shimmer />
                  </div>
                  <div className="h-3 w-24 bg-grey-200 rounded relative overflow-hidden">
                    <Shimmer />
                  </div>
                </div>
              </div>

              {/* Actions Skeleton */}
              <div className="w-10 h-10 rounded-lg bg-grey-200 relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
          </div>

          {/* Messages Skeleton */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-grey-50/50 to-white">
            {[...Array(6)].map((_, index) => {
              const isFromSeller = index % 3 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-3 items-end ${isFromSeller ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar Skeleton */}
                  <div className="w-8 h-8 rounded-full bg-grey-200 relative overflow-hidden flex-shrink-0">
                    <Shimmer />
                  </div>

                  {/* Message Bubble Skeleton */}
                  <div className={`space-y-2 ${isFromSeller ? 'max-w-md' : 'max-w-sm'}`}>
                    <div className={`h-16 bg-grey-200 rounded-2xl relative overflow-hidden ${
                      isFromSeller ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}>
                      <Shimmer />
                    </div>
                    <div className={`h-3 w-20 bg-grey-200 rounded relative overflow-hidden ${
                      isFromSeller ? 'ml-auto' : ''
                    }`}>
                      <Shimmer />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Message Input Skeleton */}
          <div className="p-4 border-t border-grey-200 bg-white">
            <div className="flex items-end gap-3">
              {/* Attachment Button Skeleton */}
              <div className="w-10 h-10 rounded-xl bg-grey-200 relative overflow-hidden flex-shrink-0">
                <Shimmer />
              </div>

              {/* Input Skeleton */}
              <div className="flex-1 h-12 bg-grey-200 rounded-2xl relative overflow-hidden">
                <Shimmer />
              </div>

              {/* Send Button Skeleton */}
              <div className="w-12 h-12 rounded-xl bg-grey-200 relative overflow-hidden flex-shrink-0">
                <Shimmer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesSkeleton;

