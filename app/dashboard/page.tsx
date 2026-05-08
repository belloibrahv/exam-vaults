import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch user's exam attempts
  const examAttempts = await prisma.examAttempt.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      startedAt: 'desc',
    },
    take: 10,
  });

  // Get total questions count
  const totalQuestions = await prisma.question.count();

  // Calculate statistics
  const completedAttempts = examAttempts.filter((a) => a.completedAt);
  const passedAttempts = completedAttempts.filter((a) => a.passed);
  const averageScore =
    completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length
      : 0;

  // Check if user can take exam
  const lastAttempt = examAttempts[0];
  let canTakeExam = true;
  let retakeMessage = '';
  let timeRemaining = '';

  if (lastAttempt && lastAttempt.completedAt && !lastAttempt.passed) {
    const now = new Date();
    const twoHoursLater = new Date(lastAttempt.completedAt.getTime() + 2 * 60 * 60 * 1000);

    if (now < twoHoursLater) {
      canTakeExam = false;
      const diff = twoHoursLater.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      timeRemaining = `${hours}h ${minutes}m`;
      retakeMessage = 'You must wait 2 hours before retaking the exam after a failed attempt.';
    }
  }

  return (
    <DashboardClient
      user={session.user}
      examAttempts={examAttempts}
      stats={{
        totalAttempts: examAttempts.length,
        completedAttempts: completedAttempts.length,
        passedAttempts: passedAttempts.length,
        averageScore: Math.round(averageScore),
        totalQuestions,
      }}
      canTakeExam={canTakeExam}
      retakeMessage={retakeMessage}
      timeRemaining={timeRemaining}
    />
  );
}
