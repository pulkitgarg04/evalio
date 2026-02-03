import { BookMarked, MessageCircle } from 'lucide-react';

export function StatsCards() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-1 rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center group hover:border-emerald-100 transition-colors">
        <div className="mb-2 text-sm font-bold text-[#0a3a30] bg-emerald-50 px-3 py-1 rounded-full">Courses in Progress</div>
        <div className="text-5xl font-bold text-[#0a3a30] my-2 group-hover:scale-110 transition-transform">05</div>
        <BookMarked className="text-gray-300 group-hover:text-emerald-600 transition-colors" size={24} />
      </div>

      <div className="flex-1 rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center group hover:border-amber-100 transition-colors">
        <div className="mb-2 text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">Forum Discussion</div>
        <div className="text-5xl font-bold text-[#0a3a30] my-2 group-hover:scale-110 transition-transform">25</div>
        <MessageCircle className="text-gray-300 group-hover:text-amber-500 transition-colors" size={24} />
      </div>
    </div>
  );
}
