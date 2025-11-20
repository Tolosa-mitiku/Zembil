import toast from 'react-hot-toast';

/**
 * Wrapped toast.error that filters out Firebase HMR errors
 */
const wrappedError = (message: string, options?: any) => {
  // Check if the message is the Firebase HMR error
  if (
    message.includes('Cannot assign to read only property') ||
    message.includes('read only property') ||
    message.includes("'operations'") ||
    message.includes("'currentUser'") ||
    message.includes("'firebase:authUser") ||
    message.includes('IndexedDBLocalPersistence') ||
    message === 'SUPPRESSED_ERROR'
  ) {
    console.log('⚠️ Suppressed Firebase HMR error toast - this is harmless in development');
    return;
  }

  return toast.error(message, options);
};

/**
 * Wrapped toast object with error filtering
 */
export const safeToast = {
  ...toast,
  error: wrappedError,
};

export default safeToast;

