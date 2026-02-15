"use client";
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useTestStore from '@/store/useTestStore';
import { TestResults } from '@/components/test/TestResults';

export default function ReviewPage() {
    const { sessionId } = useParams();
    const {
        status,
        loadReviewSession,
        error
    } = useTestStore();

    useEffect(() => {
        loadReviewSession(sessionId);
    }, [sessionId, loadReviewSession]);

    if (status === 'error') {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-gray-50 p-4 text-center">
                <div className="p-8 bg-white rounded-2xl shadow-xl max-w-md w-full border border-red-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Review</h2>
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

    if (status === 'completed') {
        return <TestResults />;
    }

    return <div className="flex h-screen items-center justify-center">Loading Review...</div>;
}
