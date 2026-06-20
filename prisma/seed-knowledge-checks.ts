import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧠 Adding sample knowledge checks...');

  // Get a sample lesson to add knowledge checks to
  const lesson = await prisma.learningLesson.findFirst({
    where: {
      slug: 'intro-to-cloud-computing',
    },
  });

  if (!lesson) {
    console.log('❌ No lesson found to add knowledge checks to');
    return;
  }

  // Add knowledge checks for the intro-to-cloud-computing lesson
  const knowledgeChecks = [
    {
      lessonId: lesson.id,
      question: 'Which of the following is NOT one of the NIST five essential characteristics of cloud computing?',
      options: [
        { id: 'a', text: 'On-demand self-service' },
        { id: 'b', text: 'Broad network access' },
        { id: 'c', text: 'Dedicated physical servers' },
        { id: 'd', text: 'Resource pooling' },
      ],
      correctAnswer: 'c',
      explanation: 'Cloud computing uses shared, virtualized resources rather than dedicated physical servers. The NIST characteristics focus on virtualization and resource sharing.',
      order: 1,
    },
    {
      lessonId: lesson.id,
      question: 'What is the primary business advantage of moving from CapEx to OpEx spending model?',
      options: [
        { id: 'a', text: 'Higher upfront costs' },
        { id: 'b', text: 'Lower barriers to entry and pay-as-you-go flexibility' },
        { id: 'c', text: 'More predictable fixed costs' },
        { id: 'd', text: 'Better hardware ownership' },
      ],
      correctAnswer: 'b',
      explanation: 'The OpEx model reduces barriers to entry by eliminating large upfront investments and provides flexibility to scale costs with actual usage.',
      order: 2,
    },
    {
      lessonId: lesson.id,
      question: 'Which cost should be included when calculating Total Cost of Ownership (TCO) for on-premises infrastructure?',
      options: [
        { id: 'a', text: 'Only hardware purchase costs' },
        { id: 'b', text: 'Hardware, software licenses, and administration salaries' },
        { id: 'c', text: 'Hardware, software, administration, facilities, power, cooling, and security' },
        { id: 'd', text: 'Only monthly operational expenses' },
      ],
      correctAnswer: 'c',
      explanation: 'TCO includes all costs: direct costs (hardware, software) and indirect costs (facilities, power, cooling, security, administration). This comprehensive view is essential for accurate cloud vs. on-premises comparisons.',
      order: 3,
    },
  ];

  for (const checkData of knowledgeChecks) {
    await prisma.knowledgeCheck.create({
      data: checkData,
    });
    console.log(`✅ Created knowledge check: "${checkData.question.substring(0, 50)}..."`);
  }

  // Add knowledge checks for the second lesson too
  const lesson2 = await prisma.learningLesson.findFirst({
    where: {
      slug: 'cloud-service-deployment-models',
    },
  });

  if (lesson2) {
    const moreChecks = [
      {
        lessonId: lesson2.id,
        question: 'In which cloud service model does the provider manage everything up to the runtime, while you only manage application code and data?',
        options: [
          { id: 'a', text: 'Infrastructure as a Service (IaaS)' },
          { id: 'b', text: 'Platform as a Service (PaaS)' },
          { id: 'c', text: 'Software as a Service (SaaS)' },
          { id: 'd', text: 'Function as a Service (FaaS)' },
        ],
        correctAnswer: 'b',
        explanation: 'PaaS abstracts the infrastructure and runtime layers, allowing developers to focus only on their application code and data. Examples include App Engine and Cloud Run.',
        order: 1,
      },
      {
        lessonId: lesson2.id,
        question: 'What is a key benefit of microservices architecture over monolithic architecture?',
        options: [
          { id: 'a', text: 'Simpler deployment process' },
          { id: 'b', text: 'Single codebase management' },
          { id: 'c', text: 'Independent scaling and updating of individual services' },
          { id: 'd', text: 'Lower development complexity' },
        ],
        correctAnswer: 'c',
        explanation: 'Microservices allow each service to be scaled, updated, and deployed independently, providing greater flexibility and resilience compared to monolithic architectures.',
        order: 2,
      },
    ];

    for (const checkData of moreChecks) {
      await prisma.knowledgeCheck.create({
        data: checkData,
      });
      console.log(`✅ Created knowledge check: "${checkData.question.substring(0, 50)}..."`);
    }
  }

  console.log('🎯 Sample knowledge checks added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });