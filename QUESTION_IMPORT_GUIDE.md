# Question Import Guide

## Current Status
- ✅ GCP Cloud Digital Leader: 56 questions
- ✅ AWS Cloud Practitioner: 5 sample questions created
- ❌ Need: 495 more AWS CP questions + all other certifications

## Quick Start: Adding Questions

### Step 1: Create Question JSON File

Create a file in `prisma/questions/` with this format:

```json
[
  {
    "question": "Your question text here?",
    "options": [
      {"id": "a", "text": "Option A"},
      {"id": "b", "text": "Option B"},
      {"id": "c", "text": "Option C"},
      {"id": "d", "text": "Option D"}
    ],
    "correctAnswers": ["b"],
    "explanation": "Detailed explanation with reasoning",
    "category": "Domain name (e.g., Cloud Concepts, Security & Compliance)",
    "difficulty": "EASY|MEDIUM|HARD"
  }
]
```

### Step 2: Update Seed Script

Add to `prisma/seed.ts`:

```typescript
// Import your questions
import awsCloudPractitionerQuestions from './questions/aws-cp-50.json';

// In the main() function, after getting certification:
const awsCP = await prisma.certification.findFirst({
  where: { code: 'AWS-CLOUD-PRACTITIONER' }
});

if (awsCP) {
  for (const q of awsCloudPractitionerQuestions) {
    await prisma.question.create({
      data: {
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
        category: q.category,
        difficulty: q.difficulty,
        certificationId: awsCP.id,
      },
    });
  }
  console.log(`✅ Added ${awsCloudPractitionerQuestions.length} AWS CP questions`);
}
```

### Step 3: Run Seed

```bash
npx prisma db seed
```

## Recommended Question Sources

### 1. Official Free Resources (Best)

**AWS:**
- Official Practice Question Sets: https://aws.amazon.com/certification/certification-prep/
- 20 questions per certification, FREE
- Download and manually convert to JSON format

**Microsoft Azure:**
- Practice Assessments: https://learn.microsoft.com/credentials/certifications/practice-assessments
- Free interactive assessments
- Take notes and create original questions based on patterns

**Google Cloud:**
- Practice exams available on cloud.google.com
- Some free, some paid
- Use to understand question styles

### 2. Purchase Licensed Content (Recommended)

**Tutorials Dojo** ($10-15 per exam)
- 400+ questions per certification
- Detailed explanations
- PDF format - easy to convert
- Website: tutorialsdojo.com

**Udemy Practice Tests** ($10-15 per course)
- 200-400 questions per cert
- Lifetime access
- Search for "practice test" + certification name

**Whizlabs** ($10-20 per exam)
- 300+ questions per certification
- Online platform
- Good explanations

### 3. AI-Assisted Generation (Supplement)

Use ChatGPT/Claude to generate questions:

**Prompt Template:**
```
Create 10 AWS Cloud Practitioner exam questions about [TOPIC].
Format as JSON with this structure:
{
  "question": "...",
  "options": [{"id": "a", "text": "..."}, ...],
  "correctAnswers": ["a"],
  "explanation": "...",
  "category": "...",
  "difficulty": "EASY|MEDIUM|HARD"
}

Requirements:
- Based on official AWS documentation
- Realistic scenarios
- One correct answer
- Three plausible distractors
- Detailed explanation with reasoning
```

**IMPORTANT:** Always verify AI-generated questions against official documentation!

## Question Distribution Targets

### AWS Cloud Practitioner (500 questions)
- Cloud Concepts (24%): 120 questions
- Security & Compliance (30%): 150 questions
- Cloud Technology (34%): 170 questions
- Billing & Pricing (12%): 60 questions

### AWS Solutions Architect Associate (700 questions)
- Secure Architectures (30%): 210 questions
- Resilient Architectures (26%): 182 questions
- High-Performing Architectures (24%): 168 questions
- Cost-Optimized Architectures (20%): 140 questions

### Azure Fundamentals AZ-900 (500 questions)
- Cloud Concepts (25-30%): 135 questions
- Azure Architecture & Services (35-40%): 185 questions
- Azure Management & Governance (30-35%): 155 questions

### GCP Cloud Digital Leader (500 questions)
- Digital Transformation (17%): 85 questions
- Data & AI (17%): 85 questions
- Infrastructure Modernization (17%): 85 questions
- Security (17%): 85 questions
- Operations (17%): 85 questions
- Business Value (15%): 75 questions

## Bulk Import Script

Create `scripts/import-questions.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importQuestions(certificationCode: string, questionsFile: string) {
  const cert = await prisma.certification.findFirst({
    where: { code: certificationCode }
  });

  if (!cert) {
    console.error(`❌ Certification ${certificationCode} not found`);
    return;
  }

  const filePath = path.join(__dirname, '..', 'prisma', 'questions', questionsFile);
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let imported = 0;
  for (const q of questions) {
    await prisma.question.create({
      data: {
        ...q,
        certificationId: cert.id,
      },
    });
    imported++;
  }

  console.log(`✅ Imported ${imported} questions for ${cert.name}`);
}

async function main() {
  await importQuestions('AWS-CLOUD-PRACTITIONER', 'aws-cp-500.json');
  await importQuestions('AWS-SOLUTIONS-ARCHITECT-ASSOCIATE', 'aws-saa-700.json');
  await importQuestions('AZURE-FUNDAMENTALS', 'az-900-500.json');
  // Add more as needed
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with:
```bash
npx ts-node scripts/import-questions.ts
```

## Quality Checklist

Before importing questions, verify:

- [ ] Question is clear and unambiguous
- [ ] All options are plausible
- [ ] Correct answer is definitively correct
- [ ] Explanation references official documentation
- [ ] Difficulty matches question complexity
- [ ] Category matches certification domain
- [ ] No typos or formatting issues
- [ ] Technical accuracy verified

## Legal Compliance

✅ **Allowed:**
- Official practice questions (with attribution)
- Purchased licensed content
- Original questions based on documentation
- AI-generated questions (verified for accuracy)

❌ **Not Allowed:**
- Brain dump sites (ExamTopics, etc.)
- Actual exam questions (NDA violation)
- Copyrighted content without permission
- Leaked or stolen content

## Next Steps

1. **Immediate (This Week):**
   - Purchase Tutorials Dojo for AWS CP, Azure Fund, GCP CDL ($30-45)
   - Convert to JSON format
   - Import 400+ questions per cert

2. **Short-term (Next 2 Weeks):**
   - Use official free practice questions
   - Generate additional questions with AI (verify accuracy)
   - Reach 500+ questions for foundational certs

3. **Medium-term (Next Month):**
   - Add Associate-level certifications
   - Purchase additional practice tests
   - Reach 600-700 questions per associate cert

4. **Long-term (Next 3 Months):**
   - Add Professional-level certifications
   - Build to 800-1000 questions per professional cert
   - Implement community contribution system

## Support

For questions or issues:
1. Check official exam guides for domain breakdown
2. Verify question accuracy against official documentation
3. Test questions in development before production
4. Monitor user feedback for question quality

## Resources

- AWS Documentation: https://docs.aws.amazon.com/
- Azure Documentation: https://learn.microsoft.com/azure/
- GCP Documentation: https://cloud.google.com/docs
- AWS Exam Guides: https://aws.amazon.com/certification/
- Azure Certifications: https://learn.microsoft.com/certifications/
- GCP Certifications: https://cloud.google.com/learn/certification
