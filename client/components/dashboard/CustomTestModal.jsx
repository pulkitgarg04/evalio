"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, BookOpen, BarChart } from 'lucide-react';
import useTestStore from '@/store/useTestStore';
import { categories } from '@/lib/mockData';

export function CustomTestModal({ isOpen, onClose }) {
  const router = useRouter();
  const { startTest } = useTestStore();
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [difficulty, setDifficulty] = useState('Medium');

  if (!isOpen) return null;

  const handleStart = () => {
    const testId = `custom-${Date.now()}`;
    const settings = {
        title: `Custom ${difficulty} Test`,
        category: selectedCategory,
        difficulty: difficulty,
        duration: 15,
        questionCount: 10
    };
    
    startTest(testId, settings);
    onClose();
    router.push(`/dashboard/test/${testId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Create Custom Test</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-500 uppercase mb-3 block">Topic</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-gray-100 hover:border-gray-200 text-gray-600'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                  <span className="font-medium text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="text-sm font-bold text-gray-500 uppercase mb-3 block">Difficulty</label>
             <div className="flex bg-gray-50 rounded-xl p-1">
               {['Easy', 'Medium', 'Hard'].map((diff) => (
                 <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        difficulty === diff
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                 >
                    {diff}
                 </button>
               ))}
             </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <BookOpen size={18} />
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
