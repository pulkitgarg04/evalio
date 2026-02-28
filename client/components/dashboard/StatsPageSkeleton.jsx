export function StatsPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-48 rounded-xl bg-gray-200" />
        <div className="h-5 w-80 rounded-lg bg-gray-100" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gray-100 mb-4" />
            <div className="h-4 w-24 rounded bg-gray-100 mb-2" />
            <div className="h-9 w-20 rounded bg-gray-200" />
            {index === 3 && <div className="h-4 w-16 rounded bg-gray-100 mt-2" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gray-100" />
          <div className="h-6 w-52 rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-5 w-14 rounded-full bg-gray-100" />
              </div>
              <div className="h-8 w-16 rounded bg-gray-200 mb-3" />
              <div className="h-2 w-full rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gray-100" />
          <div className="h-6 w-36 rounded bg-gray-200" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-3 w-24 rounded bg-gray-100" />
                </div>
              </div>
              <div className="h-4 w-20 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
