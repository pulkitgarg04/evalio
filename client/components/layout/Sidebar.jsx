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
  { icon: LayoutDashboard, label: "Statistics", href: "/dashboard/stats" },
  { icon: Clock, label: "History", href: "/dashboard/history" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: AlertCircle, label: "Help", href: "/dashboard/help" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Guest', role: 'Student', study_year: '' });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.username || parsedUser.name || 'User',
          role: parsedUser.role || 'Student',
          study_year: parsedUser.study_year || ''
        });
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-[#f8f9fa] border-r border-gray-200">
      <div className="px-6 py-6 border-b border-transparent">
        <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-\[#0ddc90\] text-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
                E
            </div>
            <span className="text-xl font-semibold text-slate-800 tracking-tight">Evalio</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                    ? "text-slate-900 bg-\[#0ddc90\]/10" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-gray-100/50"
              )}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive ? "text-slate-900" : "text-slate-400")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-col gap-3 w-full p-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                  <span>{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.study_year ? `Year ${user.study_year}` : 'Student'}
                  </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-1 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
              <span>{loggingOut ? 'Logging out...' : 'Log out'}</span>
            </button>
        </div>
      </div>
    </aside>
  );
}
