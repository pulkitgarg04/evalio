import useTestStore from '@/store/useTestStore';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export function QuestionOptions() {
    const {
        questions,
        currentQuestionIndex,
        selectAnswer,
        answers,
        nextQuestion,
        prevQuestion
    } = useTestStore();

    const question = questions[currentQuestionIndex];
    if (!question) return null;

    const selectedOption = answers[question.id];

    return (
        <div className="flex flex-col h-full">
            <h3 className="font-bold text-gray-900 mb-6">Choose any one</h3>

            <div className="space-y-3 flex-1">
                {question.options.map((option, index) => (
                    <label
                        key={index}
                        className={cn(
                            "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50",
                        )}
                    >
                        <div className="relative flex-shrink-0 mt-0.5">
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                className="peer sr-only"
                                checked={selectedOption === index}
                                onChange={() => selectAnswer(question.id, index)}
                            />
                            <div className={cn(
                                "w-5 h-5 rounded-full border border-gray-300 peer-checked:border-[#0a3a30] peer-checked:border-[6px] transition-all bg-white"
                            )}></div>
                        </div>
                        <span className={cn(
                            "text-sm text-gray-600 peer-checked:text-gray-900 transition-colors",
                            selectedOption === index ? "text-gray-900 font-medium" : ""
                        )}>
                            {option}
                        </span>
                    </label>
                ))}

                <button
                    onClick={() => selectAnswer(question.id, undefined)}
                    className="text-xs text-[#0a3a30] font-medium hover:underline mt-4 inline-block"
                >
                    Clear selection
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                    onClick={nextQuestion}
                    className="px-8 py-2.5 bg-[#0a3a30] text-white font-bold rounded shadow-lg shadow-emerald-900/10 hover:bg-[#0a3a30]/90 transition-colors text-sm"
                >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next'}
                </button>
            </div>
        </div>
    );
}
