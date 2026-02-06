import React from 'react';
import Link from 'next/link';
import { MoreVertical, LayoutGrid, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SubjectGrid({ linkPrefix = '/dashboard/subject' }) {
    const [activeTab, setActiveTab] = React.useState('All');
    const [subjects, setSubjects] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [userYear, setUserYear] = React.useState(1);
    const [userName, setUserName] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                let year = 1;

                const userRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/me`, {
                    credentials: 'include'
                });

                if (userRes.ok) {
                    const userData = await userRes.json();
                    year = userData.study_year || 1;
                    setUserYear(year);
                    setUserName(userData.username || 'Student');
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/subjects?year=${year}`);
                if (res.ok) {
                    const data = await res.json();
                    setSubjects(data);
                }
            } catch (error) {
                console.error("Failed to fetch subjects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading courses...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">My Subjects</h1>
                    <p className="text-gray-500">Year {userYear} Curriculum • {subjects.length} Subjects Available</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                {subjects.map((subject) => {
                    return (
                        <Link href={`${linkPrefix}/${subject._id}`} key={subject._id} className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-100 transition-all duration-300 flex flex-col h-full">
                            <div className="flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={cn("text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600")}>
                                        YEAR {subject.year || userYear}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#0a3a30] transition-colors">
                                    {subject.name}
                                </h3>

                                <p className="text-sm text-gray-500 mb-6">
                                    {subject.testCount > 0 ? `${subject.testCount} Tests Available` : 'No tests yet'}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm font-medium">
                                    <span className="text-gray-400 group-hover:text-[#0a3a30] transition-colors">View Tests</span>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#0a3a30] group-hover:text-white transition-all">
                                        <Plus size={16} className="transform group-hover:rotate-90 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
                {subjects.length === 0 && (
                    <div className="col-span-full py-16 text-center text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-lg font-medium text-gray-500">No subjects found for Year {userYear}.</p>
                        <p className="text-sm mt-2">Please contact your administrator.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
