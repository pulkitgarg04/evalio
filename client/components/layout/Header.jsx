"use client";
import { Search, Bell, MessageSquare, Monitor, Globe } from 'lucide-react';
import { currentUser } from '@/lib/mockData';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-white px-6 md:px-10 border-b border-gray-50/50 backdrop-blur-sm bg-white/80">
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-lg">
        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="h-10 w-full rounded-2xl bg-gray-50 pl-10 pr-4 text-sm outline-none ring-1 ring-gray-100 focus:ring-primary/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-4 text-gray-400">
          <button className="p-2 hover:text-[#0a3a30] hover:bg-emerald-50 rounded-full transition-colors hidden sm:block">
            <Monitor size={20} />
          </button>
          <button className="p-2 hover:text-[#0a3a30] hover:bg-emerald-50 rounded-full transition-colors hidden sm:block">
            <Bell size={20} />
          </button>
          <button className="p-2 hover:text-[#0a3a30] hover:bg-emerald-50 rounded-full transition-colors hidden sm:block">
            <MessageSquare size={20} />
          </button>
           <button className="flex items-center gap-1 p-2 hover:text-[#0a3a30] hover:bg-emerald-50 rounded-full transition-colors hidden sm:block">
            <Globe size={20} />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-3 pl-2">
           <div className="flex items-center gap-3 bg-white border border-dashed border-gray-200 p-1.5 pr-4 rounded-xl hover:border-[#0a3a30]/30 transition-colors cursor-pointer group">
             <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-200">
               <img 
                 src={currentUser.avatar} 
                 alt="User" 
                 className="h-full w-full object-cover"
                 onError={(e) => {e.target.style.display='none'; e.target.parentNode.classList.add('bg-[#0a3a30]', 'flex', 'items-center', 'justify-center'); e.target.parentNode.innerHTML='<span class="text-white font-bold">NY</span>'}}
               />
             </div>
             <div className="hidden md:block text-left">
               <p className="text-sm font-bold text-gray-800 group-hover:text-[#0a3a30] transition-colors">{currentUser.name}</p>
               <p className="text-xs text-gray-400 font-medium">{currentUser.role}</p>
             </div>
              <svg className="w-4 h-4 text-gray-300 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
           </div>
        </div>
      </div>
    </header>
  );
}
