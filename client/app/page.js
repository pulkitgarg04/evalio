"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BarChart3, Target, CheckCircle2, LayoutDashboard, Brain, FileText, Check } from 'lucide-react';

import Footer from '@/components/layout/Footer';
import LandingNavbar from '@/components/layout/LandingNavbar';

const chartData = [
  { outer: 45, inner: 50 }, { outer: 76, inner: 42 }, { outer: 34, inner: 58 }, { outer: 88, inner: 48 },
  { outer: 28, inner: 45 }, { outer: 92, inner: 52 }, { outer: 55, inner: 60 }, { outer: 68, inner: 44 },
  { outer: 22, inner: 55 }, { outer: 50, inner: 40 }, { outer: 80, inner: 56 }, { outer: 42, inner: 47 },
  { outer: 65, inner: 51 }, { outer: 85, inner: 59 }, { outer: 30, inner: 43 }, { outer: 70, inner: 54 }
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0ddc90] selection:text-slate-900">
      <LandingNavbar />

      <section className="relative pt-[180px] pb-20 lg:pt-[220px] lg:pb-32 bg-[#f6fdff] overflow-hidden text-center z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[#0ddc90]/20 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h1 className="text-[3.5rem] lg:text-[5.5rem] font-bold tracking-tight text-[#0f172a] mb-8 leading-[1.05]">
            Turn your exams into <br className="hidden md:block"/> success stories.
          </h1>
          <p className="text-xl lg:text-[22px] text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-normal">
            The platform for automated assessments, personalized learning paths,<br className="hidden sm:block"/> and real-time analytics
          </p>

          <div className="relative mx-auto w-full max-w-[1100px]">
            <div className="rounded-2xl bg-white p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 ring-1 ring-black/5">
              <div className="bg-[#f8fafc] rounded-xl overflow-hidden border border-slate-100 flex flex-col min-h-[500px]">
                <div className="w-full bg-white border-b border-slate-100 p-4 flex gap-2 flex-col lg:flex-row items-start lg:items-center justify-between">
                    <div className="flex items-center gap-6 w-full text-slate-400 font-semibold text-sm px-4">
                        <span className="flex items-center gap-2.5 text-slate-800"><div className="w-2.5 h-2.5 rounded-full bg-[#0ddc90]"></div> Dashboard</span>
                        <span className="flex items-center gap-2.5 hover:text-slate-600 cursor-pointer"><div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div> Tests</span>
                        <span className="flex items-center gap-2.5 hover:text-slate-600 cursor-pointer"><div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div> Analysis</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 mr-4"></div>
                </div>
                
                <div className="p-8 w-full flex-1">
                    <div className="flex gap-5 items-center mb-12">
                        <div className="h-20 w-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                            <Target className="text-[#0ddc90]" size={36}/>
                        </div>
                        <div className="text-left space-y-3">
                            <div className="h-5 w-32 bg-slate-200 rounded-md"></div>
                            <div className="flex items-baseline gap-3">
                                <div className="h-10 w-48 bg-slate-800 rounded-md"></div>
                                <div className="h-5 w-16 bg-[#0ddc90]/20 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                    <div className="h-72 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex items-end gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-[1px] bg-slate-100 shadow-[0_0_30px_#0ddc90] transform rotate-3 origin-right opacity-30 mt-36"></div>
                        {chartData.map((data, i) => (
                        <div key={i} className="flex-1 bg-slate-50 border border-slate-100 rounded-t-md relative group flex flex-col justify-end" style={{ height: `${data.outer}%` }}>
                            <div className="w-full bg-[#0ddc90] rounded-t-md opacity-20 absolute bottom-0" style={{ height: `100%` }}></div>
                            <div className="w-full bg-[#0ddc90] rounded-t-lg group-hover:bg-[#0bc07d] transition-colors relative z-10 shadow-sm" style={{ height: `${data.inner}%` }}></div>
                        </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-400/80 uppercase tracking-widest mb-10">Made for the students of</p>
          <div className="flex flex-wrap items-center justify-center gap-16 lg:gap-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-100">
            <img className="h-12 object-contain" src="/cu-logo.webp" alt="Chitkara University" />
          </div>
        </div>
      </div>

      <section className="py-24 lg:py-32 bg-white relative" id="features">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-[#f7f9fc] border border-slate-100/60 rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden group">
              <h3 className="text-[26px] font-bold text-slate-900 mb-4">Online MCQ Tests</h3>              
              <p className="text-slate-500 mb-12 max-w-md text-lg leading-relaxed">Practice MCQ tests for all subjects in your academic year to strengthen your understanding.</p>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative z-10 w-full overflow-hidden">
                 <div className="flex border-b border-gray-50 pb-3 mb-4 items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#0ddc90]"/>
                    <span className="text-sm font-bold text-slate-700">test_operating_system</span>
                 </div>
                 <div className="space-y-3 opacity-60">
                    <div className="h-2.5 bg-slate-200 rounded-full w-1/3"></div>
                    <div className="h-2.5 bg-slate-200 rounded-full w-1/2"></div>
                    <div className="h-2.5 bg-slate-200 rounded-full w-1/4"></div>
                    <div className="h-2.5 bg-slate-200 rounded-full w-2/3"></div>
                    <div className="h-2.5 bg-slate-200 rounded-full w-1/3"></div>
                 </div>
              </div>
            </div>

            <div className="bg-[#f7f9fc] border border-slate-100/60 rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden group">
              <h3 className="text-[26px] font-bold text-slate-900 mb-4">Detailed Analysis</h3>
              <p className="text-slate-500 mb-12 max-w-md text-lg leading-relaxed">Get a detailed analysis after each test to understand mistakes, track performance trends.</p>
              
              <div className="flex items-center justify-start gap-4 flex-wrap">
                 <div className="space-y-3">
                   <div className="px-4 py-2.5 bg-white border border-rose-100 text-rose-600 text-[13px] font-bold rounded-xl shadow-sm w-36 text-center flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Wrong Option</div>
                   <div className="px-4 py-2.5 bg-white border border-amber-100 text-amber-600 text-[13px] font-bold rounded-xl shadow-sm w-36 text-center flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Not Attempted</div>
                 </div>
                 <div className="hidden sm:block h-0.5 w-12 bg-slate-200"></div>
                 <div className="w-16 h-16 bg-[#0ddc90]/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#0ddc90] rounded-full flex items-center justify-center shadow-[0_0_20px_#0ddc90]">
                        <Check size={16} className="text-white font-bold"/>
                    </div>
                 </div>
                 <div className="hidden sm:block h-0.5 w-12 bg-slate-200"></div>
                 <div className="px-4 py-2.5 bg-[#0ddc90] text-slate-900 text-[13px] font-bold rounded-xl shadow-md flex items-center justify-center gap-2"><Check size={16}/> Correct Option</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
