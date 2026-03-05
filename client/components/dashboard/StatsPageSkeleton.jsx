export function StatsPageSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl animate-pulse">
      <div className="space-y-1 mb-8">
        <div className="h-8 w-48 rounded-md bg-gray-200" />
        <div className="h-4 w-80 rounded-md bg-gray-100" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-md border border-gray-200 p-5 shadow-xs">
            <div className="h-4 w-24 rounded bg-gray-100 mb-3" />
            <div className="h-8 w-16 rounded bg-gray-200 mb-1" />
            {index === 3 && <div className="h-3 w-16 rounded bg-gray-100 mt-2" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-md border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-5 h-5 rounded bg-gray-100" />
          <div className="h-5 w-52 rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-50/50 rounded-md p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-12 rounded bg-gray-100" />
              </div>
              <div className="h-7 w-12 rounded bg-gray-200 mb-3" />
              <div className="h-1.5 w-full rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gray-100" />
            <div className="h-5 w-36 rounded bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-200 bg-white">
          <div className="col-span-5 h-4 w-16 rounded bg-gray-100" />
          <div className="col-span-3 h-4 w-12 rounded bg-gray-100" />
          <div className="col-span-2 h-4 w-10 rounded bg-gray-100" />
          <div className="col-span-2 h-4 w-12 rounded bg-gray-100 text-right" />
        </div>

        <div className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 px-5 py-4 items-center bg-white">
              <div className="col-span-5 flex items-center gap-3">
                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>
              <div className="col-span-3">
                <div className="h-4 w-24 rounded bg-gray-100" />
              </div>
              <div className="col-span-2">
                <div className="h-5 w-12 rounded bg-gray-100" />
              </div>
              <div className="col-span-2 flex justify-end">
                <div className="h-4 w-16 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
