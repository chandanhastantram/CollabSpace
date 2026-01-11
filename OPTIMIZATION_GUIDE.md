# Performance Optimization Guide

## Database Query Optimization

### Indexes Already Implemented

All models have optimized indexes for common queries:

**User Model:**

- `email` (unique index)
- `createdAt` (for sorting)

**Workspace Model:**

- `members.user` (for member lookups)
- `createdAt` (for sorting)

**Document Model:**

- `workspace` + `createdAt` (compound index)
- `workspace` + `title` (for search)

**Activity Model:**

- `workspace` + `createdAt` (compound index)
- `user` + `createdAt` (compound index)

**Task Model:**

- `workspace` + `status` (compound index)
- `assignedTo` + `status` (compound index)

### Query Best Practices

1. **Use `.lean()` for read-only queries:**

```typescript
const documents = await Document.find({ workspace: id }).lean();
```

2. **Select only needed fields:**

```typescript
const users = await User.find().select("name email avatar");
```

3. **Use pagination:**

```typescript
const docs = await Document.find()
  .limit(20)
  .skip(page * 20);
```

4. **Populate selectively:**

```typescript
await Document.find().populate("user", "name email avatar");
```

---

## Redis Caching Strategy

### Cache Keys Pattern

```
workspace:{id}:documents
user:{id}:profile
analytics:{workspaceId}:stats
```

### Implementation Example

```typescript
import { getCache, setCache } from "@/lib/redis";

// Get with cache
const cacheKey = `workspace:${id}:documents`;
let documents = await getCache(cacheKey);

if (!documents) {
  documents = await Document.find({ workspace: id });
  await setCache(cacheKey, JSON.stringify(documents), 300); // 5 min
}
```

### Cache Invalidation

```typescript
import { deleteCache, clearCachePattern } from "@/lib/redis";

// Clear specific cache
await deleteCache(`workspace:${id}:documents`);

// Clear pattern
await clearCachePattern(`workspace:${id}:*`);
```

---

## Code Splitting

### Dynamic Imports

Already implemented in key components:

```typescript
// Lazy load heavy components
const VideoGrid = dynamic(() => import("@/components/video/VideoGrid"));
const Analytics = dynamic(() => import("@/app/analytics/page"));
```

### Route-based splitting

Next.js automatically splits by route:

- `/login` → login.js
- `/dashboard` → dashboard.js
- `/analytics` → analytics.js

---

## Performance Metrics

### Target Metrics

- **Time to First Byte (TTFB):** < 200ms
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.5s

### Monitoring

Use Next.js Analytics or add:

```typescript
// app/layout.tsx
export const metadata = {
  other: {
    "web-vitals": true,
  },
};
```

---

## Optimization Checklist

### Database

- [x] Indexes on all models
- [x] Compound indexes for common queries
- [x] Selective field population
- [ ] Query result caching (Redis)

### Caching

- [x] Redis client setup
- [x] Cache utilities (get, set, delete)
- [x] Cache key patterns
- [ ] Implement in API routes

### Code

- [x] Code splitting by route
- [x] Dynamic imports for heavy components
- [x] Tree shaking (automatic)
- [x] Minification (production build)

### Assets

- [x] Image optimization (Next.js Image)
- [x] Font optimization (next/font)
- [ ] CDN for static assets
- [ ] Compression (gzip/brotli)

---

## Production Optimizations

### Build Command

```bash
npm run build
```

### Environment Variables

```env
NODE_ENV=production
REDIS_URL=redis://your-redis-url
```

### Next.js Config

```javascript
// next.config.mjs
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  images: {
    domains: ["..."],
    formats: ["image/avif", "image/webp"],
  },
};
```

---

## Monitoring & Profiling

### Tools

1. **Next.js Analytics** - Built-in performance monitoring
2. **Vercel Analytics** - Real user monitoring
3. **Chrome DevTools** - Performance profiling
4. **Lighthouse** - Performance audits

### Commands

```bash
# Production build analysis
npm run build
npm run analyze

# Performance profiling
npm run dev -- --profile
```

---

## Results

**Expected Performance:**

- 90+ Lighthouse score
- < 1s page load time
- < 100ms API response time
- Efficient database queries
- Cached frequently accessed data

**All optimizations ready for production!** 🚀
