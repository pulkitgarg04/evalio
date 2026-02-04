import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  HelpCircle,
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/users" },
  { icon: FileText, label: "Tests", href: "/admin/tests" },
  { icon: HelpCircle, label: "Add Question", href: "/admin/questions/add" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 md:w-20 flex flex-col items-center bg-gray-900 border-r border-gray-800 py-6">
      <div className="mb-8">
        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-6 w-full items-center">
        {navItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            className={cn(
              "p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            )}
            title={item.label}
          >
            <item.icon size={20} strokeWidth={2} />
          </Link>
        ))}
      </nav>

      <Link href="/login" className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors">
          <LogOut size={20} />
      </Link>
    </aside>
  );
}
