import { Users, FileText, CheckCircle, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <FileText size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <CheckCircle size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Tests Taken</p>
                <p className="text-2xl font-bold text-gray-900">15.5k</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Activity size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Active Now</p>
                <p className="text-2xl font-bold text-gray-900">128</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[300px] flex flex-col justify-center items-center text-gray-400">
             <p>Activity Chart Placeholder</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[300px] flex flex-col justify-center items-center text-gray-400">
             <p>Recent Actions Placeholder</p>
         </div>
      </div>
    </div>
  );
}
