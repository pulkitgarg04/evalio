export function SubjectDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-gray-100" />
        <div className="space-y-2">
          <div className="h-9 w-56 rounded-xl bg-gray-200" />
          <div className="h-5 w-72 rounded-lg bg-gray-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 w-24 rounded-full bg-gray-100" />
              <div className="h-4 w-12 rounded bg-gray-100" />
            </div>

            <div className="space-y-2 mb-6">
              <div className="h-6 w-4/5 rounded bg-gray-200" />
              <div className="h-4 w-3/5 rounded bg-gray-100" />
            </div>

            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="h-4 w-20 rounded bg-gray-100" />
              <div className="h-5 w-20 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
