#!/bin/bash

# =====================================
# CollabSpace Deployment Script
# =====================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print with color
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Check required environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ -z "$JWT_SECRET" ]; then
        print_warning "JWT_SECRET not set. Generating random secret..."
        export JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        print_warning "NEXTAUTH_SECRET not set. Generating random secret..."
        export NEXTAUTH_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    fi
    
    print_success "Environment variables configured"
}

# Build images
build_images() {
    print_status "Building Docker images..."
    
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    print_success "Docker images built successfully"
}

# Deploy services
deploy() {
    print_status "Starting deployment..."
    
    # Pull latest changes
    git pull origin main
    
    # Build and start containers
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    sleep 10
    
    # Check health
    docker-compose -f docker-compose.prod.yml ps
    
    print_success "Deployment completed successfully!"
}

# Stop services
stop() {
    print_status "Stopping services..."
    docker-compose -f docker-compose.prod.yml down
    print_success "Services stopped"
}

# View logs
logs() {
    docker-compose -f docker-compose.prod.yml logs -f
}

# Restart services
restart() {
    print_status "Restarting services..."
    docker-compose -f docker-compose.prod.yml restart
    print_success "Services restarted"
}

# Cleanup
cleanup() {
    print_status "Cleaning up unused Docker resources..."
    docker system prune -af
    docker volume prune -f
    print_success "Cleanup completed"
}

# Backup database
backup() {
    print_status "Backing up database..."
    
    BACKUP_DIR="./backups"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    mkdir -p $BACKUP_DIR
    
    docker exec collabspace-mongo mongodump --archive="/tmp/backup_$TIMESTAMP.gz" --gzip
    docker cp collabspace-mongo:/tmp/backup_$TIMESTAMP.gz $BACKUP_DIR/
    
    print_success "Backup saved to $BACKUP_DIR/backup_$TIMESTAMP.gz"
}

# Restore database
restore() {
    if [ -z "$1" ]; then
        print_error "Please provide backup file path"
        exit 1
    fi
    
    print_status "Restoring database from $1..."
    
    docker cp $1 collabspace-mongo:/tmp/restore.gz
    docker exec collabspace-mongo mongorestore --archive="/tmp/restore.gz" --gzip --drop
    
    print_success "Database restored successfully"
}

# Show usage
usage() {
    echo "CollabSpace Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  deploy   - Deploy all services"
    echo "  stop     - Stop all services"
    echo "  restart  - Restart all services"
    echo "  logs     - View service logs"
    echo "  build    - Build Docker images"
    echo "  cleanup  - Remove unused Docker resources"
    echo "  backup   - Backup MongoDB database"
    echo "  restore  - Restore MongoDB from backup"
    echo "  help     - Show this help message"
}

# Main
case "$1" in
    deploy)
        check_docker
        check_env
        deploy
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    build)
        check_docker
        build_images
        ;;
    cleanup)
        cleanup
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        print_error "Unknown command: $1"
        usage
        exit 1
        ;;
esac
