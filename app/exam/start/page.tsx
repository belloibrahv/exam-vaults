import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExamInterface from '../ExamInterface';
import { shuffleArray } from '@/lib/utils';

export default async function StartExamPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user can take exam
  const lastAttempt = await prisma.examAttempt.findFirst({
    where: {
      userId: session.user.id,
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

  // Get all questions
  const allQuestions = await prisma.question.findMany();

  // Randomly select 55 questions (typical GCDL exam size)
  const selectedQuestions = shuffleArray(allQuestions).slice(0, 55);

  // Shuffle options for each question
  const questionsWithShuffledOptions = selectedQuestions.map((q) => ({
    ...q,
    options: shuffleArray(q.options as any[]),
  }));

  // Create exam attempt
  const examAttempt = await prisma.examAttempt.create({
    data: {
      userId: session.user.id,
      totalQuestions: questionsWithShuffledOptions.length,
    },
  });

  return (
    <ExamInterface
      examAttemptId={examAttempt.id}
      questions={questionsWithShuffledOptions}
      userId={session.user.id}
    />
  );
}
