import React from 'react';
import Link from 'next/link';
import { premadeTests, categories } from '@/lib/mockData';
import { MoreVertical, LayoutGrid, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CourseGrid() {
  const [activeTab, setActiveTab] = React.useState('All');
  const tabs = ['All', 'Published', 'Draft', 'Archived'];

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Courses</h1>
            <p className="text-gray-500">Manage and track your learning progress</p>
         </div>
         
         <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
            {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                    activeTab === tab 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                  )}
                >
                  {tab}
                </button>
            ))}
         </div>
         
         <div className="flex items-center gap-2">
             <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
                  <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                      <LayoutGrid size={20} />
                  </button>
                   <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                      <List size={20} />
                  </button>
             </div>
             <button className="h-10 w-10 bg-[#0a3a30] rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 hover:scale-105 transition-transform">
                <Plus size={24} />
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {premadeTests.map((test) => {
          const category = categories.find(c => c.id === test.category);
          
          return (
            <div key={test.id} className="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300 flex flex-col">
              <div className={cn("w-full aspect-[4/3] rounded-2xl mb-4 relative overflow-hidden", test.image)}>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button className="bg-white/90 backdrop-blur text-gray-900 px-6 py-2 rounded-full font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg">
                           Explore
                       </button>
                  </div>
              </div>
              
              <div className="flex flex-col flex-1">
                 <div className="flex justify-between items-start mb-2">
                     <span className={cn("text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600", category?.color.replace('bg-', 'text-'))}>
                         {test.category.toUpperCase()}
                     </span>
                     {test.difficulty === 'Easy' && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">New</span>}
                 </div>
                 
                 <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#0a3a30] transition-colors line-clamp-2">
                     {test.title}
                 </h3>
                 
                 <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400">
                     <div className="flex items-center gap-1.5">
                         <div className="w-4 h-4 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                         </div>
                         {test.questionCount} Tests
                     </div>
                     <div className="flex items-center gap-1.5">
                         <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                         </div>
                         {test.duration} min
                     </div>
                 </div>
              </div>
            </div>
          );
        })}
        
        {[...premadeTests, ...premadeTests].map((test, i) => {
             const category = categories.find(c => c.id === test.category);
             return (
            <div key={`${test.id}-${i}`} className="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300 flex flex-col">
              <div className={cn("w-full aspect-[4/3] rounded-2xl mb-4 relative overflow-hidden", test.image)}>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Link href={`/dashboard/test/${test.id}`} className="bg-white/90 backdrop-blur text-gray-900 px-6 py-2 rounded-full font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg">
                           Start
                       </Link>
                  </div>
              </div>
              
              <div className="flex flex-col flex-1">
                 <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-500">
                         {test.category.toUpperCase()}
                     </span>
                 </div>
                 
                 <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#0a3a30] transition-colors line-clamp-2">
                     {test.title}
                 </h3>
                 
                 <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400">
                     <div className="flex items-center gap-1.5">
                         <div className="w-4 h-4 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                         </div>
                         {test.questionCount} Tests
                     </div>
                     <div className="flex items-center gap-1.5">
                         <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                         </div>
                         {test.duration} min
                     </div>
                 </div>
              </div>
            </div>
          )})}
      </div>
    </div>
  );
}
