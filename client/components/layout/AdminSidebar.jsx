"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    PlusCircle,
    Home,
    LogOut,
    BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Tests", href: "/admin/tests" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: BookOpen, label: "Subjects", href: "/admin/subjects" },
    { icon: PlusCircle, label: "Add Question", href: "/admin/questions/add" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.replace('/login');
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-16 md:w-20 flex flex-col items-center bg-white border-r border-gray-100 py-6">
            <nav className="flex-1 flex flex-col gap-6 w-full items-center">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
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
                    );
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
