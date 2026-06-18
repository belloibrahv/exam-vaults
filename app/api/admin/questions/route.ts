import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Difficulty, QuestionType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      question,
      options,
      correctAnswers,
      explanation,
      certificationId,
      domainId,
      difficulty,
      questionType,
      category,
      tags,
      references,
    } = body;

    // Basic validation
    if (!question || !options || !correctAnswers || !explanation || !certificationId) {
      return NextResponse.json(
        { error: 'Missing required fields: question, options, correctAnswers, explanation, and certificationId are required.' },
        { status: 400 }
      );
    }

    // Validate enum values if provided
    let difficultyValue: Difficulty = Difficulty.MEDIUM;
    if (difficulty && Object.values(Difficulty).includes(difficulty as Difficulty)) {
      difficultyValue = difficulty as Difficulty;
    }

    let typeValue: QuestionType = QuestionType.SINGLE_CHOICE;
    if (questionType && Object.values(QuestionType).includes(questionType as QuestionType)) {
      typeValue = questionType as QuestionType;
    }

    const newQuestion = await prisma.question.create({
      data: {
        question,
        options, // expected to be Array<{id: string, text: string}>
        correctAnswers, // expected to be Array<string>
        explanation,
        certificationId,
        domainId: domainId || null,
        difficulty: difficultyValue,
        questionType: typeValue,
        category: category || null,
        tags: tags || null,
        references: references || null,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
