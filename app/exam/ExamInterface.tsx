'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import TechvaultsLogo from '@/components/TechvaultsLogo';
import { formatTime } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswers: string[];
  explanation: string;
  category: string;
  difficulty: string;
}

interface ExamInterfaceProps {
  examAttemptId: string;
  questions: Question[];
  userId: string;
}

export default function ExamInterface({
  examAttemptId,
  questions,
  userId,
}: ExamInterfaceProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isMultipleSelect = currentQuestion.correctAnswers.length > 1;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleAnswerSelect = (optionId: string) => {
    const currentAnswers = answers[currentQuestionIndex] || [];

    if (isMultipleSelect) {
      // Multiple select: toggle selection
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter((id) => id !== optionId)
        : [...currentAnswers, optionId];
      setAnswers({ ...answers, [currentQuestionIndex]: newAnswers });
    } else {
      // Single select: replace selection
      setAnswers({ ...answers, [currentQuestionIndex]: [optionId] });
    }
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestionIndex)) {
      newFlagged.delete(currentQuestionIndex);
    } else {
      newFlagged.add(currentQuestionIndex);
    }
    setFlagged(newFlagged);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examAttemptId,
          answers: questions.map((q, index) => ({
            questionId: q.id,
            selectedAnswers: answers[index] || [],
            correctAnswers: q.correctAnswers,
          })),
          timeSpent: 90 * 60 - timeRemaining,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/exam/results/${examAttemptId}`);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Error submitting exam. Please try again.');
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-techvaults-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-techvaults-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TechvaultsLogo size={32} />
              <div>
                <h1 className="text-lg font-bold text-techvaults-black">
                  GCDL Practice Exam
                </h1>
                <p className="text-xs text-techvaults-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock
                  className={`w-5 h-5 ${
                    timeRemaining < 600 ? 'text-techvaults-red' : 'text-techvaults-gray-600'
                  }`}
                />
                <span
                  className={`text-lg font-bold ${
                    timeRemaining < 600 ? 'text-techvaults-red' : 'text-techvaults-black'
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="px-6 py-2 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 flex gap-6">
        {/* Main Question Area */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-techvaults-gray-200">
          {/* Question */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-techvaults-red/10 text-techvaults-red text-xs font-semibold rounded-full">
                    {currentQuestion.category.replace(/_/g, ' ')}
                  </span>
                  {isMultipleSelect && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                      Multiple Select
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-techvaults-black leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>
              <button
                onClick={toggleFlag}
                className={`ml-4 p-2 rounded-lg transition-all ${
                  flagged.has(currentQuestionIndex)
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'text-techvaults-gray-400 hover:bg-techvaults-gray-100'
                }`}
                title="Flag for review"
              >
                <Flag className="w-5 h-5" fill={flagged.has(currentQuestionIndex) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {isMultipleSelect && (
              <p className="text-sm text-techvaults-gray-600 mb-4">
                Select all that apply
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option) => {
              const isSelected = (answers[currentQuestionIndex] || []).includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-techvaults-red bg-techvaults-red/5'
                      : 'border-techvaults-gray-200 hover:border-techvaults-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        isSelected
                          ? 'border-techvaults-red bg-techvaults-red'
                          : 'border-techvaults-gray-300'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-techvaults-gray-700 mr-2">
                        {option.id.toUpperCase()}.
                      </span>
                      <span className="text-techvaults-gray-900">{option.text}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-techvaults-gray-200">
            <button
              onClick={() => goToQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 border-2 border-techvaults-gray-300 text-techvaults-gray-700 rounded-lg font-semibold hover:border-techvaults-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={() => goToQuestion(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Navigator Sidebar */}
        <div className="w-80 bg-white rounded-xl shadow-lg p-6 border border-techvaults-gray-200 h-fit sticky top-24">
          <h3 className="text-lg font-bold text-techvaults-black mb-4">Question Navigator</h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-techvaults-gray-600">Answered:</span>
              <span className="font-semibold text-green-600">{answeredCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-techvaults-gray-600">Unanswered:</span>
              <span className="font-semibold text-techvaults-red">{unansweredCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-techvaults-gray-600">Flagged:</span>
              <span className="font-semibold text-yellow-600">{flagged.size}</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
            {questions.map((_, index) => {
              const isAnswered = !!answers[index];
              const isFlagged = flagged.has(index);
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`aspect-square rounded-lg font-semibold text-sm transition-all relative ${
                    isCurrent
                      ? 'bg-techvaults-red text-white ring-2 ring-techvaults-red ring-offset-2'
                      : isAnswered
                      ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100'
                      : 'bg-techvaults-gray-100 text-techvaults-gray-600 border-2 border-techvaults-gray-200 hover:bg-techvaults-gray-200'
                  }`}
                >
                  {index + 1}
                  {isFlagged && (
                    <Flag
                      className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500"
                      fill="currentColor"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-techvaults-black mb-4">Submit Exam?</h3>
            
            {unansweredCount > 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">
                    You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Unanswered questions will be marked as incorrect.
                  </p>
                </div>
              </div>
            )}

            <p className="text-techvaults-gray-600 mb-6">
              Are you sure you want to submit your exam? You won't be able to change your answers
              after submission.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                disabled={submitting}
                className="flex-1 px-6 py-3 border-2 border-techvaults-gray-300 text-techvaults-gray-700 rounded-lg font-semibold hover:border-techvaults-gray-400 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
