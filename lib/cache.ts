// =====================================
// API Cache Middleware
// =====================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class APICache {
  private cache: Map<string, CacheEntry<any>>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Set cache data with TTL
   */
  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Invalidate cache by pattern
   */
  invalidatePattern(pattern: string | RegExp): number {
    let count = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }
}

// Singleton cache instance
export const apiCache = new APICache(200);

/**
 * Cache decorator for API routes
 */
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  const cached = apiCache.get<T>(key);
  
  if (cached !== null) {
    console.log(`📦 Cache HIT: ${key}`);
    return Promise.resolve(cached);
  }
  
  console.log(`🔄 Cache MISS: ${key}`);
  return fetcher().then((data) => {
    apiCache.set(key, data, ttlSeconds);
    return data;
  });
}

/**
 * SWR-like stale-while-revalidate pattern
 */
export async function staleWhileRevalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { staleTime?: number; revalidateTime?: number } = {}
): Promise<T> {
  const { staleTime = 60, revalidateTime = 300 } = options;
  const cached = apiCache.get<T>(key);
  const now = Date.now();

  // Return cached data and revalidate in background
  if (cached !== null) {
    // Check if we should revalidate
    const entry = (apiCache as any).cache.get(key);
    if (entry && now - entry.timestamp > staleTime * 1000) {
      // Revalidate in background
      fetcher().then((data) => {
        apiCache.set(key, data, revalidateTime);
      });
    }
    return cached;
  }

  // No cache, fetch and cache
  const data = await fetcher();
  apiCache.set(key, data, revalidateTime);
  return data;
}

/**
 * Rate limiter for API calls
 */
class RateLimiter {
  private requests: Map<string, number[]>;
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.requests = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    let timestamps = this.requests.get(key) || [];
    timestamps = timestamps.filter((t) => t > windowStart);
    
    if (timestamps.length >= this.maxRequests) {
      return false;
    }
    
    timestamps.push(now);
    this.requests.set(key, timestamps);
    return true;
  }

  /**
   * Get remaining requests
   */
  remaining(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    const timestamps = this.requests.get(key) || [];
    const validTimestamps = timestamps.filter((t) => t > windowStart);
    
    return Math.max(0, this.maxRequests - validTimestamps.length);
  }

  /**
   * Get reset time
   */
  resetTime(key: string): number {
    const timestamps = this.requests.get(key) || [];
    if (timestamps.length === 0) return 0;
    
    return timestamps[0] + this.windowMs;
  }
}

export const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
