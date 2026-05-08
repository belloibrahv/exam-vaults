# 🚀 Quick Start Guide - Techvaults GCDL Exam System

Get up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **PostgreSQL 14+** installed ([Download](https://www.postgresql.org/download/))
- ✅ **Terminal/Command Line** access

## Option 1: Automated Setup (Recommended)

### Step 1: Run Setup Script

```bash
cd exam-vaults
./scripts/setup.sh
```

The script will:
1. Install all dependencies
2. Create environment file
3. Set up database schema
4. Seed sample data
5. Generate Prisma client

### Step 2: Update Database Credentials

Edit `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/techvaults_exam?schema=public"
```

### Step 3: Start the Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## Option 2: Manual Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Generate secret key
openssl rand -base64 32

# Edit .env and paste the secret
nano .env
```

Update `.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/techvaults_exam?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-generated-secret-here"
NODE_ENV="development"
```

### Step 3: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE techvaults_exam;

# Exit
\q
```

### Step 4: Setup Database Schema

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with sample data
npm run db:seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎓 Demo Accounts

Use these credentials to test the system:

### Student Account
```
Email: student@techvaults.com
Password: student123
```

### Admin Account
```
Email: admin@techvaults.com
Password: admin123
```

---

## 🧪 Test the System

### 1. Sign In
- Go to http://localhost:3000
- Click "Sign In"
- Use student credentials above

### 2. View Dashboard
- See your statistics (0 attempts initially)
- Check the "Start Practice Exam" section

### 3. Take an Exam
- Click "Start Exam"
- Confirm you're ready
- Answer questions (55 questions, 90 minutes)
- Use the question navigator
- Flag questions for review
- Submit when done

### 4. View Results
- See your score and pass/fail status
- Review category breakdown
- Expand questions to see explanations
- Check correct/incorrect answers

### 5. Test Cooldown (Optional)
- If you scored below 70%, try starting another exam
- You should see a 2-hour cooldown message

---

## 📁 Project Structure Overview

```
exam-vaults/
├── app/              # Next.js pages and API routes
├── components/       # Reusable React components
├── lib/             # Utilities and configurations
├── prisma/          # Database schema and seeds
├── scripts/         # Automation scripts
└── types/           # TypeScript type definitions
```

---

## 🛠️ Useful Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with data
npm run db:studio    # Open Prisma Studio (GUI)
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
PORT=3001 npm run dev
```

### Database Connection Error

1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Start if needed
   brew services start postgresql
   ```

2. Verify credentials in `.env`

3. Test connection:
   ```bash
   psql -U postgres -d techvaults_exam
   ```

### Prisma Client Error

```bash
# Regenerate Prisma client
npm run db:generate

# If still failing, reinstall
rm -rf node_modules
npm install
```

### "Module not found" Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Restart dev server
npm run dev
```

---

## 📚 Next Steps

1. **Read Full Documentation**
   - `README.md` - Overview and features
   - `SETUP.md` - Detailed setup instructions
   - `FEATURES.md` - Complete feature list
   - `DEPLOYMENT.md` - Production deployment

2. **Customize Questions**
   - Edit `prisma/seed.ts`
   - Add your own GCDL questions
   - Run `npm run db:seed`

3. **Customize Branding**
   - Update `components/TechvaultsLogo.tsx`
   - Modify colors in `tailwind.config.ts`
   - Edit text in page components

4. **Deploy to Production**
   - See `DEPLOYMENT.md` for options
   - Recommended: Vercel for easy deployment

---

## 🎯 System Requirements

### Minimum
- Node.js 18+
- PostgreSQL 14+
- 512MB RAM
- 1GB disk space

### Recommended
- Node.js 20+
- PostgreSQL 15+
- 2GB RAM
- 5GB disk space

---

## 📞 Need Help?

1. Check documentation files
2. Review error messages carefully
3. Search for similar issues online
4. Contact Techvaults IT team

---

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Database created and connected
- [ ] Environment variables configured
- [ ] Database schema pushed
- [ ] Sample data seeded
- [ ] Development server running
- [ ] Can access http://localhost:3000
- [ ] Can sign in with demo account
- [ ] Can start and complete an exam
- [ ] Can view results

---

## 🎉 You're All Set!

The Techvaults GCDL Exam System is now running. Start practicing and good luck with your certification!

**Remember**: This is a practice system. The actual GCDL exam will be administered by Google Cloud.

---

**Techvaults Limited © 2026** - Built with ❤️ for our engineers
