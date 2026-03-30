import Link from 'next/link';
import useTestStore from '@/store/useTestStore';
import { Trophy, ArrowLeft, CheckCircle, XCircle, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TestResults() {
  const {
    questions,
    answers,
    activeTest,
    resetTest,
    summary,
    sessionMeta
  } = useTestStore();

  const totalQuestions = summary?.totalQuestions ?? questions.length;
  const correctCount = summary?.correctAnswers ?? questions.reduce((acc, q) => {
    const selectedOptionIndex = answers[q.id];
    if (selectedOptionIndex !== undefined && q.options[selectedOptionIndex] === q.correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const scorePercentage = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;
  const passed = scorePercentage >= 60;

  const timeTakenSeconds = sessionMeta?.timeTakenSeconds
    ?? (sessionMeta?.startTime && sessionMeta?.submittedAt
      ? Math.max(
        0,
        Math.floor(
          (new Date(sessionMeta.submittedAt).getTime() - new Date(sessionMeta.startTime).getTime()) / 1000
        )
      )
      : null);

  const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) {
      return '--:--';
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            onClick={resetTest}
            className="p-1.5 rounded-md border border-transparent hover:border-gray-200 hover:bg-white text-slate-500 transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Test Report</h1>
            <p className="text-sm text-slate-500 mt-1">
              {activeTest?.title || 'Assessment Results'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex items-center gap-5">
          <div className={cn("p-4 rounded-full", passed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-500")}>
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Final Score</p>
            <p className={cn("text-3xl font-bold tracking-tight", passed ? "text-emerald-600" : "text-amber-500")}>{scorePercentage}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex items-center gap-5">
          <div className="p-4 rounded-full bg-blue-50 text-blue-500">
            <Target size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Accuracy</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{correctCount}<span className="text-lg text-slate-400 font-medium">/{totalQuestions}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex items-center gap-5">
          <div className="p-4 rounded-full bg-slate-50 text-slate-500">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Time Taken</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{formatDuration(timeTakenSeconds)}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Detailed Analysis</h2>
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const selectedIdx = answers[q.id];
            const isCorrect = selectedIdx !== undefined && q.options[selectedIdx] === q.correctAnswer;
            const isSkipped = selectedIdx === undefined;

            return (
              <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-5 md:p-7 shadow-xs">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      "shrink-0 flex items-center justify-center w-7 h-7 rounded-sm font-semibold text-sm",
                        isCorrect ? "bg-emerald-100 text-emerald-700" : isSkipped ? "bg-slate-100 text-slate-500 border border-slate-200" : "bg-rose-100 text-rose-700"
                    )}>
                      {idx + 1}
                    </span>
                    <h3 className="text-base text-slate-800 font-medium leading-relaxed pt-0.5">
                      {q.text}
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
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedIdx === optIdx;
                    const isOptionCorrect = opt === q.correctAnswer;

                    let bgClass = "bg-white border-gray-200 opacity-60";
                    let textClass = "text-slate-500";
                    let icon = null;

                    if (isOptionCorrect) {
                      bgClass = "bg-emerald-50 border-emerald-300 pointer-events-none opacity-100";
                      textClass = "text-emerald-800 font-medium";
                      icon = <CheckCircle size={16} className="text-emerald-500" />;
                    } else if (isSelected && !isOptionCorrect) {
                      bgClass = "bg-rose-50 border-rose-300 opacity-100";
                      textClass = "text-rose-800";
                      icon = <XCircle size={16} className="text-rose-500" />;
                    }

                    const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                    return (
                      <div
                        key={optIdx}
                        className={cn(
                          "relative flex items-center justify-between p-3 rounded-lg border",
                          bgClass
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-md text-xs font-semibold",
                            isOptionCorrect ? "bg-emerald-200/50 text-emerald-700" :
                            isSelected ? "bg-rose-200/50 text-rose-700" :
                            "bg-slate-100 text-slate-500"
                          )}>
                            {optLetter}
                          </span>
                          <span className={cn("text-sm", textClass)}>{opt}</span>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>
                
                {(q.topic || q.subTopic) && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2 pl-10">
                   {q.topic && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">{q.topic}</span>}
                   {q.subTopic && <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">{q.subTopic}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
