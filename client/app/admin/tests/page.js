"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, MoreHorizontal } from 'lucide-react';

export default function TestManagementPage() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests`);
                if (res.ok) {
                    const data = await res.json();
                    setTests(data);
                }
            } catch (error) {
                console.error("Failed to fetch tests");
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    if (loading) return <div className="p-8">Loading tests...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0a3a30]">Test Management</h2>
                <button className="bg-[#0a3a30] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#022c22] transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/10">
                    <Plus size={16} /> Create Test
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                    <div key={test._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-[#0a3a30]/30 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0a3a30]`}>
                                <BookOpen size={20} />
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-800 mb-1 group-hover:text-[#0a3a30] transition-colors">{test.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{test.questions?.length || 0} Questions • {test.duration} mins</p>

                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">{test.subject}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                            <button className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                Edit
                            </button>
                            <button className="flex-1 py-2 text-sm font-medium text-[#0a3a30] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                                Questions
                            </button>
                        </div>
                    </div>
                ))}

                <button className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-[#0a3a30]/30 hover:text-[#0a3a30] hover:bg-emerald-50/10 transition-all min-h-[250px]">
                    <Plus size={32} className="mb-2" />
                    <span className="font-bold">Create New Test</span>
                </button>
            </div>
        </div>
    );
}
