/**
 * Firebase Error Handler Utility
 * 
 * This utility helps suppress the known Firebase HMR (Hot Module Replacement) error:
 * "Cannot assign to read only property 'operations' of object '#<AuthImpl>'"
 * 
 * This error occurs in development when using Firebase with Vite's HMR and doesn't
 * affect functionality, but it's confusing to users.
 */

/**
 * Checks if an error is the known Firebase HMR error that should be suppressed
 */
export const isFirebaseHMRError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = error.message || String(error);
  
  return (
    errorMessage.includes('Cannot assign to read only property') ||
    errorMessage.includes('read only property') ||
    errorMessage.includes("'operations'")
  );
};

/**
 * Wraps a Firebase operation and suppresses HMR errors
 */
export const suppressFirebaseHMRError = async <T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    if (isFirebaseHMRError(error)) {
      console.log('⚠️ Suppressed Firebase HMR error - this is harmless in development');
      throw new Error('SUPPRESSED_FIREBASE_HMR_ERROR');
    }
    throw error;
  }
};

/**
 * Filters out Firebase HMR errors from a list of errors
 */
export const filterFirebaseHMRErrors = (errors: any[]): any[] => {
  return errors.filter(error => !isFirebaseHMRError(error));
};

export default {
  isFirebaseHMRError,
  suppressFirebaseHMRError,
  filterFirebaseHMRErrors,
};

