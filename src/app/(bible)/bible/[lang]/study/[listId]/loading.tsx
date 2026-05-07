export default function StudyListLoading() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl animate-pulse space-y-8 px-4 py-8 lg:px-0">
      {/* Header */}
      <div className="space-y-2">
        <div className="bg-muted h-3 w-16 rounded" />
        <div className="bg-muted h-6 w-56 rounded" />
        <div className="bg-muted h-4 w-80 rounded" />
      </div>

      {/* Controls card */}
      <div className="border-border bg-card/60 space-y-4 rounded-2xl border px-5 py-5">
        <div className="flex flex-wrap gap-6">
          {/* Version pills */}
          <div className="space-y-2">
            <div className="bg-muted h-3 w-14 rounded" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-muted h-7 w-16 rounded-full" />
              ))}
            </div>
          </div>

          {/* Book selector */}
          <div className="space-y-2">
            <div className="bg-muted h-3 w-10 rounded" />
            <div className="bg-muted h-8 w-36 rounded-full" />
          </div>
        </div>

        {/* Chapter grid */}
        <div className="space-y-2">
          <div className="bg-muted h-3 w-28 rounded" />
          <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 md:grid-cols-12">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="bg-muted h-8 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="bg-muted h-3 w-48 rounded" />
          <div className="bg-muted h-7 w-20 rounded-full" />
        </div>
      </div>

      {/* Empty content area */}
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-muted h-12 w-12 rounded-full" />
          <div className="bg-muted h-4 w-56 rounded" />
          <div className="bg-muted h-3 w-72 rounded" />
        </div>
      </div>
    </div>
  );
}
