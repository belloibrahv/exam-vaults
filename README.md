# 🎓 Techvaults GCDL Exam Preparation System

<div align="center">

![Techvaults Logo](https://img.shields.io/badge/Techvaults-Limited-BC0004?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql)

**A professional exam preparation platform for Google Cloud Digital Leader (GCDL) certification**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Demo](#-demo-accounts)

</div>

---

## 📖 Overview

The Techvaults GCDL Exam System is an enterprise-grade internal platform designed to help Techvaults engineers prepare for the Google Cloud Digital Leader certification. It provides a realistic exam simulation environment with comprehensive tracking, analytics, and learning features.

### Why This System?

- ✅ **Realistic Practice** - Mimics actual GCP certification exam format
- ✅ **Enforced Preparation** - Smart cooldown prevents unprepared retakes
- ✅ **Comprehensive Feedback** - Detailed explanations for every question
- ✅ **Track Progress** - Monitor improvement over time
- ✅ **Professional Grade** - Built to enterprise standards

---

## ✨ Features

### 🎯 Exam Simulation
- **90-minute timed sessions** with countdown timer
- **50-60 questions** randomly selected from question bank
- **Multiple question types** (single-select and multiple-select)
- **Question navigator** with answered/unanswered tracking
- **Flag questions** for review
- **Auto-submit** when time expires

### 📊 Analytics & Tracking
- **Instant scoring** with pass/fail determination (70% threshold)
- **Category breakdown** across 4 GCDL domains
- **Historical attempts** with detailed statistics
- **Performance trends** over time
- **Time tracking** for each attempt

### 🔒 Smart Access Control
- **2-hour cooldown** after failed attempts
- **Visual countdown** showing time remaining
- **Unlimited attempts** after cooldown expires
- **Encourages proper preparation** before retaking

### 🎨 Professional UI/UX
- **Techvaults branding** with custom logo and colors
- **Fully responsive** design (mobile, tablet, desktop)
- **Smooth animations** and transitions
- **Accessibility compliant** interface
- **Modern, clean design** matching enterprise standards

### 📚 Learning Features
- **Detailed explanations** for every question
- **Full answer review** with correct/incorrect indicators
- **Category-wise analysis** to identify weak areas
- **Question-by-question breakdown** in results

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./scripts/setup.sh
```

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Setup database
npm run db:push
npm run db:generate
npm run db:seed

# 4. Start development server
npm run dev
```

**📖 For detailed instructions, see [QUICK_START.md](QUICK_START.md)**

---

## 🎮 Demo Accounts

Test the system with these pre-configured accounts:

| Role | Email | Password |
|------|-------|----------|
| **Student** | student@techvaults.com | student123 |
| **Admin** | admin@techvaults.com | admin123 |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom components with Lucide icons
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js 4.24
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.14
- **Validation**: Zod

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode
- **Database GUI**: Prisma Studio

---

## 📋 Exam Format

Based on the official Google Cloud Digital Leader certification:

| Aspect | Details |
|--------|---------|
| **Questions** | 50-60 per exam |
| **Duration** | 90 minutes |
| **Passing Score** | 70% |
| **Question Types** | Multiple choice, Multiple select |
| **Cost** | $99 (actual exam) |

### Exam Topics

1. **Digital Transformation with Google Cloud** (25%)
   - Cloud concepts and benefits
   - Business transformation strategies
   - CapEx vs OpEx models

2. **Innovating with Data and Google Cloud** (25%)
   - Data management and analytics
   - BigQuery and data warehousing
   - AI/ML services

3. **Infrastructure and Application Modernization** (25%)
   - Compute options (Compute Engine, GKE, Cloud Functions)
   - Containerization and Kubernetes
   - Networking and VPC

4. **Google Cloud Security and Operations** (25%)
   - IAM and access control
   - Security best practices
   - Monitoring and logging

---

## 📁 Project Structure

```
exam-vaults/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Student dashboard
│   ├── exam/              # Exam interface
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── lib/                   # Utilities and configs
├── prisma/               # Database schema
├── scripts/              # Automation scripts
└── types/                # TypeScript types
```

---

## 🎯 Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- npm or yarn package manager

### Installation

See [QUICK_START.md](QUICK_START.md) for step-by-step instructions.

### Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed with sample data
npm run db:studio    # Open Prisma Studio GUI
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](QUICK_START.md) | Get up and running in 5 minutes |
| [SETUP.md](SETUP.md) | Detailed setup instructions |
| [FEATURES.md](FEATURES.md) | Complete feature documentation |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Comprehensive project overview |

---

## 🎬 How It Works

### 1. Sign Up / Sign In
Students create an account or sign in with existing credentials.

### 2. Dashboard
View statistics, past attempts, and start new exams.

### 3. Take Exam
- 90-minute timed session
- 50-60 randomly selected questions
- Navigate between questions
- Flag questions for review
- Submit when ready

### 4. View Results
- Instant score and pass/fail status
- Category-wise breakdown
- Detailed explanations for all questions
- Identify areas for improvement

### 5. Retake (if needed)
- If score < 70%, wait 2 hours before retaking
- Study explanations and weak areas
- Try again with new questions

---

## 🔐 Security

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT-based session management
- ✅ CSRF protection (Next.js built-in)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React built-in)
- ✅ Secure environment variables
- ✅ Protected API routes
- ✅ Auth middleware for protected pages

---

## 🚀 Deployment

### Quick Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Other Options
- Docker deployment
- VPS (DigitalOcean, AWS EC2)
- Traditional hosting

**📖 See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions**

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Dashboard statistics
- [ ] Start exam
- [ ] Timer countdown
- [ ] Question navigation
- [ ] Answer selection
- [ ] Submit exam
- [ ] View results
- [ ] Cooldown restriction
- [ ] Responsive design

---

## 🤝 Contributing

This is an internal Techvaults project. For improvements or bug reports, contact the IT team.

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review error messages
3. Contact Techvaults IT team

---

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core exam functionality
- ✅ User authentication
- ✅ Results and analytics
- ✅ Responsive design

### Phase 2 (Planned)
- [ ] Admin dashboard
- [ ] Study mode (untimed)
- [ ] Question bookmarking
- [ ] Performance analytics
- [ ] PDF export

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Flashcard mode
- [ ] Team leaderboards
- [ ] LMS integration

---

## 🏆 Success Metrics

The system helps engineers:
- ✅ Practice in realistic exam conditions
- ✅ Identify knowledge gaps
- ✅ Track improvement over time
- ✅ Build confidence before actual exam
- ✅ Increase GCDL certification pass rate

---

## 📄 License

**Proprietary** - Techvaults Limited © 2026

Internal use only. Not for distribution.

---

## 🙏 Acknowledgments

Built with ❤️ for Techvaults engineers preparing for Google Cloud Digital Leader certification.

**Good luck with your certification journey! 🚀**

---

<div align="center">

**[⬆ Back to Top](#-techvaults-gcdl-exam-preparation-system)**

Made with 💻 by Techvaults IT Team

</div>
