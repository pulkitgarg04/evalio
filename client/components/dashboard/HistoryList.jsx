import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Calendar, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export function HistoryList() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/sessions/history`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="animate-pulse h-20 bg-gray-100 rounded-xl"></div>;

    if (history.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">No test history found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Recent Attempts</h3>
            <div className="space-y-3">
                {history.map((session) => (
                    <div key={session._id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.status === 'SUBMITTED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {session.status === 'SUBMITTED' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{session.test?.title || 'Unknown Test'}</h4>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(session.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {session.score}/{session.totalQuestions || '?'} Score</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/dashboard/review/${session._id}`}
                            className="flex items-center gap-2 text-sm font-medium text-[#0a3a30] hover:text-emerald-700 transition-colors"
                        >
                            Review <ArrowRight size={14} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
