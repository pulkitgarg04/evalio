export function SubjectDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="h-10 w-10 rounded-md bg-gray-100" />
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-md bg-gray-200" />
          <div className="h-4 w-64 rounded-md bg-gray-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-md border border-gray-200 p-5 shadow-xs flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="h-5 w-20 rounded bg-gray-100" />
              <div className="h-5 w-10 rounded bg-gray-100" />
            </div>

            <div className="space-y-2 mb-6">
              <div className="h-6 w-full rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-100" />
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-gray-100" />
              <div className="h-8 w-24 rounded-md bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
