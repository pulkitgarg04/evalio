import Link from 'next/link';

const instructors = [
  { name: "Nil Yeager", role: "5 Design Course", initial: 'N', color: 'bg-emerald-500' },
  { name: "Theron Trump", role: "5 Design Course", initial: 'T', color: 'bg-orange-500' },
  { name: "Tyler Mark", role: "5 Design Course", initial: 'T', color: 'bg-blue-500' },
  { name: "Johen Mark", role: "5 Design Course", initial: 'J', color: 'bg-indigo-500' },
];

export function InstructorsList() {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Best Instructors</h3>
        <Link href="/dashboard/instructors" className="text-sm font-medium text-gray-400 hover:text-[#0a3a30]">
          See All
        </Link>
      </div>

      <div className="space-y-6">
        {instructors.map((instructor, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full ${instructor.color} flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-sm`}>
                {instructor.initial}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{instructor.name}</p>
                <p className="text-xs text-gray-400">{instructor.role}</p>
              </div>
            </div>
            
            <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-emerald-50 hover:text-[#0a3a30] hover:border-emerald-200 transition-all">
              Courses
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
