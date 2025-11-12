import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

const AutoSaveIndicator = ({
  status,
  lastSaved,
  error,
  onRetry,
  className,
}: AutoSaveIndicatorProps) => {
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return lastSaved.toLocaleDateString();
  };

  return (
    <AnimatePresence mode="wait">
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={clsx('flex items-center gap-2', className)}
        >
          {status === 'saving' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <ArrowPathIcon className="w-5 h-5 text-gold" />
              </motion.div>
              <span className="text-sm font-medium text-grey-700">Saving...</span>
            </>
          )}

          {status === 'saved' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-green-600">All changes saved</span>
                {lastSaved && (
                  <span className="text-xs text-grey-500 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {formatLastSaved()}
                  </span>
                )}
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <motion.div
                animate={{ x: [-2, 2, -2, 2, 0] }}
                transition={{ duration: 0.4 }}
              >
                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
              </motion.div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-red-600">Failed to save</span>
                  {error && <span className="text-xs text-grey-500">{error}</span>}
                </div>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoSaveIndicator;

