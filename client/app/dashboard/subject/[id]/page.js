"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, FileText, ChevronRight } from 'lucide-react';

export default function SubjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjectName, setSubjectName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/subjects`);
                if (!subRes.ok) throw new Error('Failed to fetch subjects');
                const subjects = await subRes.json();
                const subject = subjects.find(s => s._id === params.id);

                if (!subject) {
                    setLoading(false);
                    return;
                }

                setSubjectName(subject.name);

                const testsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests?subject=${encodeURIComponent(subject.name)}`);
                if (testsRes.ok) {
                    const testsData = await testsRes.json();
                    setTests(testsData);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-[#0a3a30] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!subjectName) {
        return <div className="p-8 text-center text-gray-500">Subject not found.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[#0a3a30]">{subjectName}</h1>
                    <p className="text-gray-500">Available tests and assessments</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 font-medium">No tests available for this subject yet.</p>
                    </div>
                ) : (
                    tests.map(test => (
                        <div key={test._id} className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:border-[#0a3a30]/20">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                                    {test.difficulty || 'Assessment'}
                                </span>
                                <div className="text-gray-400 text-xs font-mono">{test.questions?.length || 0} Qs</div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#0a3a30] line-clamp-2">
                                {test.title}
                            </h3>

                            <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                                {test.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center text-xs text-gray-400 font-medium gap-1">
                                    <Clock size={14} /> {test.duration} mins
                                </div>
                                <Link
                                    href={`/dashboard/test/${test._id}`}
                                    className="flex items-center gap-1 text-sm font-bold text-[#0a3a30] group-hover:translate-x-1 transition-transform"
                                >
                                    Start Test <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
