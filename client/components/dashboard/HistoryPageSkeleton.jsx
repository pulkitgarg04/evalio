export function HistoryPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-64 rounded-xl bg-gray-200" />
          <div className="h-5 w-80 rounded-lg bg-gray-100" />
        </div>
        <div className="h-5 w-36 rounded-lg bg-gray-100" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="col-span-5 h-4 w-20 rounded bg-gray-200" />
          <div className="col-span-2 h-4 w-12 mx-auto rounded bg-gray-200" />
          <div className="col-span-2 h-4 w-20 mx-auto rounded bg-gray-200" />
          <div className="col-span-2 h-4 w-12 ml-auto rounded bg-gray-200" />
          <div className="col-span-1 h-4 w-10 ml-auto rounded bg-gray-200" />
        </div>

        <div className="divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="space-y-2">
                  <div className="h-4 w-44 rounded bg-gray-200" />
                  <div className="h-3 w-32 rounded bg-gray-100" />
                </div>
              </div>

              <div className="col-span-2 flex justify-center">
                <div className="h-7 w-16 rounded-full bg-gray-100" />
              </div>

              <div className="col-span-2 flex justify-center">
                <div className="h-4 w-20 rounded bg-gray-100" />
              </div>

              <div className="col-span-2 ml-auto space-y-2">
                <div className="h-4 w-28 ml-auto rounded bg-gray-100" />
                <div className="h-3 w-20 ml-auto rounded bg-gray-100" />
              </div>

              <div className="col-span-1 flex justify-end">
                <div className="h-8 w-16 rounded-lg bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
