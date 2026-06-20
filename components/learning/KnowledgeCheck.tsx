'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';

interface KnowledgeCheckData {
  id: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  explanation?: string;
  order: number;
  userAnswers: Array<{
    selectedAnswer: string;
    isCorrect: boolean;
  }>;
}

interface KnowledgeCheckProps {
  lessonId: string;
}

export default function KnowledgeCheck({ lessonId }: KnowledgeCheckProps) {
  const [knowledgeChecks, setKnowledgeChecks] = useState<KnowledgeCheckData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchKnowledgeChecks = async () => {
    try {
      const response = await fetch(`/api/learning/knowledge-checks?lessonId=${lessonId}`);
      if (response.ok) {
        const checks = await response.json();
        setKnowledgeChecks(checks);
        
        // If user has already answered this check, show result
        const currentCheck = checks[currentCheckIndex];
        if (currentCheck?.userAnswers?.length > 0) {
          const userAnswer = currentCheck.userAnswers[0];
          setSelectedAnswer(userAnswer.selectedAnswer);
          setSubmittedAnswer({
            isCorrect: userAnswer.isCorrect,
            correctAnswer: currentCheck.correctAnswer,
            explanation: currentCheck.explanation,
          });
          setShowResult(true);
        }
      }
    } catch (error) {
      console.error('Error fetching knowledge checks:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer) return;

    const currentCheck = knowledgeChecks[currentCheckIndex];
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/learning/knowledge-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knowledgeCheckId: currentCheck.id,
          selectedAnswer,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmittedAnswer(result);
        setShowResult(true);
        
        // Update local state
        setKnowledgeChecks(prev => prev.map(check => 
          check.id === currentCheck.id 
            ? {
                ...check,
                userAnswers: [{
                  selectedAnswer,
                  isCorrect: result.isCorrect,
                }],
              }
            : check
        ));
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentCheckIndex < knowledgeChecks.length - 1) {
      setCurrentCheckIndex(prev => prev + 1);
      resetState();
    }
  };

  const previousQuestion = () => {
    if (currentCheckIndex > 0) {
      setCurrentCheckIndex(prev => prev - 1);
      resetState();
    }
  };

  const resetState = () => {
    setSelectedAnswer('');
    setShowResult(false);
    setSubmittedAnswer(null);
    
    // Check if user has already answered the new current question
    const currentCheck = knowledgeChecks[currentCheckIndex === 0 ? 1 : currentCheckIndex - 1];
    if (currentCheck?.userAnswers?.length > 0) {
      const userAnswer = currentCheck.userAnswers[0];
      setSelectedAnswer(userAnswer.selectedAnswer);
      setSubmittedAnswer({
        isCorrect: userAnswer.isCorrect,
        correctAnswer: currentCheck.correctAnswer,
        explanation: currentCheck.explanation,
      });
      setShowResult(true);
    }
  };

  const tryAgain = () => {
    setSelectedAnswer('');
    setShowResult(false);
    setSubmittedAnswer(null);
  };

  useEffect(() => {
    fetchKnowledgeChecks();
  }, [lessonId]);

  useEffect(() => {
    // Check if the current question has been answered
    const currentCheck = knowledgeChecks[currentCheckIndex];
    if (currentCheck?.userAnswers?.length > 0) {
      const userAnswer = currentCheck.userAnswers[0];
      setSelectedAnswer(userAnswer.selectedAnswer);
      setSubmittedAnswer({
        isCorrect: userAnswer.isCorrect,
        correctAnswer: currentCheck.correctAnswer,
        explanation: currentCheck.explanation,
      });
      setShowResult(true);
    } else {
      resetState();
    }
  }, [currentCheckIndex, knowledgeChecks]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 my-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (knowledgeChecks.length === 0) {
    return null;
  }

  const currentCheck = knowledgeChecks[currentCheckIndex];
  if (!currentCheck) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 my-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Knowledge Check</h3>
            <p className="text-sm text-gray-600">
              Question {currentCheckIndex + 1} of {knowledgeChecks.length}
            </p>
          </div>
        </div>
        
        {knowledgeChecks.length > 1 && (
          <div className="flex space-x-2">
            <button
              onClick={previousQuestion}
              disabled={currentCheckIndex === 0}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentCheckIndex === knowledgeChecks.length - 1}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {currentCheck.question}
        </h4>

        <div className="space-y-3 mb-6">
          {currentCheck.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = showResult && option.id === submittedAnswer?.correctAnswer;
            const isWrong = showResult && isSelected && !submittedAnswer?.isCorrect;

            return (
              <motion.button
                key={option.id}
                onClick={() => !showResult && setSelectedAnswer(option.id)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  showResult
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : isWrong
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                    : isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
                whileHover={!showResult ? { scale: 1.02 } : undefined}
                whileTap={!showResult ? { scale: 0.98 } : undefined}
              >
                <div className="flex items-center justify-between">
                  <span>{option.text}</span>
                  {showResult && (
                    <>
                      {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {isWrong && <XCircle className="w-5 h-5 text-red-600" />}
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && submittedAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-4 ${
                submittedAnswer.isCorrect
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-red-100 border border-red-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {submittedAnswer.isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Incorrect</span>
                  </>
                )}
              </div>
              
              {submittedAnswer.explanation && (
                <div className="flex items-start space-x-2 mt-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{submittedAnswer.explanation}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          {!showResult ? (
            <button
              onClick={submitAnswer}
              disabled={!selectedAnswer || isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Checking...
                </>
              ) : (
                'Submit Answer'
              )}
            </button>
          ) : (
            <button
              onClick={tryAgain}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}

          <div className="text-sm text-gray-500">
            Progress: {knowledgeChecks.filter(check => check.userAnswers?.length > 0).length} / {knowledgeChecks.length}
          </div>
        </div>
      </div>
    </div>
  );
}