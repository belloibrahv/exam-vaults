import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { examAttemptId, answers, timeSpent } = await req.json();

    // Verify exam attempt belongs to user
    const examAttempt = await prisma.examAttempt.findUnique({
      where: { id: examAttemptId },
    });

    if (!examAttempt || examAttempt.userId !== session.user.id) {
      return NextResponse.json({ error: 'Invalid exam attempt' }, { status: 400 });
    }

    if (examAttempt.completedAt) {
      return NextResponse.json({ error: 'Exam already submitted' }, { status: 400 });
    }

    // Calculate score
    let correctCount = 0;
    const answerRecords = [];

    for (const answer of answers) {
      const { questionId, selectedAnswers, correctAnswers } = answer;

      // Check if answer is correct (must match all correct answers)
      const isCorrect =
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every((a: string) => correctAnswers.includes(a)) &&
        correctAnswers.every((a: string) => selectedAnswers.includes(a));

      if (isCorrect) {
        correctCount++;
      }

      answerRecords.push({
        examAttemptId,
        questionId,
        selectedAnswers,
        isCorrect,
      });
    }

    const totalQuestions = answers.length;
    const score = (correctCount / totalQuestions) * 100;
    const passed = score >= 70;

    // Update exam attempt
    const completedAt = new Date();
    const canRetakeAt = passed ? null : new Date(completedAt.getTime() + 2 * 60 * 60 * 1000);

    await prisma.examAttempt.update({
      where: { id: examAttemptId },
      data: {
        completedAt,
        timeSpent,
        score,
        correctAnswers: correctCount,
        passed,
        canRetakeAt,
      },
    });

    // Create answer records
    await prisma.answer.createMany({
      data: answerRecords,
    });

    return NextResponse.json({
      success: true,
      score,
      passed,
      correctCount,
      totalQuestions,
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
