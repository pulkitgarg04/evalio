"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Clock,
  Database,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/stats" },
  { icon: BookOpen, label: "Courses", href: "/dashboard/subject" },
  { icon: Clock, label: "History", href: "/dashboard/history" },
  { icon: Database, label: "Resources", href: "/dashboard/resources" },
  { icon: AlertCircle, label: "Help", href: "/dashboard/help" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
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

      <div className="flex flex-col gap-6 w-full items-center mt-auto">
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Logout"
        >
          <LogOut size={20} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
