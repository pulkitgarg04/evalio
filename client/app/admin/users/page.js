"use client";
import { Search, MoreVertical, Trash2, Edit } from 'lucide-react';

const users = [
  { id: 1, name: "Nil Yeager", email: "nil@example.com", role: "Student", joinDate: "Jan 12, 2024", status: "Active" },
  { id: 2, name: "Theron Trump", email: "theron@example.com", role: "Student", joinDate: "Feb 05, 2024", status: "Inactive" },
  { id: 3, name: "Tyler Mark", email: "tyler@example.com", role: "Student", joinDate: "Mar 22, 2024", status: "Active" },
  { id: 4, name: "Johen Mark", email: "johen@example.com", role: "Instructor", joinDate: "Mar 25, 2024", status: "Active" },
  { id: 5, name: "Sarah Smith", email: "sarah@example.com", role: "Student", joinDate: "Apr 01, 2024", status: "Active" },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
         <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            + Add User
         </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
         <Search className="text-gray-400" size={20} />
         <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="flex-1 outline-none text-sm text-gray-700"
         />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-gray-50 border-b border-gray-200">
               <tr>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Join Date</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                   <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
               </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
               {users.map((user) => (
                   <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                               <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                   {user.name.charAt(0)}
                               </div>
                               <div>
                                   <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                                   <p className="text-xs text-gray-400">{user.email}</p>
                               </div>
                           </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                       <td className="px-6 py-4 text-sm text-gray-500">{user.joinDate}</td>
                       <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                               {user.status}
                           </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                               <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                   <Edit size={16} />
                               </button>
                               <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                   <Trash2 size={16} />
                               </button>
                           </div>
                       </td>
                   </tr>
               ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
