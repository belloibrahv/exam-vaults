# Techvaults GCDL Exam System - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, NextAuth, and other dependencies.

### 2. Set Up PostgreSQL Database

Create a new PostgreSQL database for the application:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE techvaults_exam;

# Exit psql
\q
```

### 3. Configure Environment Variables

Copy the example environment file and update it with your settings:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/techvaults_exam?schema=public"

# NextAuth - Generate a secret key
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App Configuration
NODE_ENV="development"
```

**Generate a secure secret for NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

### 4. Set Up Database Schema

Push the Prisma schema to your database:

```bash
npm run db:push
```

This creates all necessary tables (users, questions, exam_attempts, answers).

### 5. Generate Prisma Client

```bash
npm run db:generate
```

### 6. Seed the Database

Populate the database with sample questions and demo users:

```bash
npm run db:seed
```

This creates:
- **Admin account**: admin@techvaults.com / admin123
- **Student account**: student@techvaults.com / student123
- **25+ GCDL practice questions** across all categories

### 7. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the Techvaults landing page
3. Click "Sign In" and use the demo credentials:
   - Email: `student@techvaults.com`
   - Password: `student123`
4. You should be redirected to the dashboard
5. Click "Start Exam" to test the exam interface

## Database Management

### View Database in Prisma Studio

```bash
npm run db:studio
```

This opens a visual database browser at `http://localhost:5555`

### Reset Database (if needed)

```bash
# This will delete all data and recreate tables
npm run db:push -- --force-reset

# Then re-seed
npm run db:seed
```

## Production Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

Ensure these are set in your production environment:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
NODE_ENV="production"
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Check if postgresql is started
   ```

2. Test database connection:
   ```bash
   psql -U postgres -d techvaults_exam
   ```

3. Check your DATABASE_URL in `.env` matches your PostgreSQL credentials

### Port Already in Use

If port 3000 is already in use:

```bash
# Run on a different port
PORT=3001 npm run dev
```

### Prisma Client Issues

If you encounter Prisma client errors:

```bash
# Regenerate Prisma client
npm run db:generate

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Adding More Questions

To add more exam questions, edit `prisma/seed.ts` and add questions following this format:

```typescript
{
  question: 'Your question text here?',
  options: [
    { id: 'a', text: 'Option A' },
    { id: 'b', text: 'Option B' },
    { id: 'c', text: 'Option C' },
    { id: 'd', text: 'Option D' },
  ],
  correctAnswers: ['b'], // Array of correct option IDs
  explanation: 'Explanation of the correct answer',
  category: 'DIGITAL_TRANSFORMATION', // or DATA_AND_AI, INFRASTRUCTURE_MODERNIZATION, SECURITY_AND_OPERATIONS
  difficulty: 'MEDIUM', // EASY, MEDIUM, or HARD
}
```

Then run:

```bash
npm run db:seed
```

## Support

For issues or questions, contact the Techvaults IT team.

---

**Techvaults Limited © 2026** - Internal Use Only
