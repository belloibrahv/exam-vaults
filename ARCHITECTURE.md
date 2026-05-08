# System Architecture - Techvaults GCDL Exam System

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Tablet    │  │    Mobile    │      │
│  │  (Desktop)   │  │              │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js 14 (App Router)                  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Pages     │  │  API Routes │  │ Middleware  │  │  │
│  │  │  (React)    │  │             │  │   (Auth)    │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  NextAuth.js                          │  │
│  │              (Authentication Layer)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Prisma ORM                          │  │
│  │              (Database Abstraction)                   │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                PostgreSQL Database                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │  Users   │  │Questions │  │  Exams   │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### User Authentication Flow

```
┌──────────┐     1. Login Request      ┌──────────────┐
│  Client  │ ────────────────────────> │  Next.js API │
└──────────┘                            └──────┬───────┘
     ▲                                         │
     │                                         │ 2. Verify
     │                                         ▼
     │                                  ┌──────────────┐
     │                                  │  NextAuth.js │
     │                                  └──────┬───────┘
     │                                         │
     │                                         │ 3. Query User
     │                                         ▼
     │                                  ┌──────────────┐
     │                                  │   Prisma     │
     │                                  └──────┬───────┘
     │                                         │
     │                                         │ 4. Fetch User
     │                                         ▼
     │                                  ┌──────────────┐
     │                                  │  PostgreSQL  │
     │                                  └──────┬───────┘
     │                                         │
     │ 5. JWT Token + Session                  │
     └─────────────────────────────────────────┘
```

### Exam Taking Flow

```
┌──────────┐  1. Start Exam   ┌──────────────┐  2. Create    ┌──────────┐
│  Client  │ ───────────────> │  Next.js API │ ───────────> │   DB     │
└────┬─────┘                  └──────────────┘              └──────────┘
     │                                                             │
     │ 3. Return Questions                                         │
     │ <───────────────────────────────────────────────────────────┘
     │
     │ 4. Display Exam Interface
     │ (90-minute timer starts)
     │
     │ 5. User Answers Questions
     │ (Stored in local state)
     │
     │ 6. Submit Answers  ┌──────────────┐  7. Calculate  ┌──────────┐
     └──────────────────> │  Next.js API │ ────────────> │   DB     │
                          └──────────────┘                └──────────┘
                                 │                              │
                                 │ 8. Return Results            │
                                 │ <────────────────────────────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │ Results Page │
                          └──────────────┘
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ String (cuid)                            │
│ email            │ String (unique)                          │
│ name             │ String                                   │
│ password         │ String (hashed)                          │
│ role             │ Enum (STUDENT, ADMIN)                    │
│ createdAt        │ DateTime                                 │
│ updatedAt        │ DateTime                                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ 1:N
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      EXAM_ATTEMPTS                           │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ String (cuid)                            │
│ userId (FK)      │ String → Users.id                        │
│ startedAt        │ DateTime                                 │
│ completedAt      │ DateTime (nullable)                      │
│ timeSpent        │ Int (seconds)                            │
│ score            │ Float (percentage)                       │
│ totalQuestions   │ Int                                      │
│ correctAnswers   │ Int                                      │
│ passed           │ Boolean                                  │
│ canRetakeAt      │ DateTime (nullable)                      │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ 1:N
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         ANSWERS                              │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ String (cuid)                            │
│ examAttemptId(FK)│ String → ExamAttempts.id                 │
│ questionId (FK)  │ String → Questions.id                    │
│ selectedAnswers  │ JSON (array of option IDs)               │
│ isCorrect        │ Boolean                                  │
│ timeSpent        │ Int (seconds, nullable)                  │
│ createdAt        │ DateTime                                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ N:1
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                        QUESTIONS                             │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ String (cuid)                            │
│ question         │ Text                                     │
│ options          │ JSON (array of {id, text})               │
│ correctAnswers   │ JSON (array of option IDs)               │
│ explanation      │ Text                                     │
│ category         │ Enum (4 categories)                      │
│ difficulty       │ Enum (EASY, MEDIUM, HARD)                │
│ createdAt        │ DateTime                                 │
│ updatedAt        │ DateTime                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Component Architecture

```
app/
├── layout.tsx (Root Layout)
│   └── Providers (SessionProvider)
│
├── page.tsx (Landing Page)
│   ├── TechvaultsLogo
│   ├── FeatureCard
│   └── TopicCard
│
├── auth/
│   ├── signin/page.tsx
│   │   └── SignInForm
│   └── signup/page.tsx
│       └── SignUpForm
│
├── dashboard/
│   ├── page.tsx (Server Component)
│   └── DashboardClient.tsx
│       ├── StatCard
│       ├── AttemptCard
│       └── ConfirmModal
│
└── exam/
    ├── start/page.tsx (Server Component)
    ├── ExamInterface.tsx
    │   ├── Timer
    │   ├── QuestionDisplay
    │   ├── OptionsList
    │   ├── NavigationButtons
    │   └── QuestionNavigator
    └── results/[id]/
        ├── page.tsx (Server Component)
        └── ResultsClient.tsx
            ├── ScoreCard
            ├── StatCard
            ├── CategoryBreakdown
            └── QuestionReview
