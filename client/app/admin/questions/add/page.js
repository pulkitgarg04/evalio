"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddQuestionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        questionId: '',
        difficulty: 'Easy',
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        subject: '',
        correctAnswer: ''
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            questionId: `Q-${Date.now().toString().slice(-6)}`
        }));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const options = [
                formData.option1.trim(),
                formData.option2.trim(),
                formData.option3.trim(),
                formData.option4.trim()
            ];

            if (options.some(opt => !opt)) {
                throw new Error("All 4 options are required");
            }

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user._id) {
                throw new Error("You must be logged in as admin");
            }

            const payload = {
                questionId: formData.questionId,
                difficulty: formData.difficulty,
                question: formData.question,
                options: options,
                subject: formData.subject,
                correctAnswer: formData.correctAnswer
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': user._id
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create question');
            }

            setSuccess('Question created successfully!');
            setFormData({
                questionId: `Q-${Date.now().toString().slice(-6)}`,
                difficulty: 'Easy',
                question: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                subject: '',
                correctAnswer: ''
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/admin" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Question</h1>
                    <p className="text-gray-500">Create a question for the question bank</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
                {success && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="questionId" className="text-sm font-bold text-gray-700">Question ID</label>
                            <input
                                id="questionId"
                                type="text"
                                value={formData.questionId}
                                onChange={handleChange}
                                className="w-full h-12 rounded-xl border border-gray-200 px-4 font-mono text-sm bg-gray-50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-bold text-gray-700">Subject</label>
                            <input
                                id="subject"
                                type="text"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="e.g. Mathematics, Operating Systems"
                                className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="difficulty" className="text-sm font-bold text-gray-700">Difficulty</label>
                            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                                {['Easy', 'Medium', 'Hard'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, difficulty: level })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.difficulty === level ? 'bg-white shadow text-[#0a3a30]' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="question" className="text-sm font-bold text-gray-700">Question Text</label>
                        <textarea
                            id="question"
                            value={formData.question}
                            onChange={handleChange}
                            placeholder="Enter the question here..."
                            className="w-full h-32 rounded-xl border border-gray-200 p-4 resize-none"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700">Options</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['option1', 'option2', 'option3', 'option4'].map((opt, idx) => (
                                <div key={opt} className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <input
                                        id={opt}
                                        type="text"
                                        value={formData[opt]}
                                        onChange={handleChange}
                                        placeholder={`Option ${idx + 1}`}
                                        className={`w-full h-12 rounded-xl border px-4 pl-12 transition-colors ${formData.correctAnswer === formData[opt] && formData[opt] ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200'}`}
                                        required
                                    />
                                    {formData[opt] && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, correctAnswer: formData[opt] })}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${formData.correctAnswer === formData[opt] ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                        >
                                            {formData.correctAnswer === formData[opt] ? 'Correct' : 'Mark Correct'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {formData.correctAnswer === '' && <p className="text-xs text-red-400 font-medium ml-1">* Please mark one option as the correct answer</p>}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !formData.correctAnswer}
                            className="h-12 px-8 rounded-xl bg-[#0a3a30] text-white font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#022c22] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? 'Saving Question...' : 'Save Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
