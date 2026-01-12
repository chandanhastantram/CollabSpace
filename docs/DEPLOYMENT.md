# CollabSpace Deployment Guide

Complete guide for deploying CollabSpace to production.

## Table of Contents

1. [Quick Deploy to Vercel](#quick-deploy-to-vercel)
2. [Docker Deployment](#docker-deployment)
3. [AWS Deployment](#aws-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [SSL Configuration](#ssl-configuration)
7. [Monitoring & Logging](#monitoring--logging)

---

## Quick Deploy to Vercel

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)

### Steps

1. **Fork/Clone the repository**

   ```bash
   git clone https://github.com/chandanhastantram/CollabSpace.git
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**

   In Vercel dashboard, add these environment variables:

   | Variable                 | Description                 |
   | ------------------------ | --------------------------- |
   | `MONGODB_URI`            | MongoDB connection string   |
   | `JWT_SECRET`             | Random 64+ character string |
   | `NEXTAUTH_SECRET`        | Random 32+ character string |
   | `NEXT_PUBLIC_APP_URL`    | Your Vercel deployment URL  |
   | `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL        |

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

### Generate Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 64

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

---

## Docker Deployment

### Prerequisites

- Docker & Docker Compose installed
- Server with 2GB+ RAM
- Domain name (optional)

### Quick Start

1. **Clone and configure**

   ```bash
   git clone https://github.com/chandanhastantram/CollabSpace.git
   cd CollabSpace
   cp .env.production.example .env
   # Edit .env with your values
   ```

2. **Deploy with Docker Compose**

   ```bash
   # Make deploy script executable
   chmod +x scripts/deploy.sh

   # Deploy
   ./scripts/deploy.sh deploy
   ```

3. **Check status**

   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

4. **View logs**
   ```bash
   ./scripts/deploy.sh logs
   ```

### Available Commands

```bash
./scripts/deploy.sh deploy   # Deploy all services
./scripts/deploy.sh stop     # Stop all services
./scripts/deploy.sh restart  # Restart all services
./scripts/deploy.sh logs     # View logs
./scripts/deploy.sh backup   # Backup database
./scripts/deploy.sh cleanup  # Remove unused resources
```

### Manual Docker Commands

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

---

## AWS Deployment

### Architecture

```
                    ┌─────────────┐
                    │  CloudFront │
                    │    (CDN)    │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │     ALB     │
                    │ (Load Bal.) │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐    ┌─────┴─────┐    ┌─────┴─────┐
    │   EC2-1   │    │   EC2-2   │    │   EC2-3   │
    │  Next.js  │    │  Next.js  │    │ Socket.io │
    └───────────┘    └───────────┘    └───────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                                 │
    ┌─────┴─────┐                    ┌─────┴─────┐
    │  MongoDB  │                    │   Redis   │
    │  Atlas    │                    │ElastiCache│
    └───────────┘                    └───────────┘
```

### AWS Services Used

- **EC2** - Application servers
- **ALB** - Application Load Balancer
- **CloudFront** - CDN for static assets
- **ElastiCache** - Redis for sessions
- **MongoDB Atlas** - Managed database
- **S3** - File storage
- **Route 53** - DNS management
- **ACM** - SSL certificates

### Deployment Steps

1. **Create MongoDB Atlas Cluster**

   - Go to [cloud.mongodb.com](https://cloud.mongodb.com)
   - Create free M0 cluster
   - Whitelist your EC2 IP addresses
   - Get connection string

2. **Create ElastiCache Redis**

   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id collabspace-redis \
     --engine redis \
     --cache-node-type cache.t3.micro \
     --num-cache-nodes 1
   ```

3. **Launch EC2 Instances**

   ```bash
   # Use Amazon Linux 2 AMI
   # Install Docker
   sudo yum update -y
   sudo yum install docker -y
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```

4. **Deploy Application**

   ```bash
   # SSH into EC2
   git clone https://github.com/chandanhastantram/CollabSpace.git
   cd CollabSpace
   ./scripts/deploy.sh deploy
   ```

5. **Configure ALB**
   - Create target groups for port 3000 and 3002
   - Create ALB with HTTPS listener
   - Add SSL certificate from ACM

---

## Environment Variables

### Required Variables

| Variable              | Description                    | Example                                                   |
| --------------------- | ------------------------------ | --------------------------------------------------------- |
| `MONGODB_URI`         | MongoDB connection string      | `mongodb+srv://user:pass@cluster.mongodb.net/collabspace` |
| `JWT_SECRET`          | JWT signing secret (64+ chars) | Auto-generate                                             |
| `NEXTAUTH_SECRET`     | NextAuth secret (32+ chars)    | Auto-generate                                             |
| `NEXT_PUBLIC_APP_URL` | Public app URL                 | `https://collabspace.com`                                 |

### Optional Variables

| Variable                 | Description          | Default                  |
| ------------------------ | -------------------- | ------------------------ |
| `REDIS_URL`              | Redis connection URL | `redis://localhost:6379` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL | `http://localhost:3002`  |
| `SOCKET_PORT`            | Socket server port   | `3002`                   |

### OAuth (Optional)

| Variable               | Description            |
| ---------------------- | ---------------------- |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret    |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret    |

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create new cluster (M0 Free Tier is fine)
3. Create database user with read/write access
4. Whitelist IP addresses (or allow from anywhere for Vercel)
5. Get connection string and add to environment

### Self-Hosted MongoDB

```yaml
# In docker-compose.prod.yml
mongo:
  image: mongo:7
  environment:
    - MONGO_INITDB_ROOT_USERNAME=admin
    - MONGO_INITDB_ROOT_PASSWORD=your-secure-password
  volumes:
    - mongo-data:/data/db
```

---

## SSL Configuration

### Using Let's Encrypt (Recommended)

1. **Install Certbot**

   ```bash
   sudo apt install certbot
   ```

2. **Generate Certificate**

   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. **Copy to Docker**

   ```bash
   cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/ssl/
   cp /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/ssl/
   ```

4. **Auto-Renewal**
   ```bash
   # Add to crontab
   0 0 1 * * certbot renew --quiet
   ```

### Using CloudFlare

1. Add site to CloudFlare
2. Set SSL mode to "Full (Strict)"
3. CloudFlare handles SSL automatically

---

## Monitoring & Logging

### Health Checks

```bash
# Application health
curl https://yourdomain.com/api/health

# Docker container health
docker inspect --format='{{.State.Health.Status}}' collabspace-app
```

### Logging

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# View specific service
docker-compose -f docker-compose.prod.yml logs app

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f
```

### Recommended Tools

- **Sentry** - Error tracking
- **Datadog** - APM & monitoring
- **Uptime Robot** - Uptime monitoring
- **LogDNA** - Log management

---

## Troubleshooting

### Common Issues

**Build fails on Vercel**

- Check environment variables are set
- Ensure MongoDB URI is accessible from Vercel

**Socket.io not connecting**

- Check CORS settings
- Verify NEXT_PUBLIC_SOCKET_URL is correct
- Ensure WebSocket connections are allowed

**Database connection failed**

- Check MONGODB_URI is correct
- Whitelist IP addresses in MongoDB Atlas
- Check network connectivity

### Getting Help

- Open an issue on [GitHub](https://github.com/chandanhastantram/CollabSpace/issues)
- Check [Next.js docs](https://nextjs.org/docs/deployment)
- Check [Vercel docs](https://vercel.com/docs)

---

## Security Checklist

- [ ] Strong JWT_SECRET (64+ characters)
- [ ] HTTPS enabled in production
- [ ] MongoDB user with minimal permissions
- [ ] Environment variables not committed to git
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Regular dependency updates
