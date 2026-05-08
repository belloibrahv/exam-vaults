# Deployment Guide - Techvaults GCDL Exam System

This guide covers deploying the Techvaults GCDL Exam System to production.

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

Vercel is the easiest way to deploy Next.js applications.

#### Prerequisites
- Vercel account ([Sign up](https://vercel.com/signup))
- PostgreSQL database (Neon, Supabase, or Railway)

#### Steps

1. **Prepare Database**
   ```bash
   # Use a managed PostgreSQL service like:
   # - Neon (https://neon.tech) - Free tier available
   # - Supabase (https://supabase.com) - Free tier available
   # - Railway (https://railway.app) - Free tier available
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Set Environment Variables**
   
   In Vercel Dashboard → Project Settings → Environment Variables:
   ```
   DATABASE_URL=your-production-database-url
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-production-secret
   NODE_ENV=production
   ```

6. **Run Database Migrations**
   ```bash
   # After deployment, run migrations
   npx prisma db push
   npx prisma db seed
   ```

### Option 2: Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: techvaults_exam
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:your_password@postgres:5432/techvaults_exam?schema=public
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: your-secret-key
      NODE_ENV: production
    depends_on:
      - postgres

volumes:
  postgres_data:
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

### Option 3: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### Prerequisites
- Ubuntu 22.04 LTS server
- Domain name (optional)
- SSL certificate (Let's Encrypt)

#### Setup Steps

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PostgreSQL**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Create Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE techvaults_exam;
   CREATE USER techvaults WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE techvaults_exam TO techvaults;
   \q
   ```

4. **Clone and Setup Application**
   ```bash
   cd /var/www
   git clone <your-repo-url> techvaults-exam
   cd techvaults-exam
   npm install
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env
   # Update with production values
   ```

6. **Build Application**
   ```bash
   npm run build
   npx prisma db push
   npx prisma db seed
   ```

7. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "techvaults-exam" -- start
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/techvaults-exam
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/techvaults-exam /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Environment Variables for Production

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth
NEXTAUTH_URL="https://your-production-domain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# App
NODE_ENV="production"
```

## Post-Deployment Checklist

- [ ] Database is accessible and migrations are applied
- [ ] Environment variables are set correctly
- [ ] SSL certificate is installed and working
- [ ] Application is running and accessible
- [ ] Demo accounts work (test login)
- [ ] Exam functionality works end-to-end
- [ ] Database backups are configured
- [ ] Monitoring is set up (optional)
- [ ] Error logging is configured (optional)

## Database Backups

### Automated Backup Script

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/var/backups/techvaults-exam"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_$DATE.sql"

mkdir -p $BACKUP_DIR

pg_dump -U techvaults techvaults_exam > $BACKUP_DIR/$FILENAME

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: $FILENAME"
```

### Setup Cron Job

```bash
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * /path/to/backup-db.sh
```

## Monitoring (Optional)

### Using PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health Check Endpoint

Add to `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: 'Database connection failed' }, { status: 500 });
  }
}
```

## Scaling Considerations

### Database Connection Pooling

Update `lib/prisma.ts`:

```typescript
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Connection pool settings
prisma.$connect();
```

### Load Balancing

For high traffic, consider:
- Multiple application instances behind a load balancer
- Database read replicas
- CDN for static assets
- Redis for session storage

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs techvaults-exam

# Check environment variables
pm2 env 0

# Restart application
pm2 restart techvaults-exam
```

### Database Connection Issues

```bash
# Test database connection
psql -U techvaults -d techvaults_exam -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## Security Best Practices

1. **Use strong passwords** for database and admin accounts
2. **Enable firewall** and only allow necessary ports
3. **Keep system updated** with security patches
4. **Use environment variables** for sensitive data
5. **Enable HTTPS** for all traffic
6. **Regular backups** of database
7. **Monitor logs** for suspicious activity
8. **Rate limiting** on API endpoints (optional)

## Support

For deployment issues, contact Techvaults DevOps team.

---

**Techvaults Limited © 2026**
