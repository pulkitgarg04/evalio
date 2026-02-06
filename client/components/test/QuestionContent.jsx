import useTestStore from '@/store/useTestStore';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuestionContent() {
    const { questions, currentQuestionIndex, toggleMark, marked } = useTestStore();
    const question = questions[currentQuestionIndex];

    if (!question) return null;

    const isMarked = marked.includes(question.id);

    return (
        <div className="h-full">
            <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Question {currentQuestionIndex + 1}</h2>
                    </div>
                    <button
                        onClick={() => toggleMark(question.id)}
                        className={cn(
                            "transition-colors",
                            isMarked ? "text-emerald-400 fill-emerald-400" : "text-gray-300 hover:text-[#0a3a30]"
                        )}
                        title={isMarked ? "Unmark for review" : "Mark for review"}
                    >
                        <Bookmark size={20} fill={isMarked ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            <div className="prose max-w-none text-gray-800 text-lg leading-relaxed">
                {question.text}
            </div>
        </div >
    );
}
