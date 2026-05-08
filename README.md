# 🎓 Techvaults Multi-Cloud Certification Prep System

A professional exam preparation platform for AWS, Azure, and Google Cloud certifications, built for Techvaults Limited engineers.

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
   npx tsx prisma/seed-migration.ts  # Create providers & certifications
   npm run db:seed                    # Add users & GCDL questions
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

### Multi-Cloud Support
- ✅ **AWS**: 10 certifications (Cloud Practitioner to Specialty)
- ✅ **Azure**: 8 certifications (Fundamentals to Expert)
- ✅ **GCP**: 7 certifications (Digital Leader to Professional)

### Exam Experience
- ✅ Realistic timed exams matching actual certification formats
- ✅ Multiple choice and multiple select questions
- ✅ Instant scoring with detailed explanations
- ✅ Category/domain-wise performance breakdown
- ✅ Question flagging and navigation
- ✅ 2-hour cooldown after failed attempts

### User Experience
- ✅ Multi-certification progress tracking
- ✅ Provider-based certification browsing
- ✅ Difficulty ratings (1-5 stars)
- ✅ Fully responsive design
- ✅ Techvaults branding (#BC0004, #000, #FFF)

## 📊 Supported Certifications

### AWS (10 Certifications)
**Foundational**
- Cloud Practitioner (CLF-C02)

**Associate**
- Solutions Architect Associate (SAA-C03) ⭐ Most Popular
- Developer Associate (DVA-C02)
- SysOps Administrator Associate (SOA-C02)

**Professional**
- Solutions Architect Professional (SAP-C02)
- DevOps Engineer Professional (DOP-C02)

**Specialty**
- Security Specialty (SCS-C02)
- Advanced Networking Specialty (ANS-C01)
- Machine Learning Specialty (MLS-C01)
- Database Specialty (DBS-C01)

### Azure (8 Certifications)
**Fundamentals**
- Azure Fundamentals (AZ-900)

**Associate**
- Azure Administrator (AZ-104) ⭐ Most Popular
- Azure Developer (AZ-204)
- Azure Security Engineer (AZ-500)
- Azure Data Engineer (DP-203)
- Azure AI Engineer (AI-102)

**Expert**
- Azure Solutions Architect (AZ-305)
- DevOps Engineer (AZ-400)

### GCP (7 Certifications)
**Foundational**
- Cloud Digital Leader ⭐ Currently Available

**Associate**
- Associate Cloud Engineer

**Professional**
- Professional Cloud Architect ⭐ Highly Respected
- Professional Data Engineer
- Professional Cloud Security Engineer
- Professional Machine Learning Engineer
- Professional Cloud DevOps Engineer

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Render / Vercel

## 📁 Project Structure

```
exam-vaults/
├── app/
│   ├── api/              # API routes (auth, exam submission)
│   ├── auth/             # Sign in/up pages
│   ├── dashboard/        # User dashboard
│   ├── exam/             # Exam interface & results
│   ├── providers/        # Multi-cloud provider pages
│   │   ├── page.tsx      # All providers listing
│   │   └── [slug]/       # Individual provider page
│   ├── page.tsx          # Homepage
│   └── layout.tsx        # Root layout
├── components/           # React components
├── lib/                  # Utilities and configurations
├── prisma/
│   ├── schema.prisma     # Multi-cloud database schema
│   ├── seed-migration.ts # Providers & certifications seed
│   └── seed.ts           # Users & questions seed
├── types/                # TypeScript types
└── README.md             # This file
```

## 🗄️ Database Schema

### Core Models
- **Provider**: Cloud providers (AWS, Azure, GCP)
- **CertificationLevel**: Foundational, Associate, Professional, Specialty, Expert
- **Certification**: Individual certifications (25 total)
- **Domain**: Exam domains/topics per certification
- **Question**: Practice questions linked to certifications and domains
- **ExamAttempt**: User exam sessions
- **UserProgress**: Multi-cert progress tracking

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
5. Add build command: `npm install && npx prisma generate && npm run build`
6. Add start command: `npm start`
7. Deploy and run seed scripts

### Environment Variables

```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NODE_ENV="development"
```

## 📝 Adding More Questions

Questions are organized by certification and domain. To add questions:

1. Identify the certification code (e.g., `SAA-C03`, `AZ-104`)
2. Find the appropriate domain
3. Add questions following this format:

```typescript
await prisma.question.create({
  data: {
    question: 'Your question text?',
    options: [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' },
    ],
    correctAnswers: ['b'], // or ['a', 'c'] for multiple
    explanation: 'Explanation of the correct answer',
    certificationId: 'cert-id',
    domainId: 'domain-id',
    difficulty: 'MEDIUM', // EASY, MEDIUM, or HARD
    questionType: 'SINGLE_CHOICE', // or MULTIPLE_CHOICE
    tags: ['EC2', 'VPC', 'Networking'], // Optional
  },
});
```

### Question Distribution Target
- **Foundational**: 500 questions per cert
- **Associate**: 1000 questions per cert
- **Professional**: 1000 questions per cert
- **Specialty/Expert**: 500-1000 questions per cert

## 🧪 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed users & questions
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 📊 Current Status

### Phase 1: Multi-Cloud Architecture ✅
- ✅ New database schema with providers, certifications, domains
- ✅ 3 cloud providers configured
- ✅ 25 certifications metadata added
- ✅ Multi-cloud homepage and provider pages
- ✅ GCDL questions migrated to new schema

### Phase 2: Question Bank Expansion (In Progress)
- ✅ GCDL: 56 questions (Target: 500)
- ⏳ AWS Cloud Practitioner: 0 questions (Target: 500)
- ⏳ AWS SAA: 0 questions (Target: 1000)
- ⏳ Azure Fundamentals: 0 questions (Target: 500)
- ⏳ Azure Administrator: 0 questions (Target: 1000)
- ⏳ GCP Associate Cloud Engineer: 0 questions (Target: 500)

### Phase 3: Dashboard & Progress Tracking (Next)
- ⏳ Multi-certification dashboard
- ⏳ Progress tracking across providers
- ⏳ Weak domain identification
- ⏳ Certification path recommendations

### Phase 4: Advanced Features (Future)
- ⏳ Study mode (untimed practice)
- ⏳ Flashcards for key concepts
- ⏳ Learning paths
- ⏳ Performance analytics

## 🎯 Roadmap

**Week 1-2**: Database migration & UI redesign ✅
**Week 3-4**: AWS Cloud Practitioner questions (500)
**Week 5-6**: AWS SAA questions (1000)
**Week 7-8**: Azure Fundamentals & AZ-104 questions (1500)
**Week 9-10**: GCP Associate Cloud Engineer questions (500)
**Week 11-12**: Dashboard enhancements & progress tracking

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
