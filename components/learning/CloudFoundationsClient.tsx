'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Image,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import {
  FOUNDATION_LEVELS,
  FoundationTopic,
  cloudFoundationTopics,
  getQuestionCountForLevel,
} from '@/lib/cloud-foundations';

type TopicProgress = {
  level: number;
  bestScore: number;
  attempts: number;
};

type ProgressMap = Record<string, TopicProgress>;

const STORAGE_KEY = 'techvaults-cloud-foundations-progress';

function getDefaultProgress(): ProgressMap {
  return cloudFoundationTopics.reduce<ProgressMap>((acc, topic) => {
    acc[topic.slug] = { level: 1, bestScore: 0, attempts: 0 };
    return acc;
  }, {});
}

function getLevelLabel(level: number) {
  return FOUNDATION_LEVELS[Math.min(level - 1, FOUNDATION_LEVELS.length - 1)];
}

function getMasteryHint(score: number) {
  if (score >= 90) return 'Excellent. Your mastery level increased.';
  if (score >= 75) return 'Solid pass. Review the explanations before moving on.';
  return 'Keep going. Re-read the key ideas and try another round.';
}

function selectQuestions(topic: FoundationTopic, level: number) {
  const count = getQuestionCountForLevel(level, topic.questions.length);
  const easy = topic.questions.filter((question) => question.difficulty === 'easy');
  const medium = topic.questions.filter((question) => question.difficulty === 'medium');
  const hard = topic.questions.filter((question) => question.difficulty === 'hard');

  if (level === 1) return [...easy, ...medium, ...hard].slice(0, count);
  if (level === 2) return [...medium, ...easy, ...hard].slice(0, count);
  return [...hard, ...medium, ...easy].slice(0, count);
}

