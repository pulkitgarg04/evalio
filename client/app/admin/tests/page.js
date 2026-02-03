"use client";
import { Search, Plus, BookOpen, MoreHorizontal } from 'lucide-react';
import { premadeTests } from '@/lib/mockData';

export default function TestManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-gray-800">Test Management</h2>
         <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Plus size={16} /> Create Test
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premadeTests.map((test) => (
              <div key={test.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                      <div className={`h-10 w-10 rounded-xl ${test.image} flex items-center justify-center text-gray-700`}>
                          <BookOpen size={20} />
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={20} />
                      </button>
                  </div>
                  
                  <div>
                      <h3 className="font-bold text-gray-800 mb-1">{test.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{test.questionCount} Questions • {test.duration} mins</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">{test.difficulty}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600 uppercase">{test.category}</span>
                      </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                      <button className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                          Edit
                      </button>
                      <button className="flex-1 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                          Questions
                      </button>
                  </div>
              </div>
          ))}

          <button className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/10 transition-all min-h-[250px]">
              <Plus size={32} className="mb-2" />
              <span className="font-bold">Create New Test</span>
          </button>
      </div>
    </div>
  );
}
