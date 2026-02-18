"use client";
import { SubjectGrid } from '@/components/dashboard/SubjectGrid';

export default function SubjectPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 min-h-screen pb-10">
      <SubjectGrid linkPrefix="/dashboard/subject" />
    </div>
  );
}
