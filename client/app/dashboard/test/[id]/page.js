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
    startTest
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