```

---

## 🔐 Security Architecture

### Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Security Layers                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. HTTPS/TLS                                            │
│     └─> Encrypted communication                          │
│                                                           │
│  2. NextAuth.js Middleware                               │
│     └─> Route protection                                 │
│     └─> Session validation                               │
│                                                           │
│  3. JWT Tokens                                           │
│     └─> Signed with NEXTAUTH_SECRET                      │
│     └─> HttpOnly cookies                                 │
│                                                           │
│  4. Password Hashing                                     │
│     └─> bcrypt with 12 rounds                            │
│                                                           │
│  5. Prisma ORM                                           │
│     └─> Parameterized queries                            │
│     └─> SQL injection prevention                         │
│                                                           │
│  6. React                                                │
│     └─> XSS protection (auto-escaping)                   │
│                                                           │
│  7. Next.js                                              │
│     └─> CSRF protection                                  │
│     └─> Security headers                                 │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────┐
│         Developer Machine                │
│  ┌────────────────────────────────────┐ │
│  │  Next.js Dev Server (Port 3000)   │ │
│  │  - Hot Module Replacement          │ │
│  │  - Source Maps                     │ │
│  │  - Debug Mode                      │ │
│  └────────────────────────────────────┘ │
│                  │                       │
│                  ▼                       │
│  ┌────────────────────────────────────┐ │
│  │  PostgreSQL (Port 5432)            │ │
│  │  - Local Database                  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Production Environment (Vercel)

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Platform                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Edge Network (CDN)                   │  │
│  │  - Static Assets                                  │  │
│  │  - Image Optimization                             │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                                │
│                         ▼                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Serverless Functions (Lambda)             │  │
│  │  - API Routes                                     │  │
│  │  - Server Components                              │  │
│  │  - Auto-scaling                                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Managed PostgreSQL (Neon/Supabase)         │
│  - Connection Pooling                                   │
│  - Automatic Backups                                    │
│  - High Availability                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 Performance Optimizations

### 1. Server-Side Rendering (SSR)
- Initial page load is server-rendered
- Faster First Contentful Paint (FCP)
- Better SEO (if needed)

### 2. Code Splitting
- Automatic route-based splitting
- Lazy loading of components
- Smaller initial bundle size

### 3. Image Optimization
- Next.js Image component
- Automatic format selection (WebP, AVIF)
- Responsive images

### 4. Database Optimization
- Indexed columns (userId, examAttemptId)
- Connection pooling
- Efficient queries with Prisma

### 5. Caching Strategy
- Static pages cached at CDN
- API responses cached when appropriate
- Browser caching for assets

---

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────┐
│                   State Architecture                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Server State (Database)                                │
│  ├─> User data                                          │
│  ├─> Exam attempts                                      │
│  ├─> Questions                                          │
│  └─> Answers                                            │
│                                                          │
│  Session State (NextAuth)                               │
│  ├─> User authentication                                │
│  ├─> JWT token                                          │
│  └─> User role                                          │
│                                                          │
│  Client State (React Hooks)                             │
│  ├─> Current question index                             │
│  ├─> Selected answers                                   │
│  ├─> Flagged questions                                  │
│  ├─> Timer countdown                                    │
│  └─> UI state (modals, etc.)                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 Integration Points

### External Services

```
┌─────────────────────────────────────────────────────────┐
│              Techvaults Exam System                      │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│PostgreSQL│  │  Email   │  │  Future  │
│ Database │  │ Service  │  │   APIs   │
│          │  │(Optional)│  │          │
└──────────┘  └──────────┘  └──────────┘
```

### Future Integrations (Planned)

- Email notifications (SendGrid, AWS SES)
- Slack notifications
- Google Calendar integration
- Learning Management System (LMS)
- Analytics platform (Google Analytics, Mixpanel)

---

## 📊 Monitoring & Logging

### Application Monitoring

```
┌─────────────────────────────────────────────────────────┐
│                   Monitoring Stack                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Application Logs                                       │
│  ├─> Console logs (development)                         │
│  ├─> File logs (production)                             │
│  └─> Error tracking (Sentry - optional)                 │
│                                                          │
│  Database Monitoring                                    │
│  ├─> Query performance                                  │
│  ├─> Connection pool status                             │
│  └─> Slow query logs                                    │
│                                                          │
│  Server Monitoring                                      │
│  ├─> CPU usage                                          │
│  ├─> Memory usage                                       │
│  ├─> Response times                                     │
│  └─> Error rates                                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Development Workflow

```
┌──────────────┐
│  Developer   │
└──────┬───────┘
       │
       │ 1. Code Changes
       ▼
┌──────────────┐
│  Git Commit  │
└──────┬───────┘
       │
       │ 2. Push to Repo
       ▼
┌──────────────┐
│   GitHub     │
└──────┬───────┘
       │
       │ 3. Trigger CI/CD
       ▼
┌──────────────┐
│  Vercel      │
│  - Build     │
│  - Test      │
│  - Deploy    │
└──────┬───────┘
       │
       │ 4. Live
       ▼
┌──────────────┐
│  Production  │
└──────────────┘
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (NextAuth)
- `POST /api/auth/signout` - User logout (NextAuth)

### Exam
- `POST /api/exam/submit` - Submit exam answers

### Future Endpoints (Planned)
- `GET /api/admin/questions` - List all questions
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - System statistics

---

**This architecture is designed for scalability, security, and maintainability.**
