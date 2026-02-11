"use client";
import { useState } from 'react';
import { SubjectGrid } from '@/components/dashboard/SubjectGrid';
import { CustomTestModal } from '@/components/dashboard/CustomTestModal';
import { HistoryList } from '@/components/dashboard/HistoryList';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <div className="h-full">
        <SubjectGrid />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your History</h2>
        <HistoryList />
      </div>

      <CustomTestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
