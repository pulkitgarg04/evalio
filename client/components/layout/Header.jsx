"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, MessageSquare, Monitor, Globe, ChevronDown, User, LogOut, Loader2 } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Guest', role: 'Student' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.username || parsedUser.name || 'User',
          role: parsedUser.role || 'Student',
          avatar: parsedUser.avatar
        });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.replace('/login');
    } catch (err) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.replace('/login');
    } finally {
      setLoggingOut(false);
    }
  };

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

        <div className="flex items-center gap-3 pl-2 relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-white border border-dashed border-gray-200 p-1.5 pr-4 rounded-xl hover:border-[#0a3a30]/30 transition-colors cursor-pointer group"
          >
            <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 bg-[#0a3a30] text-white font-bold">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User"
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.textContent = user.name.charAt(0).toUpperCase(); }}
                />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-gray-800 group-hover:text-[#0a3a30] transition-colors">{user.name}</p>
              <p className="text-xs text-gray-400 font-medium">{user.role}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#0a3a30] transition-colors"
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  {loggingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
