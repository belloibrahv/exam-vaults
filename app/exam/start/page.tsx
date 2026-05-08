import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExamInterface from '../ExamInterface';
import { shuffleArray } from '@/lib/utils';

function isQuestionOption(value: unknown): value is { id: string; text: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'text' in value &&
    typeof value.id === 'string' &&
    typeof value.text === 'string'
  );
}

export default async function StartExamPage({
  searchParams,
}: {
  searchParams: { certificationId?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const certificationId = searchParams.certificationId;

  if (!certificationId) {
    redirect('/dashboard');
  }

  // Fetch the certification details
  const certification = await prisma.certification.findUnique({
    where: { id: certificationId },
    include: {
      provider: true,
      level: true,
    },
  });

  if (!certification) {
    redirect('/dashboard');
  }

  // Fetch questions for this certification
  const allQuestions = (
    await prisma.question.findMany({
      where: {
        certificationId: certificationId,
      },
    })
  ).map((q) => ({
    id: q.id,
    question: q.question,
    options: shuffleArray(Array.isArray(q.options) ? q.options.filter(isQuestionOption) : []),
    correctAnswers: Array.isArray(q.correctAnswers)
      ? q.correctAnswers.filter((answer): answer is string => typeof answer === 'string')
      : [],
    explanation: q.explanation,
    category: typeof q.category === 'string' ? q.category : 'UNCATEGORIZED',
    difficulty: String(q.difficulty),
    certificationId: q.certificationId,
  }));

  if (allQuestions.length === 0) {
    throw new Error(`No questions are available for ${certification.name}. Questions are being added soon.`);
  }

  // Check if user can take exam (2-hour cooldown after failed attempt)
  const lastAttempt = await prisma.examAttempt.findFirst({
    where: {
      userId: session.user.id,
      certificationId: certificationId,
    },
    orderBy: {
      startedAt: 'desc',
    },
  });

  if (lastAttempt && lastAttempt.completedAt && !lastAttempt.passed) {
    const now = new Date();
    const twoHoursLater = new Date(lastAttempt.completedAt.getTime() + 2 * 60 * 60 * 1000);

    if (now < twoHoursLater) {
      redirect('/dashboard');
    }
  }

  // Determine exam size based on certification level
  const examSize = certification.level.name === 'Foundational' ? 50 : 
                   certification.level.name === 'Associate' ? 60 :
                   certification.level.name === 'Professional' ? 75 : 90;

  // Randomly select questions (or all if less than exam size)
  const selectedQuestions = shuffleArray(allQuestions).slice(0, Math.min(examSize, allQuestions.length));

  // Create exam attempt
  const examAttempt = await prisma.examAttempt.create({
    data: {
      userId: session.user.id,
      certificationId: certificationId,
      totalQuestions: selectedQuestions.length,
    },
  });

  return (
    <ExamInterface
      examAttemptId={examAttempt.id}
      questions={selectedQuestions}
      userId={session.user.id}
    />
  );
}
