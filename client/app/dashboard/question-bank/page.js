"use client";
import { SubjectGrid } from '@/components/dashboard/SubjectGrid';

export default function QuestionBankPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 min-h-screen pb-10">
      <SubjectGrid 
        linkPrefix="/dashboard/question-bank" 
        title="Question Bank" 
        countLabel="Questions" 
        viewLabel="View Questions" 
        emptyLabel="questions" 
      />
    </div>
  );
}
