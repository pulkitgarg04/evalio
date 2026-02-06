import { useEffect } from 'react';
import useTestStore from '@/store/useTestStore';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, List, ChevronDown } from 'lucide-react';

export function QuestionPalette() {
  const {
    questions,
    currentQuestionIndex,
    jumpToQuestion,
    activeTest,
    timeLeft,
    decrementTimer,
    completeTest
  } = useTestStore();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} `;
  };

  useEffect(() => {
    const timer = setInterval(decrementTimer, 1000);
    return () => clearInterval(timer);
  }, [decrementTimer]);

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{activeTest?.title || 'Test'}</h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={12} />
          <span className={cn("font-bold font-mono", timeLeft < 60 ? "text-red-500" : "")}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0a3a30]/5 text-[#0a3a30] text-xs font-bold border-l-4 border-[#0a3a30]">
          <ChevronDown size={14} />
          Questions
        </div>
        <div>
          {questions.map((q, idx) => {
            const isCurrent = currentQuestionIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => jumpToQuestion(idx)}
                className={cn(
                  "w-full text-left px-4 py-3 text-sm border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-center justify-between group",
                  isCurrent ? "bg-gray-50" : ""
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-xs font-mono w-5 h-5 flex items-center justify-center rounded border",
                    isCurrent ? "border-[#0a3a30] text-[#0a3a30] bg-white" : "border-gray-200 text-gray-400"
                  )}>
                    {idx + 1}
                  </span>
                  <span className={cn(
                    "truncate max-w-[180px]",
                    isCurrent ? "font-bold text-gray-900" : "text-gray-500 group-hover:text-gray-700"
                  )}>
                    Question {idx + 1}
                  </span>
                </div>
                {isCurrent && <div className="w-1 h-4 rounded-full bg-[#0a3a30]"></div>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={completeTest}
          className="w-full py-3 rounded bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle size={14} />
          Submit
        </button>
      </div>
    </div>
  );
}
