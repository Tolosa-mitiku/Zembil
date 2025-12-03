import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scroll
 * Triggers callback when user scrolls near the bottom of the page
 * 
 * @param callback - Function to call when near bottom
 * @param options - Configuration options
 */
export function useInfiniteScroll(
  callback: () => void,
  options: {
    threshold?: number; // Distance from bottom to trigger (in pixels)
    enabled?: boolean; // Whether infinite scroll is enabled
    loading?: boolean; // Whether currently loading
  } = {}
) {
  const {
    threshold = 500,
    enabled = true,
    loading = false,
  } = options;

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && enabled && !loading) {
        callback();
      }
    },
    [callback, enabled, loading]
  );

  useEffect(() => {
    if (!enabled) return;

    observer.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.current.observe(currentSentinel);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleIntersect, enabled, threshold]);

  return sentinelRef;
}

export default useInfiniteScroll;

