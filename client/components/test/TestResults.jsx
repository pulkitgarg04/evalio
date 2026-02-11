import Link from 'next/link';
import useTestStore from '@/store/useTestStore';
import { Trophy, RefreshCw, Home } from 'lucide-react';

export function TestResults() {
  const { questions, answers, activeTest, resetTest, topicAnalysis, difficultyAnalysis } = useTestStore();
  let correctCount = 0;
  questions.forEach(q => {
    const selectedOptionIndex = answers[q.id];
    if (selectedOptionIndex !== undefined && q.options[selectedOptionIndex] === q.correctAnswer) {
      correctCount++;
    }
  });

  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const passed = scorePercentage >= 60;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full"></div>
        <div className="relative h-24 w-24 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl rotate-12 transform hover:rotate-0 transition-transform duration-500">
          <Trophy size={48} className="text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Completed!</h1>
      <p className="text-xl text-gray-500 mb-8">You have successfully finished <span className="text-primary font-bold">{activeTest?.title || 'the test'}</span>.</p>

      <div className="grid grid-cols-3 gap-6 w-full mb-10">
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400 font-bold uppercase mb-1">Score</p>
          <p className={`text-4xl font-bold ${passed ? 'text-green-500' : 'text-orange-500'}`}>{scorePercentage}%</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400 font-bold uppercase mb-1">Correct</p>
          <p className="text-4xl font-bold text-gray-800">{correctCount}/{questions.length}</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400 font-bold uppercase mb-1">Time Taken</p>
          <p className="text-4xl font-bold text-gray-800">12:30</p>
        </div>
      </div>

      <div className="flex gap-4 mb-12">
        <Link
          href="/dashboard"
          onClick={resetTest}
          className="px-8 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Home size={18} /> Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-12">
        {topicAnalysis?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Topic Analysis
            </h3>
            <div className="space-y-6">
              {topicAnalysis.map((topic) => (
                <div key={topic.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">{topic.name}</span>
                    <span className={`font-bold ${topic.accuracy < 50 ? 'text-red-500' : topic.accuracy < 80 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {topic.accuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${topic.accuracy < 50 ? 'bg-red-500' : topic.accuracy < 80 ? 'bg-yellow-400' : 'bg-green-500'
                        }`}
                      style={{ width: `${topic.accuracy}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                    <span>{topic.correct} / {topic.total} Correct</span>
                    {topic.incorrect > 0 && <span>{topic.incorrect} Incorrect</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        { difficultyAnalysis?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Difficulty Analysis
            </h3>
            <div className="space-y-6">
              {difficultyAnalysis.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">{item.name}</span>
                    <span className={`font-bold ${item.accuracy < 50 ? 'text-red-500' : item.accuracy < 80 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {item.accuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${item.accuracy < 50 ? 'bg-red-500' : item.accuracy < 80 ? 'bg-yellow-400' : 'bg-green-500'
                        }`}
                      style={{ width: `${item.accuracy}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                    <span>{item.correct} / {item.total} Correct</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}  
      </div>

      <div className="w-full text-left max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analysis</h2>
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const selectedIdx = answers[q.id];
            const isCorrect = selectedIdx !== undefined && q.options[selectedIdx] === q.correctAnswer;
            const isSkipped = selectedIdx === undefined;

            return (
              <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'border-green-200 bg-green-50/50' : isSkipped ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50/50'}`}>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${q.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
                          q.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {q.difficulty}
                      </span>
                      {q.topic && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {q.topic}
                        </span>
                      )}
                      {q.subTopic && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {q.subTopic}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{q.text}</h3>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedIdx === optIdx;
                        const isTarget = q.correctAnswer === opt;
                        const isOptionCorrect = opt === q.correctAnswer;

                        let bgClass = "bg-white border-gray-200";
                        if (isSelected && isOptionCorrect) bgClass = "bg-green-100 border-green-500 text-green-800";
                        else if (isSelected && !isOptionCorrect) bgClass = "bg-red-100 border-red-500 text-red-800";
                        else if (isOptionCorrect) bgClass = "bg-green-50 border-green-400 text-green-700 dashed border";

                        return (
                          <div key={optIdx} className={`p-3 rounded-lg border text-sm flex items-center justify-between ${bgClass}`}>
                            <span>{opt}</span>
                            {isSelected && <span className="text-xs font-bold uppercase tracking-wider">{isOptionCorrect ? 'Correct' : 'Your Answer'}</span>}
                            {!isSelected && isOptionCorrect && <span className="text-xs font-bold uppercase tracking-wider">Correct Answer</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
