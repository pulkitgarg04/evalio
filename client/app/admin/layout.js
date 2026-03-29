"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.replace('/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
          router.replace('/dashboard');
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed", error);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#0ddc90] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-700 font-medium">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/30 font-sans text-slate-900">
      <AdminSidebar />
      <div className="flex flex-1 flex-col pl-64 transition-all duration-300">
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
