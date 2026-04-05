"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, XCircle, LayoutList, ChevronLeft, ChevronRight, Layers, ListTree } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuestionBankQuestionsPage() {
  const params = useParams();
  const [subjectName, setSubjectName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [revisionMode, setRevisionMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [viewBasis, setViewBasis] = useState('questions');

  useEffect(() => {
    const fetchSubjectAndQuestions = async () => {
      setLoading(true);
      try {
        let name = subjectName;

        if (!name) {
          const subRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/subjects`, {
            credentials: 'include'
          });
          if (subRes.ok) {
            const subjects = await subRes.json();
            const matchingSubject = subjects.find(s => s._id === params.id);
            if (matchingSubject) {
              name = matchingSubject.name;
              setSubjectName(name);
            }
          }
        }

        if (name) {
          const questionsRes = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/questions/bank?subject=${encodeURIComponent(name)}&page=${currentPage}&limit=50`,
            { credentials: 'include' }
          );

          if (questionsRes.ok) {
            const result = await questionsRes.json();
            setQuestions(result.questions || []);
            setTotalPages(result.totalPages || 1);
            setTotalQuestions(result.total || 0);
          }
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchSubjectAndQuestions();
    }
  }, [params?.id, currentPage, subjectName]);

  const handleOptionSelect = (qId, option) => {
    if (revisionMode) return;
    if (userAnswers[qId]) return;

    setUserAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const resetPractice = () => {
    setUserAnswers({});
  };

  const groupedQuestions = React.useMemo(() => {
    if (viewBasis === 'questions') {
      return [{
        key: 'all-questions',
        title: '',
        questions
      }];
    }

    const groups = questions.reduce((acc, q) => {
      const rawKey = viewBasis === 'topic' ? q.topic : q.subTopic;
      const normalizedKey = rawKey?.trim() || 'Uncategorized';

      if (!acc[normalizedKey]) {
        acc[normalizedKey] = [];
      }

      acc[normalizedKey].push(q);
      return acc;
    }, {});

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'Uncategorized') return 1;
      if (b === 'Uncategorized') return -1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((key) => ({
      key,
      title: key,
      questions: groups[key]
    }));
  }, [questions, viewBasis]);

  const questionNumberMap = React.useMemo(() => {
    const start = (currentPage - 1) * 50;
    return questions.reduce((acc, q, index) => {
      acc[q._id] = start + index + 1;
      return acc;
    }, {});
  }, [questions, currentPage]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/question-bank" className="p-1.5 rounded-md border border-transparent hover:border-gray-200 hover:bg-white text-slate-500 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Question Bank</h1>
            <p className="text-sm text-slate-500 mt-1">
              {subjectName ? `${subjectName} • ${totalQuestions} Questions` : 'Loading...'}
            </p>
          </div>
        </div>

        {!loading && questions.length > 0 && (
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-xs w-full sm:w-auto">
              <button
                onClick={() => setRevisionMode(false)}
                className={cn(
                  "flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all",
                  !revisionMode ? "bg-[#0ddc90] text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Practice Mode
              </button>
              <button
                onClick={() => setRevisionMode(true)}
                className={cn(
                  "flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                  revisionMode ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <LayoutList size={16} /> Revision
              </button>
            </div>

            <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-xs w-full sm:w-auto">
              <button
                onClick={() => setViewBasis('questions')}
                className={cn(
                  "flex-1 sm:flex-none px-3.5 py-2 text-sm font-medium rounded-md transition-all",
                  viewBasis === 'questions' ? "bg-[#0ddc90] text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Questions
              </button>
              <button
                onClick={() => setViewBasis('topic')}
                className={cn(
                  "flex-1 sm:flex-none px-3.5 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                  viewBasis === 'topic' ? "bg-[#0ddc90] text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Layers size={15} /> Topic
              </button>
              <button
                onClick={() => setViewBasis('subTopic')}
                className={cn(
                  "flex-1 sm:flex-none px-3.5 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                  viewBasis === 'subTopic' ? "bg-[#0ddc90] text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <ListTree size={15} /> Subtopic
              </button>
            </div>
          </div>
        )}
      </div>

      {!revisionMode && !loading && Object.keys(userAnswers).length > 0 && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={resetPractice}
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors underline underline-offset-4"
          >
            Reset Practice
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white border text-left border-gray-200 rounded-xl p-6 shadow-xs animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-10 bg-gray-100 rounded-lg w-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <BookOpen size={32} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No questions available for this subject.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedQuestions.map((group) => (
            <div key={group.key} className="space-y-4">
              {viewBasis !== 'questions' && (
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white/80 px-4 py-3">
                  <h2 className="text-sm md:text-base font-semibold text-slate-800">
                    {group.title}
                  </h2>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 rounded-md px-2 py-1">
                    {group.questions.length} question{group.questions.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {group.questions.map((q) => {
                const hasAnswered = !!userAnswers[q._id];
                const selectedOpt = userAnswers[q._id];
                const questionNumber = questionNumberMap[q._id];

                return (
                  <div key={q._id} className="bg-white border border-gray-200 rounded-xl p-5 md:p-7 shadow-xs">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-sm bg-slate-100 text-slate-700 font-semibold text-sm">
                          {questionNumber}
                        </span>
                        <h3 className="text-base text-slate-800 font-medium leading-relaxed pt-0.5">
                          {q.question}
                        </h3>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-50 border border-slate-100",
                        q.difficulty === 'Easy' ? "text-emerald-600" :
                        q.difficulty === 'Medium' ? "text-amber-600" :
                        "text-rose-600"
                      )}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                      {q.options.map((option, optIdx) => {
                        const isCorrect = option === q.correctAnswer;
                        const isSelected = selectedOpt === option;

                        let bgClass = "bg-white hover:bg-slate-50 border-gray-200 cursor-pointer";
                        let textClass = "text-slate-600";
                        let icon = null;

                        if (revisionMode) {
                          if (isCorrect) {
                            bgClass = "bg-emerald-50 border-emerald-200 pointer-events-none";
                            textClass = "text-emerald-800 font-medium";
                            icon = <CheckCircle size={16} className="text-emerald-500" />;
                          } else {
                            bgClass = "bg-white border-gray-100 opacity-60 pointer-events-none";
                          }
                        } else if (hasAnswered) {
                          bgClass = "bg-white border-gray-200 cursor-default opacity-80";
                          if (isCorrect) {
                            bgClass = "bg-emerald-50 border-emerald-300";
                            textClass = "text-emerald-800 font-medium";
                            icon = <CheckCircle size={16} className="text-emerald-500" />;
                          } else if (isSelected && !isCorrect) {
                            bgClass = "bg-rose-50 border-rose-300";
                            textClass = "text-rose-800";
                            icon = <XCircle size={16} className="text-rose-500" />;
                          }
                        }

                        const optLetter = String.fromCharCode(65 + optIdx);

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleOptionSelect(q._id, option)}
                            className={cn(
                              "relative flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
                              bgClass
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-md text-xs font-semibold",
                                revisionMode && isCorrect ? "bg-emerald-200/50 text-emerald-700" :
                                hasAnswered && isCorrect ? "bg-emerald-200/50 text-emerald-700" :
                                hasAnswered && isSelected ? "bg-rose-200/50 text-rose-700" :
                                "bg-slate-100 text-slate-500"
                              )}>
                                {optLetter}
                              </span>
                              <span className={cn("text-sm", textClass)}>{option}</span>
                            </div>
                            {icon}
                          </div>
                        );
                      })}
                    </div>

                    {(revisionMode || hasAnswered) && (q.topic || q.subTopic) && (
                      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2 pl-10">
                       {q.topic && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">{q.topic}</span>}
                       {q.subTopic && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">{q.subTopic}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-8 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="px-4 text-sm font-medium text-slate-700">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
