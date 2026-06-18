import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExamInterface from '../ExamInterface';
import { shuffleArray } from '@/lib/utils';

type ExamQuestion = {
  id: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswers: string[];
  explanation: string;
  category: string;
  difficulty: string;
  certificationId: string;
};

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

function selectQuestionsForExam(
  questions: ExamQuestion[],
  targetCount: number
): ExamQuestion[] {
  if (questions.length <= targetCount) {
    return shuffleArray(questions);
  }

  // Harder exam profile: emphasize MEDIUM/HARD, cap EASY.
  const hardPool = shuffleArray(questions.filter((q) => q.difficulty === 'HARD'));
  const mediumPool = shuffleArray(questions.filter((q) => q.difficulty === 'MEDIUM'));
  const easyPool = shuffleArray(questions.filter((q) => q.difficulty === 'EASY'));
  const otherPool = shuffleArray(
    questions.filter(
      (q) =>
        q.difficulty !== 'HARD' && q.difficulty !== 'MEDIUM' && q.difficulty !== 'EASY'
    )
  );

  const hardTarget = Math.round(targetCount * 0.4);
  const mediumTarget = Math.round(targetCount * 0.45);
  const easyTarget = Math.max(0, targetCount - hardTarget - mediumTarget);

  const selected: ExamQuestion[] = [];
  selected.push(...hardPool.splice(0, hardTarget));
  selected.push(...mediumPool.splice(0, mediumTarget));
  selected.push(...easyPool.splice(0, easyTarget));

  // Backfill any shortfall from remaining pools (hard -> medium -> easy -> other).
  const remainingNeeded = targetCount - selected.length;
  if (remainingNeeded > 0) {
    const backfillPool = shuffleArray([
      ...hardPool,
      ...mediumPool,
      ...easyPool,
      ...otherPool,
    ]);
    selected.push(...backfillPool.slice(0, remainingNeeded));
  }

  return shuffleArray(selected);
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

  if (session.user.role === 'ADMIN') {
    redirect('/admin');
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

  // Enforce mastery-based learning lock
  const totalLessonsCount = await prisma.learningLesson.count({
    where: {
      module: {
        certificationId: certificationId,
      },
    },
  });

  if (totalLessonsCount > 0) {
    const completedLessonsCount = await prisma.userLessonProgress.count({
      where: {
        userId: session.user.id,
        completed: true,
        lesson: {
          module: {
            certificationId: certificationId,
          },
        },
      },
    });

    if (completedLessonsCount < totalLessonsCount) {
      redirect(`/learning/${certification.slug}?error=locked`);
    }
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

  // Select a harder balanced mix, then reshuffle final order per attempt.
  const selectedQuestions = selectQuestionsForExam(
    allQuestions,
    Math.min(examSize, allQuestions.length)
  );

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
