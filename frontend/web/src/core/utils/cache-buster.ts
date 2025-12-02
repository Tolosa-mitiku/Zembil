// This file helps prevent aggressive caching by the browser
// Import this at the top of your main.tsx if needed

/**
 * Clears all browser caches including:
 * - Service Workers
 * - Cache Storage
 * - IndexedDB (optional)
 */
export async function clearAllCaches() {
  try {
    // Clear Cache Storage API
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✅ Cache Storage cleared');
    }

    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      console.log('✅ Service Workers unregistered');
    }
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
}

/**
 * Disables all forms of caching in development
 * Call this in main.tsx for development builds
 */
export function disableCachingInDev() {
  if (import.meta.env.DEV) {
    // Prevent browser from caching XHR requests
    if (typeof window !== 'undefined') {
      // Override fetch to add no-cache headers (only for static resources, not API calls)
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const [resource, config] = args;
        
        // Skip cache-busting for API calls (they handle their own caching)
        const url = typeof resource === 'string' ? resource : resource.url;
        if (url.includes('/api/')) {
          return originalFetch(resource, config);
        }
        
        return originalFetch(resource, {
          ...config,
          cache: 'no-store',
          headers: {
            ...config?.headers,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
      };

      console.log('🚫 Cache disabled for development (excluding API calls)');
    }
  }
}

/**
 * Forces a hard reload by clearing all caches and reloading
 */
export async function forceHardReload() {
  await clearAllCaches();
  window.location.reload();
}

// For debugging: Log when resources are loaded from cache
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource');
      const cachedResources = resources.filter(
        (resource: any) => resource.transferSize === 0
      );
      
      if (cachedResources.length > 0) {
        console.warn(
          '⚠️ Some resources loaded from cache:',
          cachedResources.map((r: any) => r.name)
        );
      }
    }
  });
}





