import { PrismaClient } from '@prisma/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

type FlatQuestion = {
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswers: string[];
  explanation: string;
  category?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string[];
  references?: string[];
};

type WrappedQuestionFile = {
  metadata: { certification?: string };
  questions: FlatQuestion[];
};

async function loadJsonQuestions(fileName: string): Promise<FlatQuestion[]> {
  const filePath = join(process.cwd(), 'prisma/questions', fileName);
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed)) {
    return parsed as FlatQuestion[];
  } else if (parsed.questions && Array.isArray(parsed.questions)) {
    const meta = parsed as WrappedQuestionFile;
    return meta.questions;
  }
  console.warn(`⚠️ Unknown format in ${fileName}`);
  return [];
}

// Maps for AWS CP categories to exam domains
const AWS_CP_CATEGORY_MAP: Record<string, string> = {
  'Cloud Concepts': 'AWS CP - Cloud Concepts',
  'Cloud Technology': 'AWS CP - Cloud Technology',
  'Security & Compliance': 'AWS CP - Security & Compliance',
  'Billing & Pricing': 'AWS CP - Billing & Pricing',
  'Compute': 'AWS CP - Cloud Technology',
  'Storage': 'AWS CP - Cloud Technology',
  'Database': 'AWS CP - Cloud Technology',
  'Networking': 'AWS CP - Cloud Technology',
  'Security': 'AWS CP - Security & Compliance',
  'Architecture': 'AWS CP - Cloud Concepts',
  'Management': 'AWS CP - Billing & Pricing',
  'Monitoring': 'AWS CP - Security & Compliance',
  'Containers': 'AWS CP - Cloud Technology',
  'Analytics': 'AWS CP - Cloud Technology',
  'Application Integration': 'AWS CP - Cloud Technology',
  'Developer Tools': 'AWS CP - Cloud Technology',
  'Billing': 'AWS CP - Billing & Pricing',
};

// Maps for AZ-900 categories to exam domains
const AZ900_CATEGORY_MAP: Record<string, string> = {
  'Cloud Concepts': 'AZ-900 - Cloud Concepts',
  'Azure Architecture & Services': 'AZ-900 - Azure Architecture & Services',
  'Azure Management & Governance': 'AZ-900 - Management & Governance',
};

// Maps for GCDL advanced categories to GCDL domains
const GCDL_CATEGORY_MAP: Record<string, string> = {
  'Digital Transformation with Google Cloud': 'Digital Transformation with Google Cloud',
  'Exploring Data Transformation with Google Cloud': 'Exploring Data Transformation with Google Cloud',
  'Innovating with Google Cloud Artificial Intelligence': 'Innovating with Google Cloud Artificial Intelligence',
  'Modernize Infrastructure and Applications with Google Cloud': 'Modernize Infrastructure and Applications with Google Cloud',
  'Scaling with Google Cloud Operations': 'Scaling with Google Cloud Operations',
  'Trust and Security with Google Cloud': 'Trust and Security with Google Cloud',
};

