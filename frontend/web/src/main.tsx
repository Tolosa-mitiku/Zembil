import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store';
import ErrorBoundary from './shared/components/ErrorBoundary';
import './index.css';
import { disableCachingInDev } from './core/utils/cache-buster';

console.log('=== Zembil App Starting ===');
console.log('Environment:', import.meta.env.MODE);
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Disable caching in development mode
disableCachingInDev();

// Global handler for unhandled promise rejections (catch Firebase HMR errors)
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;
  const errorMessage = error?.message || String(error);
  
  // Suppress Firebase HMR errors
  if (
    errorMessage.includes('Cannot assign to read only property') ||
    errorMessage.includes('read only property') ||
    errorMessage.includes("'operations'") ||
    errorMessage.includes("'currentUser'") ||
    errorMessage.includes("'firebase:authUser") ||
    errorMessage.includes('IndexedDBLocalPersistence') ||
    errorMessage.includes('directlySetCurrentUser')
  ) {
    console.log('⚠️ Suppressed unhandled Firebase HMR error - this is harmless in development');
    event.preventDefault(); // Prevent the error from being logged
    return;
  }
  
  // Let other errors through
  console.error('Unhandled promise rejection:', error);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#D4AF37',
              color: '#fff',
              fontWeight: '500',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#4CAF50',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#E53935',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
);

