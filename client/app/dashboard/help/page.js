"use client";
import { useState } from 'react';
import { Mail, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HelpPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Help Center</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-[#0a3a30] mb-6 flex items-center gap-2">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <FAQItem
                        question="How do I access my past test results?"
                        answer="You can view all your past test attempts, scores, and detailed analysis in the 'History' tab from the sidebar."
                    />
                    <FAQItem
                        question="What happens if I lose internet connection during a test?"
                        answer="Don't worry! Your progress is saved locally. Once your connection is restored, you can resume from where you left off. However, the timer will continue to run."
                    />
                    <FAQItem
                        question="Can I retake a test?"
                        answer="Yes, you can attempt practice tests multiple times. However, specific scheduled exams may have a limit on the number of attempts allowed."
                    />
                    <FAQItem
                        question="How is my performance score calculated?"
                        answer="Your score is based on the number of correct answers. Some tests may also have negative marking as specified in the test instructions."
                    />
                </div>
            </div>

            <ContactForm />
        </div>
    );
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-100 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <span className="font-semibold text-gray-700">{question}</span>
                {isOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {answer}
                </div>
            )}
        </div>
    );
}

function ContactForm() {
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user._id) throw new Error("User not found. Please log in.");

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user._id,
                    subject: formData.subject,
                    message: formData.message
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send message");
            }

            setStatus('success');
            setFormData({ subject: '', message: '' });
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#0a3a30] mb-2 flex items-center gap-2">
                <Mail size={24} /> Contact Admin
            </h2>
            <p className="text-gray-500 mb-6 text-sm">Have a query that's not answered above? Send us a message directly.</p>

            {status === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Send size={20} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-800 mb-1">Message Sent!</h3>
                    <p className="text-emerald-600 text-sm">We have received your query and will get back to you shortly.</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-800 underline"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Issue with Test #123"
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a3a30]/20 focus:border-[#0a3a30] transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            required
                            rows={5}
                            placeholder="Describe your issue or query in detail..."
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a3a30]/20 focus:border-[#0a3a30] transition-all resize-none"
                        ></textarea>
                    </div>

                    {status === 'error' && (
                        <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
                            {errorMsg || "Something went wrong. Please try again."}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="px-6 py-2 bg-[#0a3a30] text-white font-bold rounded-lg shadow-lg shadow-[#0a3a30]/10 hover:bg-[#0a3a30]/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {status === 'loading' ? 'Sending...' : (
                                <>
                                    Send Message <Send size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
