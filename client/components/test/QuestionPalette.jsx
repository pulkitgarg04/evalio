import { useEffect } from 'react';
import useTestStore from '@/store/useTestStore';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle } from 'lucide-react';

export function QuestionPalette() {
  const { 
    questions, 
    currentQuestionIndex, 
    jumpToQuestion, 
    answers, 
    timeLeft, 
    decrementTimer,
    completeTest 
  } = useTestStore();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(decrementTimer, 1000);
    return () => clearInterval(timer);
  }, [decrementTimer]);

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <Clock size={20} />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Time Left</p>
                <p className={cn("text-xl font-mono font-bold", timeLeft < 60 ? "text-red-500" : "text-gray-800")}>
                    {formatTime(timeLeft)}
                </p>
            </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm font-bold text-gray-400 mb-4">Question Palette</p>
        <div className="grid grid-cols-5 gap-3">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = currentQuestionIndex === idx;
            
            return (
              <button
                key={q.id}
                onClick={() => jumpToQuestion(idx)}
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all",
                  isCurrent ? "ring-2 ring-primary ring-offset-2" : "",
                  isAnswered 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-gray-400 mb-8">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div> Answered
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-100"></div> Skipped
          </div>
      </div>

      <button
        onClick={completeTest}
        className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
      >
        <CheckCircle size={18} />
        Submit Test
      </button>
    </div>
  );
}
