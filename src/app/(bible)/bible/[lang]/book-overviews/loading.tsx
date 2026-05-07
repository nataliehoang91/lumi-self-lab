export default function BookOverviewsLoading() {
  return (
    <div className="bg-read min-h-screen animate-pulse">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Page heading */}
        <div className="mb-2 flex items-center gap-3">
          <div className="bg-muted h-8 w-44 rounded" />
        </div>
        <div className="bg-muted mb-10 h-4 w-64 rounded" />

        {/* Stats row */}
        <div className="mb-10 flex gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="bg-muted h-7 w-10 rounded" />
              <div className="bg-muted h-3 w-16 rounded" />
            </div>
          ))}
        </div>

        {/* Old Testament section */}
        <div className="bg-muted mb-3 h-5 w-32 rounded" />
        <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 39 }).map((_, i) => (
            <div key={i} className="bg-card border-border rounded-lg border px-3 py-2.5">
              <div className="bg-muted h-4 rounded" style={{ width: `${50 + (i % 4) * 12}%` }} />
              <div className="bg-muted mt-1 h-3 w-10 rounded" />
            </div>
          ))}
        </div>

        {/* New Testament section */}
        <div className="bg-muted mb-3 h-5 w-32 rounded" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 27 }).map((_, i) => (
            <div key={i} className="bg-card border-border rounded-lg border px-3 py-2.5">
              <div className="bg-muted h-4 rounded" style={{ width: `${50 + (i % 4) * 12}%` }} />
              <div className="bg-muted mt-1 h-3 w-10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
