"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

/**
 * Virtual List Component - Only renders visible items
 * Great for large lists (1000+ items)
 */
function VirtualListInner<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, i) => ({
      item,
      index: startIndex + i,
    }));
  }, [items, startIndex, endIndex]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Total height for scroll
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const VirtualList = memo(VirtualListInner) as typeof VirtualListInner;

/**
 * Infinite Scroll Component
 */
interface InfiniteScrollProps {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loader?: React.ReactNode;
  threshold?: number;
  children: React.ReactNode;
}

export function InfiniteScroll({
  loadMore,
  hasMore,
  loader,
  threshold = 100,
  children,
}: InfiniteScrollProps) {
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          await loadMore();
          setLoading(false);
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore, threshold]);

  return (
    <>
      {children}
      <div ref={observerRef} style={{ height: 1 }} />
      {loading && (loader || <div className="text-center py-4 text-gray-400">Loading...</div>)}
    </>
  );
}

/**
 * Lazy Image Component with blur placeholder
 */
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={inView ? src : placeholder}
      alt={alt}
      width={width}
      height={height}
      onLoad={() => setLoaded(true)}
      className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      loading="lazy"
    />
  );
}

/**
 * Skeleton Loader Component
 */
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  width = '100%',
  height = 20,
  className = '',
  variant = 'rectangular',
}: SkeletonProps) {
  const baseClass = 'animate-pulse bg-white/10';
  
  const variantClass = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }[variant];

  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={{ width, height }}
    />
  );
}

/**
 * Skeleton Card for loading states
 */
export function SkeletonCard() {
  return (
    <div className="p-4 rounded-lg border border-white/10 space-y-3">
      <Skeleton width={120} height={16} />
      <Skeleton height={12} />
      <Skeleton height={12} width="80%" />
      <div className="flex space-x-2">
        <Skeleton width={60} height={24} />
        <Skeleton width={60} height={24} />
      </div>
    </div>
  );
}
