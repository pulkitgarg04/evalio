"use client";
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useTestStore from '@/store/useTestStore';
import { QuestionCard } from '@/components/test/QuestionCard';
import { QuestionPalette } from '@/components/test/QuestionPalette';
import { TestResults } from '@/components/test/TestResults';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function TestPage() {
  const { id } = useParams();
  const { 
    status, 
    startTest, 
    nextQuestion, 
    prevQuestion, 
    currentQuestionIndex,
    questions 
  } = useTestStore();

  useEffect(() => {
    startTest(id);
  }, [id, startTest]);

  if (status === 'completed') {
    return <TestResults />;
  }

  if (status === 'idle') {
    return <div className="flex h-screen items-center justify-center">Loading Test...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[60vh] flex flex-col justify-center">
            <QuestionCard />
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            
            <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-primary font-bold hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
                Next Question <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <QuestionPalette />
        </div>

      </div>
    </div>
  );
}
