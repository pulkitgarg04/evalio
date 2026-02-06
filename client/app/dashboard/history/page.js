"use client";

import { useState, useEffect } from 'react';
import {
    History,
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    Loader2,
    FileText,
    Trophy
} from 'lucide-react';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchHistory = async (page = 1) => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/history?page=${page}&limit=10`,
                { credentials: 'include' }
            );

            if (!res.ok) throw new Error('Failed to fetch history');

            const data = await res.json();
            setHistory(data.attempts);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchHistory(newPage);
        }
    };

    if (loading && history.length === 0) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex items-center gap-3 text-gray-500">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="font-medium">Loading your history...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <p className="text-red-500 font-medium mb-2">Failed to load history</p>
                    <p className="text-gray-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#0a3a30]">Test History</h1>
                    <p className="text-gray-500 mt-1">View all your past test attempts and scores</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText size={16} />
                    <span>{pagination.total} total attempts</span>
                </div>
            </div>

            {history.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                        <div className="col-span-5">Test</div>
                        <div className="col-span-2 text-center">Score</div>
                        <div className="col-span-2 text-center">Questions</div>
                        <div className="col-span-3 text-right">Date</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {history.map((attempt) => (
                            <div
                                key={attempt._id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                            >
                                <div className="col-span-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                            <History className="text-[#0a3a30]" size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {attempt.test?.title || 'Unknown Test'}
                                            </p>
                                            <p className="text-sm text-gray-500 capitalize">
                                                {attempt.test?.subject || 'Unknown Subject'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${attempt.score >= 70
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : attempt.score >= 50
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {attempt.score}%
                                    </div>
                                </div>

                                <div className="col-span-2 text-center">
                                    <span className="text-gray-700 font-medium">
                                        {attempt.correctAnswers}/{attempt.totalQuestions}
                                    </span>
                                    <span className="text-gray-400 text-sm ml-1">correct</span>
                                </div>

                                <div className="col-span-3 text-right">
                                    <div className="flex items-center justify-end gap-2 text-gray-500">
                                        <Calendar size={14} />
                                        <span className="text-sm">
                                            {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 text-gray-400 mt-1">
                                        <Clock size={12} />
                                        <span className="text-xs">
                                            {new Date(attempt.completedAt).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Page {pagination.page} of {pagination.pages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1 || loading}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages || loading}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="text-gray-400" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No test history yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Complete your first test to start tracking your progress. All your test attempts will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
