"use client";
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useTestStore from '@/store/useTestStore';
import { QuestionContent } from '@/components/test/QuestionContent';
import { QuestionOptions } from '@/components/test/QuestionOptions';
import { QuestionPalette } from '@/components/test/QuestionPalette';
import { TestResults } from '@/components/test/TestResults';

export default function TestPage() {
  const { id } = useParams();
  const {
    status,
    startTest,
    error
  } = useTestStore();

  useEffect(() => {
    startTest(id);
  }, [id, startTest]);

  if (status === 'completed') {
    return <TestResults />;
  }

  if (status === 'error') {

    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 p-4 text-center">
        <div className="p-8 bg-white rounded-2xl shadow-xl max-w-md w-full border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Error</h2>
          <p className="text-gray-600 mb-6">{error || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors w-full"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (status === 'idle') {
    return <div className="flex h-screen items-center justify-center">Loading Test...</div>;
  }


  return (
    <div className="flex h-screen bg-white w-full">
      <div className="w-64 h-full border-r border-gray-200 flex-shrink-0 z-10">
        <QuestionPalette />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 h-full overflow-y-auto bg-white p-8 md:p-12">
          <QuestionContent />
        </div>

        <div className="w-[400px] h-full overflow-y-auto bg-white border-l border-gray-200 p-8 flex-shrink-0">
          <QuestionOptions />
        </div>
      </div>
    </div>
  );
}
