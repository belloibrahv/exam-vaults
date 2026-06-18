'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileQuestion,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Download,
  Upload,
  Eye,
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  difficulty: string;
  questionType: string;
  certification: {
    name: string;
    code: string;
    provider: {
      name: string;
    };
    level: {
      name: string;
    };
  };
  domain: {
    name: string;
  } | null;
  createdAt: Date;
}

interface Certification {
  id: string;
  name: string;
  code: string;
  provider: {
    name: string;
  };
  level: {
    name: string;
  };
  _count: {
    questions: number;
  };
}

interface Provider {
  id: string;
  name: string;
  displayName: string;
  _count: {
    certifications: number;
  };
}

interface QuestionsManagementProps {
  questions: Question[];
  certifications: Certification[];
  providers: Provider[];
}

export default function QuestionsManagement({
  questions,
  certifications,
  providers,
}: QuestionsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [providerFilter, setProviderFilter] = useState<string>('ALL');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  
  const [correctA, setCorrectA] = useState(false);
  const [correctB, setCorrectB] = useState(false);
  const [correctC, setCorrectC] = useState(false);
  const [correctD, setCorrectD] = useState(false);

  const [explanation, setExplanation] = useState('');
  const [difficultyVal, setDifficultyVal] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [typeVal, setTypeVal] = useState<'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SCENARIO_BASED'>('SINGLE_CHOICE');
  const [selCertId, setSelCertId] = useState(certifications[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const openEditModal = (q: any) => {
    setEditingQuestionId(q.id);
    setQuestionText(q.question);
    
    const opts = Array.isArray(q.options) ? q.options : [];
    const a = opts.find((o: any) => o.id === 'a' || o.id === 'A')?.text || '';
    const b = opts.find((o: any) => o.id === 'b' || o.id === 'B')?.text || '';
    const c = opts.find((o: any) => o.id === 'c' || o.id === 'C')?.text || '';
    const d = opts.find((o: any) => o.id === 'd' || o.id === 'D')?.text || '';
    setOptA(a);
    setOptB(b);
    setOptC(c);
    setOptD(d);

    const correct = Array.isArray(q.correctAnswers) ? q.correctAnswers : [];
    const isCorrect = (id: string) => correct.some((c: any) => String(c).toLowerCase() === id.toLowerCase());
    setCorrectA(isCorrect('a'));
    setCorrectB(isCorrect('b'));
    setCorrectC(isCorrect('c'));
    setCorrectD(isCorrect('d'));

    setExplanation(q.explanation || '');
    setDifficultyVal(q.difficulty || 'MEDIUM');
    setTypeVal(q.questionType || 'SINGLE_CHOICE');
    setSelCertId(q.certificationId);
    setErrorMessage('');
    setShowAddEditModal(true);
  };

  const handleAddEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!correctA && !correctB && !correctC && !correctD) {
      setErrorMessage('Please select at least one correct answer option.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const optionsArray = [
      { id: 'a', text: optA },
      { id: 'b', text: optB },
      { id: 'c', text: optC },
      { id: 'd', text: optD },
    ].filter(o => o.text.trim() !== '');

    const correctAnswersArray: string[] = [];
    if (correctA) correctAnswersArray.push('a');
    if (correctB) correctAnswersArray.push('b');
    if (correctC) correctAnswersArray.push('c');
    if (correctD) correctAnswersArray.push('d');

    try {
      const url = editingQuestionId
        ? `/api/admin/questions/${editingQuestionId}`
        : '/api/admin/questions';
      
      const method = editingQuestionId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          options: optionsArray,
          correctAnswers: correctAnswersArray,
          explanation,
          certificationId: selCertId,
          difficulty: difficultyVal,
          questionType: typeVal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save question');
      }

      setShowAddEditModal(false);
      window.location.reload();
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === 'ALL' || question.difficulty === difficultyFilter;
    const matchesProvider =
      providerFilter === 'ALL' ||
      question.certification.provider.name === providerFilter;
    return matchesSearch && matchesDifficulty && matchesProvider;
  });

  const handleDeleteQuestion = async (questionId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this question? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete question');
      }
    } catch (error) {
      alert('Error deleting question');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="p-2 hover:bg-techvaults-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-techvaults-gray-700" />
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-techvaults-black flex items-center gap-2">
                  <FileQuestion className="w-6 h-6 text-techvaults-red" />
                  Questions Management
                </h1>
                <p className="text-xs text-techvaults-gray-600">
                  {filteredQuestions.length} of {questions.length} questions
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/questions/import"
                className="px-3 md:px-4 py-2 border-2 border-techvaults-gray-300 text-techvaults-gray-700 rounded-lg font-semibold hover:border-techvaults-red transition-all flex items-center gap-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </Link>
              <button
                onClick={() => {
                  setEditingQuestionId(null);
                  setQuestionText('');
                  setOptA('');
                  setOptB('');
                  setOptC('');
                  setOptD('');
                  setCorrectA(false);
                  setCorrectB(false);
                  setCorrectC(false);
                  setCorrectD(false);
                  setExplanation('');
                  setDifficultyVal('MEDIUM');
                  setTypeVal('SINGLE_CHOICE');
                  setSelCertId(certifications[0]?.id || '');
                  setErrorMessage('');
                  setShowAddEditModal(true);
                }}
                className="px-3 md:px-4 py-2 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2 text-sm min-h-[40px] active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Question</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {providers.map((provider) => {
            const providerQuestions = questions.filter(
              (q) => q.certification.provider.name === provider.name
            );
            return (
              <div
                key={provider.id}
                className="bg-white rounded-xl p-4 border border-techvaults-gray-200 hover:shadow-lg transition-all"
              >
                <p className="text-xs text-techvaults-gray-600 mb-1">
                  {provider.name}
                </p>
                <p className="text-2xl font-bold text-techvaults-red">
                  {providerQuestions.length}
                </p>
                <p className="text-xs text-techvaults-gray-500">questions</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-techvaults-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-techvaults-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-techvaults-gray-300 rounded-lg focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="px-4 py-2.5 border-2 border-techvaults-gray-300 rounded-lg font-semibold text-sm focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none"
              >
                <option value="ALL">All Providers</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.name}>
                    {provider.name}
                  </option>
                ))}
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2.5 border-2 border-techvaults-gray-300 rounded-lg font-semibold text-sm focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none"
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-xl shadow-xl border border-techvaults-gray-200">
          <div className="divide-y divide-techvaults-gray-200">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="p-4 hover:bg-techvaults-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        {question.certification.provider.name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                        {question.certification.code}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          question.difficulty === 'EASY'
                            ? 'bg-green-100 text-green-700'
                            : question.difficulty === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {question.difficulty}
                      </span>
                      {question.domain && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-semibold">
                          {question.domain.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-techvaults-black line-clamp-2 mb-1">
                      {question.question}
                    </p>
                    <p className="text-xs text-techvaults-gray-500">
                      {question.questionType.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelectedQuestion(question)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View question"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => openEditModal(question)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit question"
                    >
                      <Edit className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <FileQuestion className="w-12 h-12 text-techvaults-gray-400 mx-auto mb-3" />
              <p className="text-techvaults-gray-600">No questions found</p>
            </div>
          )}
        </div>

        {/* Certifications Overview */}
        <div className="mt-8 bg-white rounded-xl shadow-xl border border-techvaults-gray-200 p-6">
          <h3 className="text-lg font-bold text-techvaults-black mb-4">
            Questions by Certification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-4 border-2 border-techvaults-gray-200 rounded-lg hover:border-techvaults-red transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-techvaults-gray-600 mb-1">
                      {cert.provider.name}
                    </p>
                    <p className="text-sm font-bold text-techvaults-black truncate">
                      {cert.code}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-techvaults-red">
                    {cert._count.questions}
                  </span>
                </div>
                <p className="text-xs text-techvaults-gray-500 line-clamp-1">
                  {cert.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Preview Modal */}
      {selectedQuestion && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedQuestion(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-techvaults-black mb-4">
              Question Preview
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-techvaults-gray-700 mb-2">
                  Question:
                </p>
                <p className="text-base text-techvaults-black">
                  {selectedQuestion.question}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                  {selectedQuestion.certification.provider.name}
                </span>
                <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                  {selectedQuestion.certification.code}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    selectedQuestion.difficulty === 'EASY'
                      ? 'bg-green-100 text-green-700'
                      : selectedQuestion.difficulty === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedQuestion.difficulty}
                </span>
              </div>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="w-full px-6 py-3 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-techvaults-gray-200 bg-white mt-16 py-8">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-techvaults-gray-600">
          <p className="text-xs">
            © 2026 ExamVaults. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs">Built by</span>
            <Image
              src="/images/logo.png"
              alt="Techvaults"
              width={90}
              height={24}
              className="h-5 w-auto opacity-75 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </footer>

      {/* Add / Edit Question Modal */}
      {showAddEditModal && (
        <div
          className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowAddEditModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-techvaults-gray-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-techvaults-black mb-1">
              {editingQuestionId ? 'Edit Question' : 'Add New Question'}
            </h3>
            <p className="text-sm text-techvaults-gray-600 mb-6">
              {editingQuestionId
                ? 'Modify this question details in the exam prep bank.'
                : 'Create a new certification exam practice question.'}
            </p>

            <form onSubmit={handleAddEditQuestion} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                  Certification
                </label>
                <select
                  value={selCertId}
                  onChange={(e) => setSelCertId(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all text-sm bg-white"
                >
                  {certifications.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.provider.name}] {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={difficultyVal}
                    onChange={(e) => setDifficultyVal(e.target.value as any)}
                    className="w-full px-4 py-2.5 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all text-sm bg-white"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                    Question Type
                  </label>
                  <select
                    value={typeVal}
                    onChange={(e) => setTypeVal(e.target.value as any)}
                    className="w-full px-4 py-2.5 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all text-sm bg-white"
                  >
                    <option value="SINGLE_CHOICE">Single Choice</option>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="SCENARIO_BASED">Scenario Based</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                  Question Text
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the question query text..."
                  className="w-full px-4 py-2.5 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all text-sm bg-white"
                />
              </div>

              {/* Options Section */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-techvaults-gray-700">
                  Options & Correct Answers (Select the correct options)
                </label>

                {/* Option A */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={correctA}
                    onChange={(e) => setCorrectA(e.target.checked)}
                    className="w-5 h-5 text-techvaults-red focus:ring-techvaults-red/25 border-techvaults-gray-300 rounded"
                  />
                  <span className="text-sm font-bold text-techvaults-gray-600">A</span>
                  <input
                    type="text"
                    required
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    placeholder="Option A text"
                    className="flex-1 px-4 py-2 border-2 border-techvaults-gray-300 rounded-xl focus:border-techvaults-red outline-none text-sm bg-white"
                  />
                </div>

                {/* Option B */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={correctB}
                    onChange={(e) => setCorrectB(e.target.checked)}
                    className="w-5 h-5 text-techvaults-red focus:ring-techvaults-red/25 border-techvaults-gray-300 rounded"
                  />
                  <span className="text-sm font-bold text-techvaults-gray-600">B</span>
                  <input
                    type="text"
                    required
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    placeholder="Option B text"
                    className="flex-1 px-4 py-2 border-2 border-techvaults-gray-300 rounded-xl focus:border-techvaults-red outline-none text-sm bg-white"
                  />
                </div>

                {/* Option C */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={correctC}
                    onChange={(e) => setCorrectC(e.target.checked)}
                    className="w-5 h-5 text-techvaults-red focus:ring-techvaults-red/25 border-techvaults-gray-300 rounded"
                  />
                  <span className="text-sm font-bold text-techvaults-gray-600">C</span>
                  <input
                    type="text"
                    required
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    placeholder="Option C text"
                    className="flex-1 px-4 py-2 border-2 border-techvaults-gray-300 rounded-xl focus:border-techvaults-red outline-none text-sm bg-white"
                  />
                </div>

                {/* Option D */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={correctD}
                    onChange={(e) => setCorrectD(e.target.checked)}
                    className="w-5 h-5 text-techvaults-red focus:ring-techvaults-red/25 border-techvaults-gray-300 rounded"
                  />
                  <span className="text-sm font-bold text-techvaults-gray-600">D</span>
                  <input
                    type="text"
                    required
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    placeholder="Option D text"
                    className="flex-1 px-4 py-2 border-2 border-techvaults-gray-300 rounded-xl focus:border-techvaults-red outline-none text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-techvaults-gray-700 mb-1.5">
                  Explanation
                </label>
                <textarea
                  required
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why the selected options are correct..."
                  className="w-full px-4 py-2.5 border-2 border-techvaults-gray-300 rounded-xl focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all text-sm bg-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-techvaults-gray-300 text-techvaults-gray-700 rounded-xl font-semibold hover:bg-techvaults-gray-50 active:scale-95 transition-all text-sm min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-techvaults-red text-white rounded-xl font-semibold hover:bg-red-700 active:scale-95 transition-all text-sm min-h-[44px] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingQuestionId ? 'Save Changes' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
