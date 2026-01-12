// =====================================
// Performance Utilities
// =====================================

/**
 * Debounce function - delays execution until after wait ms have elapsed
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Throttle function - limits execution to once per wait ms
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      func.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Memoize function - caches results based on arguments
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  options: { maxSize?: number; ttl?: number } = {}
): T {
  const { maxSize = 100, ttl = 5 * 60 * 1000 } = options; // 5 minutes default TTL
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < ttl) {
      return cached.value;
    }

    const result = func.apply(this, args);

    // Evict oldest entries if cache is full
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    cache.set(key, { value: result, timestamp: now });
    return result;
  } as T;
}

/**
 * Request Animation Frame throttle - smooth animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, lastArgs!);
        rafId = null;
      });
    }
  };
}

/**
 * Lazy load images with Intersection Observer
 */
export function createImageObserver(
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
      }
    });
  }, defaultOptions);
}

/**
 * Chunk array for batch processing
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Process items in batches to avoid blocking UI
 */
export async function processBatches<T, R>(
  items: T[],
  processor: (item: T) => R | Promise<R>,
  options: { batchSize?: number; delay?: number } = {}
): Promise<R[]> {
  const { batchSize = 10, delay = 0 } = options;
  const chunks = chunkArray(items, batchSize);
  const results: R[] = [];

  for (const chunk of chunks) {
    const batchResults = await Promise.all(chunk.map(processor));
    results.push(...batchResults);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return results;
}

/**
 * Measure function execution time
 */
export async function measureAsync<T>(
  name: string,
  func: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await func();
    const duration = performance.now() - start;
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.log(`⏱️ ${name} (failed): ${duration.toFixed(2)}ms`);
    throw error;
  }
}

/**
 * Idle callback for non-critical tasks
 */
export function scheduleIdleTask(
  callback: () => void,
  options: { timeout?: number } = {}
): number {
  const { timeout = 2000 } = options;

  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  }

  return window.setTimeout(callback, 1) as unknown as number;
}

/**
 * Cancel idle task
 */
export function cancelIdleTask(id: number): void {
  if ('cancelIdleCallback' in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}
