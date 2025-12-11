# Docker Setup Guide

## Prerequisites
- Docker installed on your system
- Docker Compose installed

## Quick Start

### 1. Build and run with Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 2. Stop the container

```bash
docker-compose down
```

### 3. View logs

```bash
docker-compose logs -f app
```

## Alternative: Using Docker directly

### Build the image

```bash
docker build -t sq-product-admin-server .
```

### Run the container

```bash
docker run -p 3000:3000 \
  -e MONGODB_URI="your_mongodb_connection_string" \
  -v $(pwd)/uploads:/app/uploads \
  sq-product-admin-server
```

## Environment Variables

You can customize environment variables in `docker-compose.yml`:

- `NODE_ENV`: Environment mode (production/development)
- `PORT`: Application port (default: 3000)
- `MONGODB_URI`: MongoDB connection string

## Volumes

The `uploads` directory is mounted as a volume to persist uploaded files between container restarts.

## Accessing the Application

Once running, the API will be available at:
- http://localhost:3000

## Useful Commands

```bash
# Rebuild without cache
docker-compose build --no-cache

# View running containers
docker ps

# Stop and remove containers, networks
docker-compose down

# Remove volumes as well
docker-compose down -v

# Execute commands inside the container
docker-compose exec app sh
```

## Production Deployment

For production, consider:
1. Using environment variables from a secure source
2. Setting up proper logging
3. Using a reverse proxy (nginx)
4. Implementing health checks
5. Using Docker secrets for sensitive data