export default function CloudFoundationsClient() {
  const [activeSlug, setActiveSlug] = useState(cloudFoundationTopics[0].slug);
  const [progress, setProgress] = useState<ProgressMap>(getDefaultProgress);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const activeTopic = cloudFoundationTopics.find((topic) => topic.slug === activeSlug) ?? cloudFoundationTopics[0];
  const activeProgress = progress[activeTopic.slug] ?? { level: 1, bestScore: 0, attempts: 0 };
  const quizQuestions = useMemo(
    () => selectQuestions(activeTopic, activeProgress.level),
    [activeTopic, activeProgress.level]
  );

  const answeredCount = quizQuestions.filter((question) => answers[question.id]).length;
  const correctCount = quizQuestions.filter((question) => answers[question.id] === question.correctAnswer).length;
  const score = quizQuestions.length > 0 ? Math.round((correctCount / quizQuestions.length) * 100) : 0;
  const overallMastery = Math.round(
    Object.values(progress).reduce((total, item) => total + item.level, 0) /
      (cloudFoundationTopics.length * FOUNDATION_LEVELS.length) *
      100
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress({ ...getDefaultProgress(), ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Unable to load cloud foundations progress', error);
    }
  }, []);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [activeSlug, activeProgress.level]);

  const persistProgress = (nextProgress: ProgressMap) => {
    setProgress(nextProgress);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
  };

  const submitQuiz = () => {
    if (answeredCount !== quizQuestions.length) return;

    const nextLevel =
      score >= 90
        ? Math.min(activeProgress.level + 1, FOUNDATION_LEVELS.length)
        : activeProgress.level;

    persistProgress({
      ...progress,
      [activeTopic.slug]: {
        level: nextLevel,
        bestScore: Math.max(activeProgress.bestScore, score),
        attempts: activeProgress.attempts + 1,
      },
    });
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-8">
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-techvaults-red mb-3">
              <Sparkles className="w-4 h-4" />
              Cloud Foundations
            </div>
            <h1 className="text-3xl font-bold text-gray-950 mb-3">
              Learn the concepts behind every cloud certification
            </h1>
            <p className="text-gray-600 max-w-3xl">
              This track teaches the background knowledge learners need while they continue certification prep:
              definitions, diagrams, provider-neutral mental models, and adaptive quizzes that start at 10 questions
              and grow as mastery improves.
            </p>
          </div>

          <div className="bg-gray-950 text-white rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-300">Overall mastery</span>
              <Award className="w-5 h-5 text-yellow-300" />
            </div>
            <div className="text-4xl font-bold mb-3">{overallMastery}%</div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-300"
                initial={{ width: 0 }}
                animate={{ width: `${overallMastery}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          {cloudFoundationTopics.map((topic) => {
            const itemProgress = progress[topic.slug] ?? { level: 1, bestScore: 0, attempts: 0 };
            const isActive = topic.slug === activeTopic.slug;

            return (
              <button
                key={topic.slug}
                onClick={() => setActiveSlug(topic.slug)}
                className={`w-full text-left rounded-lg border p-4 transition-colors ${
                  isActive
                    ? 'border-techvaults-red bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-950">{topic.title}</h2>
                    <p className="text-xs text-gray-600 mt-1">
                      {getLevelLabel(itemProgress.level)} - Best {itemProgress.bestScore}%
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 ${isActive ? 'text-techvaults-red' : 'text-gray-400'}`} />
                </div>
              </button>
            );
          })}
        </aside>

        <main className="space-y-6">
          <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {activeTopic.estimatedMinutes} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  {getLevelLabel(activeProgress.level)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {quizQuestions.length} question quiz
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-950 mb-2">{activeTopic.title}</h2>
              <p className="text-gray-600">{activeTopic.summary}</p>
            </div>

            <div className="grid lg:grid-cols-[1fr_320px]">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-950 mb-3">
                    <BookOpen className="w-5 h-5 text-techvaults-red" />
                    Key Ideas
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeTopic.keyIdeas.map((idea) => (
                      <div key={idea} className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
                        {idea}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  {activeTopic.deepDive.map((section) => (
                    <article key={section.heading}>
                      <h3 className="text-lg font-semibold text-gray-950 mb-2">{section.heading}</h3>
                      <p className="text-gray-700 leading-relaxed">{section.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 p-6">
                <div className="rounded-lg bg-white border border-gray-200 p-4 mb-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-950 mb-4">
                    <Image className="w-4 h-4 text-techvaults-red" />
                    Concept Visual
                  </div>
                  <div className="space-y-2">
                    {activeTopic.visual.layers.map((layer, index) => (
                      <div
                        key={layer}
                        className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-950 text-xs font-semibold text-white">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{layer}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Image generation prompt: {activeTopic.imagePrompt}
                  </p>
                </div>

                <div className="rounded-lg bg-white border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-950 mb-3">
                    <Layers className="w-4 h-4 text-techvaults-red" />
                    Sources
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{activeTopic.sourceNote}</p>
                  <div className="space-y-2">
                    {activeTopic.sources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-techvaults-red hover:underline"
                      >
                        {source.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-950">Mastery Quiz</h2>
                <p className="text-sm text-gray-600">
                  Answer all questions to submit. Score 90% or higher to unlock the next mastery level.
                </p>
              </div>
              <div className="text-sm text-gray-600">
                {answeredCount}/{quizQuestions.length} answered
              </div>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((question, index) => {
                const selected = answers[question.id];
                const isCorrect = submitted && selected === question.correctAnswer;
                const isWrong = submitted && selected && selected !== question.correctAnswer;

                return (
                  <div key={question.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-gray-950">{question.question}</h3>
                    </div>

                    <div className="grid gap-2">
                      {question.options.map((option) => {
                        const isSelected = selected === option.id;
                        const isAnswer = submitted && option.id === question.correctAnswer;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            disabled={submitted}
                            onClick={() =>
                              setAnswers((current) => ({ ...current, [question.id]: option.id }))
                            }
                            className={`rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                              isAnswer
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : submitted && isSelected
                                ? 'border-red-500 bg-red-50 text-red-800'
                                : isSelected
                                ? 'border-techvaults-red bg-red-50 text-gray-950'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.text}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className={`mt-4 rounded-md p-3 text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <div className="flex items-center gap-2 font-semibold mb-1">
                          {isWrong ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          {isCorrect ? 'Correct' : 'Review this concept'}
                        </div>
                        <p>{question.explanation}</p>
                        <p className="mt-2 text-xs opacity-80">Source: {question.source}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {submitted ? (
                <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-2 font-semibold text-gray-950">
                    <ShieldCheck className="w-5 h-5 text-techvaults-red" />
                    Score: {score}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{getMasteryHint(score)}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Your quiz grows from 10 questions as your concept mastery level increases.
                </p>
              )}

              <div className="flex gap-3">
                {submitted && (
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                )}
                <button
                  type="button"
                  onClick={submitQuiz}
                  disabled={submitted || answeredCount !== quizQuestions.length}
                  className="inline-flex items-center gap-2 rounded-lg bg-techvaults-red px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Quiz
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
