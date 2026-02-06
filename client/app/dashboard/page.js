"use client";
import { useState } from 'react';
import { SubjectGrid } from '@/components/dashboard/SubjectGrid';
import { CustomTestModal } from '@/components/dashboard/CustomTestModal';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <div className="h-full">
        <SubjectGrid />
      </div>

      <CustomTestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
