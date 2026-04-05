"use client";
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { finalizeExpiredSessionsOnClient } from '@/store/useTestStore';

export function DashboardLayoutClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const isTestPage = pathname?.includes('/test/');

  useEffect(() => {
    const checkAuth = async () => {
      const userStr = localStorage.getItem('user');

      if (!userStr) {
        router.replace('/login');
        return;
      }

      try {
        JSON.parse(userStr);

        await finalizeExpiredSessionsOnClient();
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed', error);
        router.replace('/login');
      }
    };

    void checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30" />
    );
  }

  if (isTestPage) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/30 font-sans text-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64 transition-all duration-300">
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
