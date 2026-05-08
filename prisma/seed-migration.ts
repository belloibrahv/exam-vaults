import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting multi-cloud migration seed...');

  // ============================================
  // 1. CREATE PROVIDERS
  // ============================================
  console.log('📦 Creating cloud providers...');

  const aws = await prisma.provider.upsert({
    where: { name: 'AWS' },
    update: {},
    create: {
      name: 'AWS',
      displayName: 'Amazon Web Services',
      slug: 'aws',
      color: '#FF9900',
      description: 'Amazon Web Services (AWS) is the world\'s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.',
      website: 'https://aws.amazon.com/certification/',
      isActive: true,
      order: 1,
    },
  });

  const azure = await prisma.provider.upsert({
    where: { name: 'AZURE' },
    update: {},
    create: {
      name: 'AZURE',
      displayName: 'Microsoft Azure',
      slug: 'azure',
      color: '#0078D4',
      description: 'Microsoft Azure is a cloud computing platform with an ever-expanding set of services to help you build solutions to meet your business goals.',
      website: 'https://learn.microsoft.com/en-us/certifications/',
      isActive: true,
      order: 2,
    },
  });

  const gcp = await prisma.provider.upsert({
    where: { name: 'GCP' },
    update: {},
    create: {
      name: 'GCP',
      displayName: 'Google Cloud Platform',
      slug: 'gcp',
      color: '#4285F4',
      description: 'Google Cloud Platform lets you build, deploy, and scale applications, websites, and services on the same infrastructure as Google.',
      website: 'https://cloud.google.com/certification',
      isActive: true,
      order: 3,
    },
  });

  console.log('✅ Providers created');

  // ============================================
  // 2. CREATE CERTIFICATION LEVELS
  // ============================================
  console.log('📊 Creating certification levels...');

  const foundational = await prisma.certificationLevel.upsert({
    where: { name: 'FOUNDATIONAL' },
    update: {},
    create: {
      name: 'FOUNDATIONAL',
      displayName: 'Foundational',
      slug: 'foundational',
      order: 1,
      description: 'Entry-level certifications for cloud beginners with little to no experience.',
      color: '#10B981', // Green
    },
  });

  const associate = await prisma.certificationLevel.upsert({
    where: { name: 'ASSOCIATE' },
    update: {},
    create: {
      name: 'ASSOCIATE',
      displayName: 'Associate',
      slug: 'associate',
      order: 2,
      description: 'Intermediate certifications for professionals with 6-12 months of hands-on experience.',
      color: '#F59E0B', // Orange
    },
  });

  const professional = await prisma.certificationLevel.upsert({
    where: { name: 'PROFESSIONAL' },
    update: {},
    create: {
      name: 'PROFESSIONAL',
      displayName: 'Professional',
      slug: 'professional',
      order: 3,
      description: 'Advanced certifications for experienced cloud architects and engineers.',
      color: '#EF4444', // Red
    },
  });

  const specialty = await prisma.certificationLevel.upsert({
    where: { name: 'SPECIALTY' },
    update: {},
    create: {
      name: 'SPECIALTY',
      displayName: 'Specialty',
      slug: 'specialty',
      order: 4,
      description: 'Expert-level certifications focused on specific technical domains.',
      color: '#8B5CF6', // Purple
    },
  });

  const expert = await prisma.certificationLevel.upsert({
    where: { name: 'EXPERT' },
    update: {},
    create: {
      name: 'EXPERT',
      displayName: 'Expert',
      slug: 'expert',
      order: 5,
      description: 'Master-level certifications for senior architects and specialists.',
      color: '#DC2626', // Dark Red
    },
  });

  console.log('✅ Certification levels created');

  // ============================================
  // 3. CREATE AWS CERTIFICATIONS
  // ============================================
  console.log('☁️ Creating AWS certifications...');

  // AWS Foundational
  const awsCloudPractitioner = await prisma.certification.upsert({
    where: { code: 'CLF-C02' },
    update: {},
    create: {
      code: 'CLF-C02',
      name: 'Cloud Practitioner',
      fullName: 'AWS Certified Cloud Practitioner',
      slug: 'aws-cloud-practitioner',
      providerId: aws.id,
      levelId: foundational.id,
      description: 'Validates foundational, high-level understanding of AWS Cloud, services, and terminology. Perfect for individuals in technical, managerial, sales, purchasing, or financial roles.',
      examDuration: 90,
      questionCount: 65,
      passingScore: 70,
      examCost: 100,
      recommendedExp: '0-6 months',
      difficulty: 1,
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  });

  // AWS Associate
  const awsSAA = await prisma.certification.upsert({
    where: { code: 'SAA-C03' },
    update: {},
    create: {
      code: 'SAA-C03',
      name: 'Solutions Architect Associate',
      fullName: 'AWS Certified Solutions Architect - Associate',
      slug: 'aws-solutions-architect-associate',
      providerId: aws.id,
      levelId: associate.id,
      description: 'Validates ability to design and implement distributed systems on AWS. Most popular AWS certification for cloud engineers and solutions architects.',
      examDuration: 130,
      questionCount: 65,
      passingScore: 72,
      examCost: 150,
      prerequisites: ['CLF-C02'],
      recommendedExp: '1+ year',
      difficulty: 3,
      isActive: true,
      isFeatured: true,
      order: 2,
    },
  });

  const awsDeveloper = await prisma.certification.upsert({
    where: { code: 'DVA-C02' },
    update: {},
    create: {
      code: 'DVA-C02',
      name: 'Developer Associate',
      fullName: 'AWS Certified Developer - Associate',
      slug: 'aws-developer-associate',
      providerId: aws.id,
      levelId: associate.id,
      description: 'Validates proficiency in developing, deploying, and debugging cloud-based applications using AWS.',
      examDuration: 130,
      questionCount: 65,
      passingScore: 72,
      examCost: 150,
      recommendedExp: '1+ year',
      difficulty: 3,
      isActive: true,
      order: 3,
    },
  });

  const awsSysOps = await prisma.certification.upsert({
    where: { code: 'SOA-C02' },
    update: {},
    create: {
      code: 'SOA-C02',
      name: 'SysOps Administrator Associate',
      fullName: 'AWS Certified SysOps Administrator - Associate',
      slug: 'aws-sysops-administrator-associate',
      providerId: aws.id,
      levelId: associate.id,
      description: 'Validates technical expertise in deployment, management, and operations on AWS. Often considered the hardest Associate-level certification.',
      examDuration: 130,
      questionCount: 65,
      passingScore: 72,
      examCost: 150,
      recommendedExp: '1+ year',
      difficulty: 4,
      isActive: true,
      order: 4,
    },
  });

  // AWS Professional
  const awsSAPro = await prisma.certification.upsert({
    where: { code: 'SAP-C02' },
    update: {},
    create: {
      code: 'SAP-C02',
      name: 'Solutions Architect Professional',
      fullName: 'AWS Certified Solutions Architect - Professional',
      slug: 'aws-solutions-architect-professional',
      providerId: aws.id,
      levelId: professional.id,
      description: 'Validates advanced technical skills and experience in designing distributed applications and systems on AWS. Elite-level certification.',
      examDuration: 180,
      questionCount: 75,
      passingScore: 75,
      examCost: 300,
      prerequisites: ['SAA-C03'],
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      isFeatured: true,
      order: 5,
    },
  });

  const awsDevOpsPro = await prisma.certification.upsert({
    where: { code: 'DOP-C02' },
    update: {},
    create: {
      code: 'DOP-C02',
      name: 'DevOps Engineer Professional',
      fullName: 'AWS Certified DevOps Engineer - Professional',
      slug: 'aws-devops-engineer-professional',
      providerId: aws.id,
      levelId: professional.id,
      description: 'Validates technical expertise in provisioning, operating, and managing distributed application systems on AWS.',
      examDuration: 180,
      questionCount: 75,
      passingScore: 75,
      examCost: 300,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 6,
    },
  });

  // AWS Specialty
  await prisma.certification.upsert({
    where: { code: 'SCS-C02' },
    update: {},
    create: {
      code: 'SCS-C02',
      name: 'Security Specialty',
      fullName: 'AWS Certified Security - Specialty',
      slug: 'aws-security-specialty',
      providerId: aws.id,
      levelId: specialty.id,
      description: 'Validates expertise in securing AWS workloads and applications.',
      examDuration: 170,
      questionCount: 65,
      passingScore: 75,
      examCost: 300,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 7,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'ANS-C01' },
    update: {},
    create: {
      code: 'ANS-C01',
      name: 'Advanced Networking Specialty',
      fullName: 'AWS Certified Advanced Networking - Specialty',
      slug: 'aws-advanced-networking-specialty',
      providerId: aws.id,
      levelId: specialty.id,
      description: 'Validates advanced networking skills for complex AWS networking tasks.',
      examDuration: 170,
      questionCount: 65,
      passingScore: 75,
      examCost: 300,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 8,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'MLS-C01' },
    update: {},
    create: {
      code: 'MLS-C01',
      name: 'Machine Learning Specialty',
      fullName: 'AWS Certified Machine Learning - Specialty',
      slug: 'aws-machine-learning-specialty',
      providerId: aws.id,
      levelId: specialty.id,
      description: 'Validates ability to design, implement, deploy, and maintain machine learning solutions.',
      examDuration: 170,
      questionCount: 65,
      passingScore: 75,
      examCost: 300,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 9,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'DBS-C01' },
    update: {},
    create: {
      code: 'DBS-C01',
      name: 'Database Specialty',
      fullName: 'AWS Certified Database - Specialty',
      slug: 'aws-database-specialty',
      providerId: aws.id,
      levelId: specialty.id,
      description: 'Validates expertise in recommending, designing, and maintaining optimal AWS database solutions.',
      examDuration: 170,
      questionCount: 65,
      passingScore: 75,
      examCost: 300,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 10,
    },
  });

  console.log('✅ AWS certifications created (10)');

  // ============================================
  // 4. CREATE AZURE CERTIFICATIONS
  // ============================================
  console.log('☁️ Creating Azure certifications...');

  // Azure Fundamentals
  const azureFundamentals = await prisma.certification.upsert({
    where: { code: 'AZ-900' },
    update: {},
    create: {
      code: 'AZ-900',
      name: 'Azure Fundamentals',
      fullName: 'Microsoft Certified: Azure Fundamentals',
      slug: 'azure-fundamentals',
      providerId: azure.id,
      levelId: foundational.id,
      description: 'Validates foundational knowledge of cloud services and how those services are provided with Microsoft Azure.',
      examDuration: 60,
      questionCount: 50,
      passingScore: 70,
      examCost: 99,
      recommendedExp: '0-6 months',
      difficulty: 1,
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  });

  // Azure Associate
  const azureAdmin = await prisma.certification.upsert({
    where: { code: 'AZ-104' },
    update: {},
    create: {
      code: 'AZ-104',
      name: 'Azure Administrator',
      fullName: 'Microsoft Certified: Azure Administrator Associate',
      slug: 'azure-administrator-associate',
      providerId: azure.id,
      levelId: associate.id,
      description: 'Validates skills to implement, manage, and monitor an organization\'s Microsoft Azure environment.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 165,
      prerequisites: ['AZ-900'],
      recommendedExp: '6-12 months',
      difficulty: 4,
      isActive: true,
      isFeatured: true,
      order: 2,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'AZ-204' },
    update: {},
    create: {
      code: 'AZ-204',
      name: 'Azure Developer',
      fullName: 'Microsoft Certified: Azure Developer Associate',
      slug: 'azure-developer-associate',
      providerId: azure.id,
      levelId: associate.id,
      description: 'Validates skills to design, build, test, and maintain cloud applications and services on Microsoft Azure.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 165,
      recommendedExp: '1+ year',
      difficulty: 3,
      isActive: true,
      order: 3,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'AZ-500' },
    update: {},
    create: {
      code: 'AZ-500',
      name: 'Azure Security Engineer',
      fullName: 'Microsoft Certified: Azure Security Engineer Associate',
      slug: 'azure-security-engineer-associate',
      providerId: azure.id,
      levelId: associate.id,
      description: 'Validates skills to implement security controls and threat protection, manage identity and access.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 165,
      recommendedExp: '1+ year',
      difficulty: 4,
      isActive: true,
      order: 4,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'DP-203' },
    update: {},
    create: {
      code: 'DP-203',
      name: 'Azure Data Engineer',
      fullName: 'Microsoft Certified: Azure Data Engineer Associate',
      slug: 'azure-data-engineer-associate',
      providerId: azure.id,
      levelId: associate.id,
      description: 'Validates skills to integrate, transform, and consolidate data from various structured and unstructured data systems.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 165,
      recommendedExp: '1+ year',
      difficulty: 4,
      isActive: true,
      order: 5,
    },
  });

  // Azure Expert
  await prisma.certification.upsert({
    where: { code: 'AZ-305' },
    update: {},
    create: {
      code: 'AZ-305',
      name: 'Azure Solutions Architect',
      fullName: 'Microsoft Certified: Azure Solutions Architect Expert',
      slug: 'azure-solutions-architect-expert',
      providerId: azure.id,
      levelId: expert.id,
      description: 'Validates advanced skills to design solutions that run on Azure, including compute, network, storage, and security.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 165,
      prerequisites: ['AZ-104'],
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      isFeatured: true,
      order: 6,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'AZ-400' },
    update: {},
    create: {
      code: 'AZ-400',
      name: 'DevOps Engineer',
      fullName: 'Microsoft Certified: DevOps Engineer Expert',
      slug: 'azure-devops-engineer-expert',
      providerId: azure.id,
      levelId: expert.id,
      description: 'Validates skills to combine people, process, and technologies to continuously deliver valuable products and services.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 165,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 7,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'AI-102' },
    update: {},
    create: {
      code: 'AI-102',
      name: 'Azure AI Engineer',
      fullName: 'Microsoft Certified: Azure AI Engineer Associate',
      slug: 'azure-ai-engineer-associate',
      providerId: azure.id,
      levelId: associate.id,
      description: 'Validates skills to design and implement AI solutions using Azure Cognitive Services, Azure Cognitive Search, and Microsoft Bot Framework.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 165,
      recommendedExp: '1+ year',
      difficulty: 4,
      isActive: true,
      order: 8,
    },
  });

  console.log('✅ Azure certifications created (8)');

  // ============================================
  // 5. CREATE GCP CERTIFICATIONS
  // ============================================
  console.log('☁️ Creating GCP certifications...');

  // GCP Foundational
  const gcpDigitalLeader = await prisma.certification.upsert({
    where: { code: 'CLOUD-DIGITAL-LEADER' },
    update: {},
    create: {
      code: 'CLOUD-DIGITAL-LEADER',
      name: 'Cloud Digital Leader',
      fullName: 'Google Cloud Digital Leader',
      slug: 'gcp-cloud-digital-leader',
      providerId: gcp.id,
      levelId: foundational.id,
      description: 'Validates foundational knowledge of cloud concepts and Google Cloud products and services.',
      examDuration: 90,
      questionCount: 55,
      passingScore: 70,
      examCost: 99,
      recommendedExp: '0-6 months',
      difficulty: 1,
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  });

  // GCP Associate
  const gcpAssociateCloudEngineer = await prisma.certification.upsert({
    where: { code: 'ASSOCIATE-CLOUD-ENGINEER' },
    update: {},
    create: {
      code: 'ASSOCIATE-CLOUD-ENGINEER',
      name: 'Associate Cloud Engineer',
      fullName: 'Google Cloud Associate Cloud Engineer',
      slug: 'gcp-associate-cloud-engineer',
      providerId: gcp.id,
      levelId: associate.id,
      description: 'Validates ability to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 125,
      prerequisites: ['CLOUD-DIGITAL-LEADER'],
      recommendedExp: '6-12 months',
      difficulty: 4,
      isActive: true,
      isFeatured: true,
      order: 2,
    },
  });

  // GCP Professional
  await prisma.certification.upsert({
    where: { code: 'PROFESSIONAL-CLOUD-ARCHITECT' },
    update: {},
    create: {
      code: 'PROFESSIONAL-CLOUD-ARCHITECT',
      name: 'Professional Cloud Architect',
      fullName: 'Google Cloud Professional Cloud Architect',
      slug: 'gcp-professional-cloud-architect',
      providerId: gcp.id,
      levelId: professional.id,
      description: 'One of the most respected cloud certifications globally. Validates ability to design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 200,
      prerequisites: ['ASSOCIATE-CLOUD-ENGINEER'],
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      isFeatured: true,
      order: 3,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'PROFESSIONAL-DATA-ENGINEER' },
    update: {},
    create: {
      code: 'PROFESSIONAL-DATA-ENGINEER',
      name: 'Professional Data Engineer',
      fullName: 'Google Cloud Professional Data Engineer',
      slug: 'gcp-professional-data-engineer',
      providerId: gcp.id,
      levelId: professional.id,
      description: 'Validates ability to design, build, operationalize, secure, and monitor data processing systems.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 200,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 4,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'PROFESSIONAL-CLOUD-SECURITY-ENGINEER' },
    update: {},
    create: {
      code: 'PROFESSIONAL-CLOUD-SECURITY-ENGINEER',
      name: 'Professional Cloud Security Engineer',
      fullName: 'Google Cloud Professional Cloud Security Engineer',
      slug: 'gcp-professional-cloud-security-engineer',
      providerId: gcp.id,
      levelId: professional.id,
      description: 'Validates ability to design and implement a secure infrastructure on Google Cloud Platform.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 200,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 5,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'PROFESSIONAL-MACHINE-LEARNING-ENGINEER' },
    update: {},
    create: {
      code: 'PROFESSIONAL-MACHINE-LEARNING-ENGINEER',
      name: 'Professional Machine Learning Engineer',
      fullName: 'Google Cloud Professional Machine Learning Engineer',
      slug: 'gcp-professional-machine-learning-engineer',
      providerId: gcp.id,
      levelId: professional.id,
      description: 'Validates ability to design, build, and productionize ML models to solve business challenges using Google Cloud technologies.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 200,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 6,
    },
  });

  await prisma.certification.upsert({
    where: { code: 'PROFESSIONAL-CLOUD-DEVOPS-ENGINEER' },
    update: {},
    create: {
      code: 'PROFESSIONAL-CLOUD-DEVOPS-ENGINEER',
      name: 'Professional Cloud DevOps Engineer',
      fullName: 'Google Cloud Professional Cloud DevOps Engineer',
      slug: 'gcp-professional-cloud-devops-engineer',
      providerId: gcp.id,
      levelId: professional.id,
      description: 'Validates ability to implement processes throughout the system development lifecycle using Google-recommended methodologies and tools.',
      examDuration: 120,
      questionCount: 50,
      passingScore: 70,
      examCost: 200,
      recommendedExp: '2+ years',
      difficulty: 5,
      isActive: true,
      order: 7,
    },
  });

  console.log('✅ GCP certifications created (7)');

  // ============================================
  // 6. CREATE DOMAINS FOR GCDL (EXISTING CERT)
  // ============================================
  console.log('📚 Creating domains for GCDL...');

  await prisma.domain.upsert({
    where: { id: 'gcdl-domain-1' },
    update: {},
    create: {
      id: 'gcdl-domain-1',
      name: 'Digital Transformation with Google Cloud',
      description: 'Understanding cloud concepts, business value, and transformation strategies',
      weight: 25,
      order: 1,
      certificationId: gcpDigitalLeader.id,
    },
  });

  await prisma.domain.upsert({
    where: { id: 'gcdl-domain-2' },
    update: {},
    create: {
      id: 'gcdl-domain-2',
      name: 'Innovating with Data and Google Cloud',
      description: 'Data management, analytics, and machine learning solutions',
      weight: 25,
      order: 2,
      certificationId: gcpDigitalLeader.id,
    },
  });

  await prisma.domain.upsert({
    where: { id: 'gcdl-domain-3' },
    update: {},
    create: {
      id: 'gcdl-domain-3',
      name: 'Infrastructure and Application Modernization',
      description: 'Compute, storage, networking, and application deployment',
      weight: 25,
      order: 3,
      certificationId: gcpDigitalLeader.id,
    },
  });

  await prisma.domain.upsert({
    where: { id: 'gcdl-domain-4' },
    update: {},
    create: {
      id: 'gcdl-domain-4',
      name: 'Understanding Google Cloud Security and Operations',
      description: 'IAM, compliance, monitoring, and operational excellence',
      weight: 25,
      order: 4,
      certificationId: gcpDigitalLeader.id,
    },
  });

  console.log('✅ GCDL domains created');

  console.log('\n🎉 Multi-cloud migration seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - 3 Cloud Providers (AWS, Azure, GCP)');
  console.log('   - 5 Certification Levels');
  console.log('   - 25 Total Certifications');
  console.log('     • AWS: 10 certifications');
  console.log('     • Azure: 8 certifications');
  console.log('     • GCP: 7 certifications');
  console.log('   - 4 Domains for GCDL');
  console.log('\n✅ Database is ready for multi-cloud exam system!');
}

main()
  .catch((e) => {
    console.error('❌ Error during migration seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
