"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Clock,
  AlertCircle,
  LogOut,
  User,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BookOpen, label: "Subjects", href: "/dashboard/subject" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/stats" },
  { icon: Clock, label: "History", href: "/dashboard/history" },
  { icon: AlertCircle, label: "Help", href: "/dashboard/help" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
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
          role: parsedUser.role || 'Student'
        });
      } catch (e) {
        console.error('Failed to parse user data', e);
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
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoggingOut(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.replace('/login');
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 md:w-20 flex flex-col items-center bg-white border-r border-gray-100 py-6">
      <nav className="flex-1 flex flex-col gap-6 w-full items-center">
        {navItems.map((item, index) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "p-2 rounded-xl text-gray-400 hover:text-[#0a3a30] hover:bg-emerald-50 transition-colors",
                isActive && "text-[#0a3a30] bg-emerald-50 shadow-sm"
              )}
              title={item.label}
            >
              <item.icon size={20} strokeWidth={2} />
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-col gap-3 w-full items-center mt-auto relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((open) => !open)}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-dashed border-gray-200 text-gray-500 hover:text-[#0a3a30] hover:border-[#0a3a30]/30 hover:bg-emerald-50 transition-colors"
          title={user.name}
        >
          <div className="h-9 w-9 overflow-hidden rounded-full bg-[#0a3a30] text-white text-xs font-bold flex items-center justify-center">
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute bottom-14 left-3 md:left-16 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
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
                {loggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
