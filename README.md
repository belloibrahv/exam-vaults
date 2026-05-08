# 🎓 Techvaults GCDL Exam Preparation System

A professional exam preparation platform for Google Cloud Digital Leader (GCDL) certification, built for Techvaults Limited engineers.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/belloibrahv/exam-vaults.git
   cd exam-vaults
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up database**
   ```bash
   npm run db:push
   npm run db:generate
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

## 🎮 Demo Accounts

**Student Account**
- Email: `student@techvaults.com`
- Password: `student123`

**Admin Account**
- Email: `admin@techvaults.com`
- Password: `admin123`

## ✨ Features

- ✅ Realistic 90-minute timed exams
- ✅ 50-60 questions per exam
- ✅ Multiple choice and multiple select questions
- ✅ Instant scoring with 70% passing threshold
- ✅ Detailed explanations for all questions
- ✅ Category-wise performance breakdown
- ✅ 2-hour cooldown after failed attempts
- ✅ Fully responsive design
- ✅ Techvaults branding

## 📊 Exam Format

Based on official Google Cloud Digital Leader certification:

- **Questions**: 50-60 per exam
- **Duration**: 90 minutes
- **Passing Score**: 70%
- **Categories**: 
  - Digital Transformation (25%)
  - Data & AI/ML (25%)
  - Infrastructure Modernization (25%)
  - Security & Operations (25%)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Render (or Vercel)

## 📁 Project Structure

```
exam-vaults/
├── app/              # Next.js pages and API routes
├── components/       # React components
├── lib/             # Utilities and configurations
├── prisma/          # Database schema and seed
├── types/           # TypeScript types
└── README.md        # This file
```

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Configure environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NODE_ENV=production`
5. Deploy and seed database

### Environment Variables

```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NODE_ENV="development"
```

## 📝 Adding More Questions

Edit `prisma/seed.ts` and add questions using this format:

```typescript
{
  question: 'Your question text?',
  options: [
    { id: 'a', text: 'Option A' },
    { id: 'b', text: 'Option B' },
    { id: 'c', text: 'Option C' },
    { id: 'd', text: 'Option D' },
  ],
  correctAnswers: ['b'], // or ['a', 'c'] for multiple
  explanation: 'Explanation of the correct answer',
  category: 'DIGITAL_TRANSFORMATION', // or DATA_AND_AI, INFRASTRUCTURE_MODERNIZATION, SECURITY_AND_OPERATIONS
  difficulty: 'MEDIUM', // EASY, MEDIUM, or HARD
}
```

Then run:
```bash
npm run db:seed
```

## 🧪 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with questions
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 📊 Current Status

- **Questions**: 56 (Target: 500+)
- **Categories**: All 4 covered
- **Difficulty Levels**: Easy, Medium, Hard
- **Status**: Production Ready ✅

## 🔐 Security

- Password hashing with bcrypt
- JWT-based authentication
- CSRF protection
- SQL injection prevention
- XSS protection
- Secure environment variables

## 📄 License

Proprietary - Techvaults Limited © 2026  
Internal use only.

## 🙏 Support

For issues or questions, contact Techvaults IT team.

---

**Built with ❤️ for Techvaults Engineers**

---

**Built with ❤️ for Techvaults Engineers**
