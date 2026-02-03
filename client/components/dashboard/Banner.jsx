"use client";
import { GraduationCap, Users } from 'lucide-react';

export function Banner({ onOpenCustomTest }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#0a3a30] p-8 md:p-10 text-white shadow-xl shadow-emerald-900/10">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl text-white">
          Learn Effectively With Us!
        </h1>
        <p className="mt-4 text-emerald-100/80 text-lg">
          Get 30% off every course in January.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
           <button 
             onClick={onOpenCustomTest}
             className="px-6 py-3 bg-[#fcd34d] text-[#0a3a30] font-bold rounded-xl shadow-lg hover:bg-[#fbbf24] transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
             + Create New Course
           </button>
        </div>
        
        <div className="mt-8 flex gap-8">
           <div className="flex items-center gap-3">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
               <GraduationCap size={24} />
             </div>
             <div>
               <p className="text-sm opacity-80">Students</p>
               <p className="font-bold text-xl">75,000+</p>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
               <Users size={24} />
             </div>
             <div>
               <p className="text-sm opacity-80">Expert Mentors</p>
               <p className="font-bold text-xl">200+</p>
             </div>
           </div>
        </div>
      </div>
      
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-[url('/placeholder-pattern.png')] bg-cover mix-blend-overlay hidden md:block"></div>
      
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
      <div className="absolute right-20 bottom-0 h-32 w-32 rounded-full bg-[#fcd34d]/10 blur-2xl"></div>
    </div>
  );
}
