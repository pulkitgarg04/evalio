"use client";

import { useState, useEffect } from 'react';
import {
    Trophy,
    Target,
    BookOpen,
    TrendingUp,
    Clock,
    CheckCircle,
    Loader2,
    BarChart3
} from 'lucide-react';

export default function StatsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/history/stats`, {
                    credentials: 'include',
                });

                if (!res.ok) throw new Error('Failed to fetch stats');

                const data = await res.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex items-center gap-3 text-gray-500">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="font-medium">Loading your stats...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <p className="text-red-500 font-medium mb-2">Failed to load stats</p>
                    <p className="text-gray-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#0a3a30]">Dashboard</h1>
                <p className="text-gray-500 mt-1">Track your learning progress and performance</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={BookOpen}
                    label="Tests Taken"
                    value={stats?.totalTests || 0}
                    color="emerald"
                />
                <StatCard
                    icon={Target}
                    label="Average Score"
                    value={`${stats?.averageScore || 0}%`}
                    color="blue"
                />
                <StatCard
                    icon={Trophy}
                    label="Best Score"
                    value={`${stats?.bestScore || 0}%`}
                    color="amber"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Questions Answered"
                    value={stats?.totalQuestions || 0}
                    subValue={`${stats?.totalCorrect || 0} correct`}
                    color="purple"
                />
            </div>

            {stats?.subjectStats && Object.keys(stats.subjectStats).length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                            <BarChart3 className="text-[#0a3a30]" size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-[#0a3a30]">Performance by Subject</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(stats.subjectStats).map(([subject, data]) => (
                            <div
                                key={subject}
                                className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-200 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-gray-800 capitalize">{subject}</span>
                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                                        {data.count} tests
                                    </span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-bold text-[#0a3a30]">{data.averageScore}%</span>
                                    <span className="text-gray-400 text-sm mb-1">avg score</span>
                                </div>
                                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                                        style={{ width: `${data.averageScore}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {stats?.recentAttempts && stats.recentAttempts.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <Clock className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-[#0a3a30]">Recent Activity</h2>
                    </div>

                    <div className="space-y-3">
                        {stats.recentAttempts.map((attempt) => (
                            <div
                                key={attempt.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${attempt.score >= 70
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : attempt.score >= 50
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {attempt.score}%
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{attempt.testTitle}</p>
                                        <p className="text-sm text-gray-500 capitalize">{attempt.subject}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">
                                        {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {stats?.totalTests === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="text-gray-400" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No tests taken yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Start taking tests to see your performance statistics here. Your progress will be tracked automatically.
                    </p>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon: Icon, label, value, subValue, color = 'emerald' }) {
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group">
            <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-[#0a3a30]">{value}</p>
            {subValue && <p className="text-sm text-gray-400 mt-1">{subValue}</p>}
        </div>
    );
}
