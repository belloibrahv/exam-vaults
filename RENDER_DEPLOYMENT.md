# 🚀 Deploy to Render - Step by Step Guide

## Prerequisites
✅ Code pushed to GitHub: https://github.com/belloibrahv/exam-vaults.git  
✅ Neon PostgreSQL database ready  
✅ Render account (free tier available)

---

## Step 1: Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended) or email

---

## Step 2: Create New Web Service

1. **Click "New +"** in the top right
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Find and select **"exam-vaults"** repository

---

## Step 3: Configure Web Service

### Basic Settings
- **Name**: `techvaults-exam-system` (or your preferred name)
- **Region**: Choose closest to your users (e.g., Oregon, Ohio)
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: `Node`

### Build & Deploy Settings
- **Build Command**: 
  ```bash
  npm install && npx prisma generate && npm run build
  ```

- **Start Command**:
  ```bash
  npm start
  ```

---

## Step 4: Set Environment Variables

Click **"Advanced"** and add these environment variables:

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_kJe0qIf5VrpT@ep-empty-math-aqlcqdfm-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. NEXTAUTH_URL
```
https://techvaults-exam-system.onrender.com
```
*(Replace with your actual Render URL after deployment)*

### 3. NEXTAUTH_SECRET
Generate a secure secret:
```bash
openssl rand -base64 32
```
Or use this one:
```
8xK9mP2nQ5rT7vW1yZ3bC6dF8gH0jL4mN6pR9sU2wX5zA7cE9fH1kM3nP6qS8tV0
```

### 4. NODE_ENV
```
production
```

---

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Watch the build logs for any errors

---

## Step 6: Seed the Database

After successful deployment, you need to seed the database with questions:

### Option 1: Using Render Shell (Recommended)

1. Go to your service dashboard
2. Click **"Shell"** tab
3. Run:
   ```bash
   npm run db:push
   npm run db:seed
   ```

### Option 2: Using Local Connection

1. Update your local `.env` with production DATABASE_URL
2. Run locally:
   ```bash
   npm run db:push
   npm run db:seed
   ```

---

## Step 7: Update NEXTAUTH_URL

1. Copy your Render URL (e.g., `https://techvaults-exam-system.onrender.com`)
2. Go to **Environment** tab in Render
3. Update **NEXTAUTH_URL** with your actual URL
4. Click **"Save Changes"**
5. Service will automatically redeploy

---

## Step 8: Test Your Deployment

1. Visit your Render URL
2. Sign in with demo account:
   - Email: `student@techvaults.com`
   - Password: `student123`
3. Take a practice exam
4. Verify everything works

---

## 🎉 Deployment Complete!

Your Techvaults GCDL Exam System is now live at:
**https://techvaults-exam-system.onrender.com**

---

## Important Notes

### Free Tier Limitations
- ⚠️ Service spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ⚠️ 750 hours/month free (enough for one service)

### Upgrade to Paid Plan ($7/month)
- ✅ No spin-down
- ✅ Faster performance
- ✅ Custom domain support
- ✅ More resources

---

## Troubleshooting

### Build Fails
**Error**: `Module not found`
**Solution**: Ensure all dependencies are in `package.json`

### Database Connection Error
**Error**: `Can't reach database server`
**Solution**: 
1. Verify DATABASE_URL is correct
2. Check Neon database is active
3. Ensure `sslmode=require` is in connection string

### NextAuth Error
**Error**: `[next-auth][error][NO_SECRET]`
**Solution**: 
1. Verify NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL matches your Render URL

### Prisma Client Error
**Error**: `@prisma/client did not initialize yet`
**Solution**: 
1. Ensure build command includes `npx prisma generate`
2. Redeploy the service

---

## Monitoring & Logs

### View Logs
1. Go to your service dashboard
2. Click **"Logs"** tab
3. Monitor real-time logs

### View Metrics
1. Click **"Metrics"** tab
2. See CPU, memory, and request metrics

---

## Custom Domain (Optional)

### Add Custom Domain
1. Go to **"Settings"** tab
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Follow DNS configuration instructions

---

## Continuous Deployment

✅ **Auto-deploy is enabled!**

Every time you push to `main` branch:
1. Render automatically detects changes
2. Builds and deploys new version
3. Zero-downtime deployment

To deploy manually:
1. Go to service dashboard
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**

---

## Database Backups

### Neon Database Backups
1. Go to Neon dashboard
2. Navigate to your project
3. Click **"Backups"** tab
4. Configure automatic backups

### Manual Backup
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

---

## Performance Optimization

### Enable Caching
Already configured in Next.js

### Optimize Images
Already using Next.js Image component

### Database Connection Pooling
Already configured with Neon pooler

---

## Security Checklist

- [x] Environment variables are secure
- [x] Database uses SSL
- [x] Passwords are hashed (bcrypt)
- [x] HTTPS enabled (automatic on Render)
- [x] NEXTAUTH_SECRET is strong
- [ ] Set up monitoring alerts
- [ ] Configure rate limiting (optional)

---

## Support

### Render Support
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### Project Support
- Check documentation files
- Review error logs
- Contact Techvaults IT team

---

## Next Steps

1. ✅ Test all features thoroughly
2. ✅ Add more questions (target: 500+)
3. ✅ Share with Techvaults engineers
4. ✅ Gather feedback
5. ✅ Monitor usage and performance
6. ✅ Consider upgrading to paid plan

---

**Your exam system is now live and ready for Techvaults engineers! 🎉**
