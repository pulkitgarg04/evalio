import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-16 md:pl-20 transition-all duration-300">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
