"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', uv: 20 },
  { name: 'Feb', uv: 35 },
  { name: 'Mar', uv: 38 },
  { name: 'Apr', uv: 30 },
  { name: 'May', uv: 55 },
  { name: 'Jun', uv: 65 },
];

export function ActivityChart() {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Monthly Progress</h3>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[#0a3a30] hover:bg-emerald-100 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </button>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0a3a30" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0a3a30" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              cursor={{stroke: '#0a3a30', strokeWidth: 1, strokeDasharray: '4 4'}}
            />
            <Area type="monotone" dataKey="uv" stroke="#0a3a30" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
