# Quick Start: Adding Exam Questions

## 🎯 Goal
Add 500+ high-quality questions per certification from official and legal sources.

## 📋 Current Status

Run this command to see current question counts:
```bash
npm run question-stats
```

## 🚀 Quick Start (3 Steps)

### Step 1: Get Official Free Questions (This Week)

#### AWS Official Questions (20 per cert - FREE)
1. Go to https://skillbuilder.aws/
2. Create free account
3. Search for "Official Practice Question Set"
4. Enroll in courses for:
   - AWS Cloud Practitioner (CLF-C02)
   - AWS Solutions Architect Associate (SAA-C03)
   - AWS Solutions Architect Professional (SAP-C02)
5. Take the practice sets and document questions
6. Convert to JSON format (see template below)

#### Microsoft Practice Assessments (FREE)
1. Go to https://learn.microsoft.com/credentials/certifications/practice-assessments
2. Click on each certification:
   - Azure Fundamentals (AZ-900)
   - Azure Administrator (AZ-104)
   - Azure Solutions Architect (AZ-305)
3. Take "Free Practice Assessment"
4. Document question patterns
5. Create original questions based on patterns

#### Google Cloud Sample Questions (FREE)
1. Go to https://cloud.google.com/learn/certification/
2. Download exam guides for each certification
3. Extract sample questions from guides
4. Convert to JSON format

### Step 2: Purchase Premium Content (Recommended)

#### Best Value: Tutorials Dojo ($10-15 per cert)
- URL: https://tutorialsdojo.com/
- 400+ questions per certification
- Excellent explanations
- PDF format available
- **Recommended for:** AWS Cloud Practitioner, AWS SAA, Azure Fundamentals

#### Alternative: Udemy Practice Tests ($10-15 during sales)
- Search: "[Certification Name] practice test"
- Popular instructors: Stephane Maarek, Scott Duffy, Alan Rodrigues
- 200-400 questions per course
- **Tip:** Wait for Udemy sales (every 2 weeks)

### Step 3: Import Questions to Database

#### Create Question JSON File

Create file in `prisma/questions/` directory:

**Example:** `prisma/questions/aws-cp-additional.json`

```json
[
  {
    "question": "Which AWS service provides a fully managed NoSQL database?",
    "options": [
      {"id": "a", "text": "Amazon RDS"},
      {"id": "b", "text": "Amazon DynamoDB"},
      {"id": "c", "text": "Amazon Redshift"},
      {"id": "d", "text": "Amazon Aurora"}
    ],
    "correctAnswers": ["b"],
    "explanation": "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.",
    "category": "Cloud Technology",
    "difficulty": "EASY"
  }
]
```

#### Import to Database

```bash
# Import specific file
npm run import-questions import AWS-CLOUD-PRACTITIONER aws-cp-additional.json

# Import all available files
npm run import-questions import-all

# Check statistics
npm run question-stats
```

## 📝 Question Format Template

```json
{
  "question": "Clear, specific question text?",
  "options": [
    {"id": "a", "text": "First option"},
    {"id": "b", "text": "Second option (correct)"},
    {"id": "c", "text": "Third option"},
    {"id": "d", "text": "Fourth option"}
  ],
  "correctAnswers": ["b"],
  "explanation": "Detailed explanation with reasoning. Reference official documentation when possible.",
  "category": "Domain name from exam guide (e.g., 'Security & Compliance', 'Cloud Technology')",
  "difficulty": "EASY"
}
```

### Difficulty Guidelines

**EASY:**
- Basic service identification
- Simple definitions
- Straightforward concepts
- Example: "What does S3 stand for?"

**MEDIUM:**
- Service comparisons
- Use case selection
- Best practices
- Example: "Which storage class is best for frequently accessed data?"

**HARD:**
- Complex scenarios
- Multi-service architectures
- Trade-off analysis
- Troubleshooting
- Example: "Design a highly available, cost-optimized solution for..."

## 🎯 Target Distribution

### AWS Cloud Practitioner (500 questions)
```
Cloud Concepts (24%):        120 questions
Security & Compliance (30%): 150 questions
Cloud Technology (34%):      170 questions
Billing & Pricing (12%):      60 questions

Difficulty:
- Easy: 40% (200 questions)
- Medium: 45% (225 questions)
- Hard: 15% (75 questions)
```

### AWS Solutions Architect Associate (700 questions)
```
Secure Architectures (30%):        210 questions
Resilient Architectures (26%):     182 questions
High-Performing Architectures (24%): 168 questions
Cost-Optimized Architectures (20%): 140 questions

Difficulty:
- Easy: 30% (210 questions)
- Medium: 50% (350 questions)
- Hard: 20% (140 questions)
```

### Azure Fundamentals (500 questions)
```
Cloud Concepts (25-30%):           135 questions
Azure Architecture & Services (35-40%): 185 questions
Azure Management & Governance (30-35%): 155 questions

Difficulty:
- Easy: 40% (200 questions)
- Medium: 45% (225 questions)
- Hard: 15% (75 questions)
```

## ✅ Quality Checklist

Before importing questions, verify:

- [ ] Question is clear and grammatically correct
- [ ] All options are plausible (no obvious wrong answers)
- [ ] Correct answer is definitively correct
- [ ] Explanation references official documentation
- [ ] Difficulty matches question complexity
- [ ] Category matches certification domain
- [ ] No typos or formatting issues
- [ ] Technical accuracy verified
- [ ] Scenario is realistic

## 🔧 Useful Commands

