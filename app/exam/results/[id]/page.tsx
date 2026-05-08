import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ResultsClient from './ResultsClient';

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const examAttempt = await prisma.examAttempt.findUnique({
    where: { id: params.id },
    include: {
      answers: {
        include: {
          question: true,
        },
      },
    },
  });

  if (!examAttempt || examAttempt.userId !== session.user.id) {
    redirect('/dashboard');
  }

  if (!examAttempt.completedAt) {
    redirect('/dashboard');
  }

  // Calculate category breakdown
  const categoryStats: Record<string, { correct: number; total: number }> = {};

  examAttempt.answers.forEach((answer) => {
    const category = answer.question.category;
    if (!categoryStats[category]) {
      categoryStats[category] = { correct: 0, total: 0 };
    }
    categoryStats[category].total++;
    if (answer.isCorrect) {
      categoryStats[category].correct++;
    }
  });

  return (
    <ResultsClient
      examAttempt={{
        id: examAttempt.id,
        score: examAttempt.score || 0,
        passed: examAttempt.passed,
        correctAnswers: examAttempt.correctAnswers || 0,
        totalQuestions: examAttempt.totalQuestions,
        timeSpent: examAttempt.timeSpent || 0,
        completedAt: examAttempt.completedAt.toISOString(),
      }}
      answers={examAttempt.answers.map((a) => ({
        id: a.id,
        isCorrect: a.isCorrect,
        selectedAnswers: a.selectedAnswers as string[],
        question: {
          id: a.question.id,
          question: a.question.question,
          options: a.question.options as any[],
          correctAnswers: a.question.correctAnswers as string[],
          explanation: a.question.explanation,
          category: a.question.category,
        },
      }))}
      categoryStats={categoryStats}
    />
  );
}
