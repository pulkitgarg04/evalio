import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-1 flex-col pl-16 md:pl-20 transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-white px-6 md:px-10 border-b border-gray-200 shadow-sm">
             <h1 className="text-xl font-bold text-gray-800">Admin Portal</h1>
             <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-gray-900">Admin User</p>
                     <p className="text-xs text-gray-500">Super Admin</p>
                 </div>
                 <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">A</div>
             </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
