import useTestStore from '@/store/useTestStore';
import { Bookmark } from 'lucide-react';

export function QuestionContent() {
    const { questions, currentQuestionIndex } = useTestStore();
    const question = questions[currentQuestionIndex];

    if (!question) return null;

    return (
        <div className="h-full">
            <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Question {currentQuestionIndex + 1}</h2>
                        <div className="flex gap-2 text-xs">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-medium">{question.difficulty}</span>
                            <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded font-medium tracking-wide uppercase">+1.0</span>
                        </div>
                    </div>
                    <button className="text-gray-300 hover:text-[#0a3a30] transition-colors">
                        <Bookmark size={20} />
                    </button>
                </div>
            </div>

            <div className="prose max-w-none text-gray-800 text-lg leading-relaxed">
                {question.text}
            </div>
        </div>
    );
}