```bash
# Show question statistics
npm run question-stats

# Import questions from a file
npm run import-questions import <CERT-CODE> <filename.json>

# Examples:
npm run import-questions import AWS-CLOUD-PRACTITIONER aws-cp-100.json
npm run import-questions import AZURE-FUNDAMENTALS az-900-200.json
npm run import-questions import GCP-CLOUD-DIGITAL-LEADER gcp-cdl-150.json

# Import all available question files
npm run import-questions import-all

# Delete questions for a certification (use with caution!)
npm run import-questions delete AWS-CLOUD-PRACTITIONER

# Open Prisma Studio to view questions
npm run db:studio
```

## 📚 Certification Codes

Use these codes when importing questions:

**AWS:**
- `AWS-CLOUD-PRACTITIONER`
- `AWS-SOLUTIONS-ARCHITECT-ASSOCIATE`
- `AWS-SOLUTIONS-ARCHITECT-PROFESSIONAL`
- `AWS-DEVELOPER-ASSOCIATE`
- `AWS-SYSOPS-ADMINISTRATOR`

**Azure:**
- `AZURE-FUNDAMENTALS`
- `AZURE-ADMINISTRATOR`
- `AZURE-SOLUTIONS-ARCHITECT`
- `AZURE-DEVELOPER`
- `AZURE-SECURITY-ENGINEER`

**Google Cloud:**
- `GCP-CLOUD-DIGITAL-LEADER`
- `GCP-ASSOCIATE-CLOUD-ENGINEER`
- `GCP-PROFESSIONAL-CLOUD-ARCHITECT`
- `GCP-PROFESSIONAL-CLOUD-DEVELOPER`
- `GCP-PROFESSIONAL-DATA-ENGINEER`

## 🤖 AI-Assisted Question Generation

Use ChatGPT or Claude to generate questions (always verify accuracy!):

### Prompt Template

```
Create 10 [CERTIFICATION NAME] exam questions about [TOPIC/SERVICE].

Requirements:
- Based on official [AWS/Azure/GCP] documentation
- Realistic scenarios
- One correct answer, three plausible distractors
- Detailed explanation with reasoning
- Difficulty: [EASY/MEDIUM/HARD]
- Category: [DOMAIN NAME]

Format as JSON array:
[
  {
    "question": "...",
    "options": [
      {"id": "a", "text": "..."},
      {"id": "b", "text": "..."},
      {"id": "c", "text": "..."},
      {"id": "d", "text": "..."}
    ],
    "correctAnswers": ["b"],
    "explanation": "...",
    "category": "...",
    "difficulty": "MEDIUM"
  }
]
```

### Example Prompt

```
Create 10 AWS Cloud Practitioner exam questions about Amazon S3.

Requirements:
- Based on official AWS documentation
- Realistic scenarios
- One correct answer, three plausible distractors
- Detailed explanation with reasoning
- Difficulty: MEDIUM
- Category: Cloud Technology

Format as JSON array with question, options (id: a/b/c/d, text), correctAnswers, explanation, category, difficulty.
```

**IMPORTANT:** Always verify AI-generated questions against official documentation!

## ⚖️ Legal & Ethical Guidelines

### ✅ Allowed
- Official free practice questions (with attribution)
- Purchased licensed content (following license terms)
- Original questions based on official documentation
- AI-generated questions (verified for accuracy)
- Paraphrasing and creating variations

### ❌ Not Allowed
- Actual exam questions (NDA violation)
- Brain dump sites (illegal)
- Copyrighted content without permission
- Sharing purchased content beyond license
- Verbatim copying without attribution

## 📈 Progress Tracking

### Week 1 Goals
- [ ] AWS Cloud Practitioner: 200 questions (from 56)
- [ ] Azure Fundamentals: 100 questions (from 0)
- [ ] GCP Cloud Digital Leader: 150 questions (from 56)

### Month 1 Goals
- [ ] AWS Cloud Practitioner: 500+ questions
- [ ] AWS Solutions Architect Associate: 300+ questions
- [ ] Azure Fundamentals: 500+ questions
- [ ] GCP Cloud Digital Leader: 500+ questions

### Month 3 Goals
- [ ] All certifications: 500+ questions each
- [ ] Total: 6,000+ questions across all certifications

## 🆘 Troubleshooting

### "Certification not found" error
- Check certification code matches exactly (case-sensitive)
- Run `npm run question-stats` to see available certifications
- Verify database is seeded with certifications

### "File not found" error
- Ensure file is in `prisma/questions/` directory
- Check filename spelling
- Use relative path from project root

### Questions not appearing in app
- Run `npm run db:studio` to verify questions in database
- Check `certificationId` matches the certification
- Restart development server

### Duplicate questions
- Import script automatically skips duplicates (by question text)
- To replace all questions, delete first then import

## 📞 Need Help?

1. Check official exam guides for domain breakdown
2. Verify question accuracy against official documentation
3. Test questions in development before production
4. Review existing questions in `prisma/questions/` for examples

## 🔗 Official Resources

- **AWS:** https://aws.amazon.com/certification/certification-prep/
- **Azure:** https://learn.microsoft.com/credentials/certifications/practice-assessments
- **GCP:** https://cloud.google.com/learn/certification/
- **Tutorials Dojo:** https://tutorialsdojo.com/
- **Udemy:** https://www.udemy.com/ (search "[cert name] practice test")

---

**Remember:** Quality over quantity. 500 excellent questions are better than 1000 mediocre ones!

**Last Updated:** May 8, 2026
