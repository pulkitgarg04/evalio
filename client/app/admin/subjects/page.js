"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [year, setYear] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/subjects`);
            if (!res.ok) throw new Error('Failed to fetch subjects');
            const data = await res.json();
            setSubjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        setAdding(true);
        setError('');
        setSuccess('');

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user._id) throw new Error("You must be logged in as admin");

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/subjects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': user._id
                },
                body: JSON.stringify({ name: newSubject, year: parseInt(year) })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to add subject');

            setSuccess('Subject added successfully');
            setNewSubject('');
            setYear(1);
            fetchSubjects();
        } catch (err) {
            setError(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!confirm('Are you sure you want to delete this subject?')) return;

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/subjects/${id}`, {
                method: 'DELETE',
                headers: {
                    'userId': user._id
                }
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete subject');
            }

            setSuccess('Subject deleted');
            fetchSubjects();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-[#0a3a30] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-50 text-[#0a3a30] rounded-2xl">
                    <BookOpen size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-[#0a3a30]">Manage Subjects</h1>
                    <p className="text-gray-500">Add or remove subjects for questions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-8">
                        <h3 className="font-bold text-gray-800 mb-4">Add New Subject</h3>
                        <form onSubmit={handleAddSubject} className="space-y-4">
                            <div>
                                <label htmlFor="subjectName" className="text-sm font-semibold text-gray-600 block mb-1">Subject Name</label>
                                <input
                                    id="subjectName"
                                    type="text"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    placeholder="e.g. Mathematics"
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:border-[#0a3a30] focus:ring-1 focus:ring-[#0a3a30] transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="year" className="text-sm font-semibold text-gray-600 block mb-1">Year</label>
                                <select
                                    id="year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:border-[#0a3a30] focus:ring-1 focus:ring-[#0a3a30] transition-all bg-white"
                                >
                                    {[1, 2, 3, 4].map(y => (
                                        <option key={y} value={y}>Year {y}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={adding || !newSubject.trim()}
                                className="w-full h-12 rounded-xl bg-[#0a3a30] text-white font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#022c22] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {adding ? 'Adding...' : <><Plus size={18} /> Add Subject</>}
                            </button>
                        </form>
                        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
                        {success && <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-xl text-sm font-medium flex items-center gap-2"><CheckCircle size={16} /> {success}</div>}
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-bold text-gray-800 mb-2">Existing Subjects ({subjects.length})</h3>
                    {subjects.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
                            <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No subjects found. Add one to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {subjects.map((subject) => (
                                <div key={subject._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group hover:border-[#0a3a30] transition-colors">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{subject.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                                Year {subject.year || 1}
                                            </span>
                                            <p className="text-xs text-gray-400 font-mono">
                                                Questions: {subject.questionCount}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSubject(subject._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Delete Subject"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
