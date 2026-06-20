import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const submitAnswerSchema = z.object({
  knowledgeCheckId: z.string(),
  selectedAnswer: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });
    }

    const knowledgeChecks = await prisma.knowledgeCheck.findMany({
      where: { lessonId },
      include: {
        userAnswers: {
          where: { userId: session.user.id },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(knowledgeChecks);
  } catch (error) {
    console.error('Error fetching knowledge checks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { knowledgeCheckId, selectedAnswer } = submitAnswerSchema.parse(body);

    // Get the knowledge check
    const knowledgeCheck = await prisma.knowledgeCheck.findUnique({
      where: { id: knowledgeCheckId },
    });

    if (!knowledgeCheck) {
      return NextResponse.json({ error: 'Knowledge check not found' }, { status: 404 });
    }

    const isCorrect = selectedAnswer === knowledgeCheck.correctAnswer;

    // Upsert user answer
    const userAnswer = await prisma.userKnowledgeCheckAnswer.upsert({
      where: {
        userId_knowledgeCheckId: {
          userId: session.user.id,
          knowledgeCheckId,
        },
      },
      update: {
        selectedAnswer,
        isCorrect,
      },
      create: {
        userId: session.user.id,
        knowledgeCheckId,
        selectedAnswer,
        isCorrect,
      },
    });

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: knowledgeCheck.correctAnswer,
      explanation: knowledgeCheck.explanation,
      userAnswer,
    });
  } catch (error) {
    console.error('Error submitting knowledge check answer:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}