async function main() {
  console.log('🌱 Starting comprehensive question import...');

  // ============================================
  // 1. Create domains for certifications that need them
  // ============================================

  const awsCP = await prisma.certification.findUnique({ where: { code: 'CLF-C02' } });
  const az900 = await prisma.certification.findUnique({ where: { code: 'AZ-900' } });
  const gcdl = await prisma.certification.findUnique({ where: { code: 'CLOUD-DIGITAL-LEADER' } });

  if (!awsCP || !az900 || !gcdl) {
    console.error('❌ Required certifications not found. Run seed-migration.ts first!');
    return;
  }

  console.log('📚 Creating/updating domains for AWS CP and AZ-900...');

  // AWS CP Domains
  const awsCpDomainIds: Record<string, string> = {};
  const awsCpDomains = [
    { name: 'AWS CP - Cloud Concepts', description: 'Understanding cloud computing concepts, cloud value proposition, and basic AWS global infrastructure.', weight: 25, order: 1 },
    { name: 'AWS CP - Cloud Technology', description: 'Core AWS services including compute, storage, database, and networking.', weight: 25, order: 2 },
    { name: 'AWS CP - Security & Compliance', description: 'AWS shared responsibility model, security services, and compliance programs.', weight: 25, order: 3 },
    { name: 'AWS CP - Billing & Pricing', description: 'AWS pricing models, cost management, and billing support.', weight: 25, order: 4 },
  ];

  for (const domain of awsCpDomains) {
    const existing = await prisma.domain.findFirst({
      where: { certificationId: awsCP.id, name: domain.name },
    });
    if (existing) {
      awsCpDomainIds[domain.name] = existing.id;
    } else {
      const created = await prisma.domain.create({
        data: { ...domain, certificationId: awsCP.id },
      });
      awsCpDomainIds[domain.name] = created.id;
    }
  }

  // AZ-900 Domains
  const az900DomainIds: Record<string, string> = {};
  const az900Domains = [
    { name: 'AZ-900 - Cloud Concepts', description: 'Cloud computing concepts, benefits, and deployment models.', weight: 30, order: 1 },
    { name: 'AZ-900 - Azure Architecture & Services', description: 'Azure core architecture services, compute, networking, storage, and databases.', weight: 40, order: 2 },
    { name: 'AZ-900 - Management & Governance', description: 'Azure governance, compliance, identity, and cost management.', weight: 30, order: 3 },
  ];

  for (const domain of az900Domains) {
    const existing = await prisma.domain.findFirst({
      where: { certificationId: az900.id, name: domain.name },
    });
    if (existing) {
      az900DomainIds[domain.name] = existing.id;
    } else {
      const created = await prisma.domain.create({
        data: { ...domain, certificationId: az900.id },
      });
      az900DomainIds[domain.name] = created.id;
    }
  }

  // Get GCDL domains by name for the gcp-cdl-additional-30.json categories
  const allGcdlDomains = await prisma.domain.findMany({
    where: { certificationId: gcdl.id },
  });
  const gcdlDomainMap: Record<string, string> = {};
  for (const d of allGcdlDomains) {
    if (d.name.includes('Digital Transformation')) gcdlDomainMap['Digital Transformation with Google Cloud'] = d.id;
    if (d.name.includes('Data')) gcdlDomainMap['Exploring Data Transformation with Google Cloud'] = d.id;
    if (d.name.includes('Data')) gcdlDomainMap['Innovating with Google Cloud Artificial Intelligence'] = d.id;
    if (d.name.includes('Infrastructure')) gcdlDomainMap['Modernize Infrastructure and Applications with Google Cloud'] = d.id;
    if (d.name.includes('Infrastructure')) gcdlDomainMap['Scaling with Google Cloud Operations'] = d.id;
    if (d.name.includes('Security')) gcdlDomainMap['Trust and Security with Google Cloud'] = d.id;
  }

  // ============================================
  // 2. Import AWS CP questions (aws-cp-50.json)
  // ============================================
  console.log('📝 Importing AWS Cloud Practitioner questions...');

  const awsCp50Questions = await loadJsonQuestions('aws-cp-50.json');
  const awsCpAdditionalQuestions = await loadJsonQuestions('aws-cp-additional-50.json');
  const awsCpStarterFile = await loadJsonQuestions('aws-cp-starter-20.json');

  const allAwsCpQuestions = [...awsCp50Questions, ...awsCpAdditionalQuestions, ...awsCpStarterFile];
  console.log(`   Found ${allAwsCpQuestions.length} total AWS CP questions to import`);

  let awsCpCreated = 0;
  for (const q of allAwsCpQuestions) {
    const domainName = AWS_CP_CATEGORY_MAP[q.category || ''] || 'AWS CP - Cloud Technology';
    const domainId = awsCpDomainIds[domainName];
    if (!domainId) {
      console.warn(`   ⚠️ No domain for category: ${q.category}`);
      continue;
    }

    const existing = await prisma.question.findFirst({
      where: { certificationId: awsCP.id, question: q.question },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.question.create({
      data: {
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
        difficulty: q.difficulty,
        questionType: q.correctAnswers.length > 1 ? 'MULTIPLE_CHOICE' : 'SINGLE_CHOICE',
        certificationId: awsCP.id,
        domainId,
        tags: q.tags ?? [],
        references: q.references ?? [],
      },
    });
    awsCpCreated++;
  }
  console.log(`   ✅ Created ${awsCpCreated} new AWS CP questions`);

  // ============================================
  // 3. Import AZ-900 questions (az-900-sample-20.json)
  // ============================================
  console.log('📝 Importing Azure Fundamentals questions...');

  const az900Questions = await loadJsonQuestions('az-900-sample-20.json');
  console.log(`   Found ${az900Questions.length} total AZ-900 questions to import`);

  let az900Created = 0;
  for (const q of az900Questions) {
    const domainName = AZ900_CATEGORY_MAP[q.category || ''] || 'AZ-900 - Cloud Concepts';
    const domainId = az900DomainIds[domainName];
    if (!domainId) {
      console.warn(`   ⚠️ No domain for category: ${q.category}`);
      continue;
    }

    const existing = await prisma.question.findFirst({
      where: { certificationId: az900.id, question: q.question },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.question.create({
      data: {
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
        difficulty: q.difficulty,
        questionType: q.correctAnswers.length > 1 ? 'MULTIPLE_CHOICE' : 'SINGLE_CHOICE',
        certificationId: az900.id,
        domainId,
        tags: q.tags ?? [],
        references: q.references ?? [],
      },
    });
    az900Created++;
  }
  console.log(`   ✅ Created ${az900Created} new AZ-900 questions`);

  // ============================================
  // 4. Import additional GCDL questions (gcp-cdl-additional-30.json)
  // ============================================
  console.log('📝 Importing additional GCDL questions...');

  const gcdlAdditionalQuestions = await loadJsonQuestions('gcp-cdl-additional-30.json');
  console.log(`   Found ${gcdlAdditionalQuestions.length} total GCDL questions to import`);

  let gcdlCreated = 0;
  for (const q of gcdlAdditionalQuestions) {
    const domainName = GCDL_CATEGORY_MAP[q.category || ''] || 'Digital Transformation with Google Cloud';
    const domainId = gcdlDomainMap[domainName];
    if (!domainId) {
      console.warn(`   ⚠️ No domain for category: ${q.category}`);
      continue;
    }

    const existing = await prisma.question.findFirst({
      where: { certificationId: gcdl.id, question: q.question },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.question.create({
      data: {
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
        difficulty: q.difficulty,
        questionType: q.correctAnswers.length > 1 ? 'MULTIPLE_CHOICE' : 'SINGLE_CHOICE',
        certificationId: gcdl.id,
        domainId,
        tags: q.tags ?? [],
        references: q.references ?? [],
      },
    });
    gcdlCreated++;
  }
  console.log(`   ✅ Created ${gcdlCreated} new GCDL questions`);

  // ============================================
  // Summary
  // ============================================
  console.log('\n📊 Import Summary:');
  console.log(`   - AWS Cloud Practitioner (CLF-C02): ${awsCpCreated} new questions`);
  console.log(`   - Azure Fundamentals (AZ-900): ${az900Created} new questions`);
  console.log(`   - Cloud Digital Leader (GCDL): ${gcdlCreated} new questions`);

  const totalQuestions = await prisma.question.count();
  console.log(`   - Total questions in database: ${totalQuestions}`);

  console.log('\n🎉 Question import completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error importing questions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
