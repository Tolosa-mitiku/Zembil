import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store';
import ErrorBoundary from './shared/components/ErrorBoundary';
import './index.css';

console.log('=== Zembil App Starting ===');
console.log('Environment:', import.meta.env.MODE);
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

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

