"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Header } from '@/components/layout/Header';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#0a3a30] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#0a3a30] font-medium">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col pl-16 md:pl-20 transition-all duration-300">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
