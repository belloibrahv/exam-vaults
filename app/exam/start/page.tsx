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

function getCertificationId(value: unknown): string | null {
  if (
    typeof value === 'object' &&
    value !== null &&
    'certificationId' in value &&
    typeof value.certificationId === 'string'
  ) {
    return value.certificationId;
  }

  return null;
}

export default async function StartExamPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Normalize Prisma JSON fields into the UI shape expected by the client component.
  const allQuestions = (await prisma.question.findMany()).map((q) => ({
    id: q.id,
    question: q.question,
    options: shuffleArray(Array.isArray(q.options) ? q.options.filter(isQuestionOption) : []),
    correctAnswers: Array.isArray(q.correctAnswers)
      ? q.correctAnswers.filter((answer): answer is string => typeof answer === 'string')
      : [],
    explanation: q.explanation,
    category: typeof q.category === 'string' ? q.category : 'UNCATEGORIZED',
    difficulty: String(q.difficulty),
    certificationId: getCertificationId(q),
  }));

  if (allQuestions.length === 0) {
    throw new Error('No questions are available for this exam.');
  }

  // Check if user can take exam
  const lastAttempt = await prisma.examAttempt.findFirst({
    where: {
      userId: session.user.id,
      ...(allQuestions[0].certificationId
        ? { certificationId: allQuestions[0].certificationId }
        : {}),
    } as Record<string, string>,
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

  // Randomly select 55 questions (typical GCDL exam size)
  const questionsWithShuffledOptions = shuffleArray(allQuestions).slice(0, 55);

  // Create exam attempt
  const examAttemptData = {
    userId: session.user.id,
    totalQuestions: questionsWithShuffledOptions.length,
    ...(allQuestions[0].certificationId
      ? { certificationId: allQuestions[0].certificationId }
      : {}),
  };

  const examAttempt = await prisma.examAttempt.create({
    data: examAttemptData as never,
  });

  return (
    <ExamInterface
      examAttemptId={examAttempt.id}
      questions={questionsWithShuffledOptions}
      userId={session.user.id}
    />
  );
}
