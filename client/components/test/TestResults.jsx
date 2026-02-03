import Link from 'next/link';
import useTestStore from '@/store/useTestStore';
import { Trophy, RefreshCw, Home } from 'lucide-react';

export function TestResults() {
  const { questions, answers, activeTest, resetTest } = useTestStore();
  let correctCount = 0;
  questions.forEach(q => {
    if (answers[q.id] === q.correctOption) {
      correctCount++;
    }
  });

  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const passed = scorePercentage >= 60;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full"></div>
        <div className="relative h-24 w-24 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl rotate-12 transform hover:rotate-0 transition-transform duration-500">
           <Trophy size={48} className="text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Completed!</h1>
      <p className="text-xl text-gray-500 mb-8">You have successfully finished <span className="text-primary font-bold">{activeTest?.title || 'the test'}</span>.</p>

      <div className="grid grid-cols-3 gap-6 w-full mb-10">
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-400 font-bold uppercase mb-1">Score</p>
              <p className={`text-4xl font-bold ${passed ? 'text-green-500' : 'text-orange-500'}`}>{scorePercentage}%</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-400 font-bold uppercase mb-1">Correct</p>
              <p className="text-4xl font-bold text-gray-800">{correctCount}/{questions.length}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
             <p className="text-sm text-gray-400 font-bold uppercase mb-1">Time Taken</p>
             <p className="text-4xl font-bold text-gray-800">12:30</p>
          </div>
      </div>

      <div className="flex gap-4">
        <Link 
            href="/dashboard" 
            onClick={resetTest}
            className="px-8 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
            <Home size={18} /> Back to Home
        </Link>
        <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
        >
            <RefreshCw size={18} /> Retake Test
        </button>
      </div>
    </div>
  );
}
