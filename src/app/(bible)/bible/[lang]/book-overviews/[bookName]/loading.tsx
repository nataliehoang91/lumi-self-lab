export default function BookOverviewLoading() {
  return (
    <div className="bg-read min-h-screen animate-pulse">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Back link */}
        <div className="bg-muted mb-6 h-4 w-28 rounded" />

        {/* Book name + testament badge */}
        <div className="mb-1 flex items-center gap-3">
          <div className="bg-muted h-9 w-48 rounded" />
          <div className="bg-muted h-5 w-16 rounded-full" />
        </div>
        <div className="bg-muted mb-8 h-4 w-72 rounded" />

        {/* Tab bar */}
        <div className="mb-8 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted h-8 w-20 rounded-lg" />
          ))}
        </div>

        {/* Content blocks */}
        <div className="space-y-4">
          <div className="bg-muted h-4 w-full rounded" />
          <div className="bg-muted h-4 w-5/6 rounded" />
          <div className="bg-muted h-4 w-4/6 rounded" />
        </div>

        <div className="mt-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border-border rounded-lg border p-4">
              <div className="bg-muted mb-2 h-4 w-1/3 rounded" />
              <div className="bg-muted h-3 w-full rounded" />
              <div className="bg-muted mt-1 h-3 w-2/3 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
