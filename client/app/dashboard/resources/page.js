"use client";
import React from 'react';
import { SubjectGrid } from '@/components/dashboard/SubjectGrid';

export default function ResourcesPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 min-h-screen pb-10">
            <SubjectGrid linkPrefix="/dashboard/resources" />
        </div>
    );
}
