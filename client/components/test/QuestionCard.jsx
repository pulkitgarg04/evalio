import { cn } from '@/lib/utils';
import useTestStore from '@/store/useTestStore';

export function QuestionCard() {
  const { questions, currentQuestionIndex, selectAnswer, answers } = useTestStore();
  const question = questions[currentQuestionIndex];

  if (!question) return null;

  const selectedOption = answers[question.id];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
         <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Question {currentQuestionIndex + 1} of {questions.length}</span>
         <span className={cn(
             "px-3 py-1 rounded-full text-xs font-bold",
             question.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
             question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
             'bg-red-100 text-red-600'
         )}>
             {question.difficulty}
         </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => selectAnswer(question.id, index)}
            className={cn(
              "w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 group",
              selectedOption === index 
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                : "border-gray-100 bg-white hover:border-primary/50 hover:bg-gray-50"
            )}
          >
            <div className={cn(
                "h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors",
                selectedOption === index
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-gray-400 group-hover:border-primary/50"
            )}>
                {String.fromCharCode(65 + index)}
            </div>
            <span className={cn(
                "text-lg font-medium",
                selectedOption === index ? "text-primary" : "text-gray-700"
            )}>
                {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
