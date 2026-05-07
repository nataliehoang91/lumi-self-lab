export default function StudyLoading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl animate-pulse flex-col px-4 py-6 lg:px-0">
      {/* Header row */}
      <div className="mt-4 mb-6 flex items-baseline justify-between">
        <div className="bg-muted h-4 w-24 rounded" />
        <div className="bg-muted h-4 w-10 rounded" />
      </div>

      {/* Card grid — matches sm:grid-cols-2 lg:grid-cols-3 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border-border rounded-xl border p-5 shadow-sm"
          >
            <div className="mb-3 space-y-2">
              <div className="bg-muted h-5 w-3/4 rounded" />
              <div className="bg-muted h-3.5 w-1/2 rounded" />
            </div>
            <div className="space-y-1.5">
              <div className="bg-muted h-3 w-full rounded" />
              <div className="bg-muted h-3 w-5/6 rounded" />
            </div>
            <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
              <div className="bg-muted h-3 w-16 rounded" />
              <div className="bg-muted h-3 w-10 rounded" />
            </div>
          </div>
        ))}

        {/* New list placeholder card */}
        <div className="border-border rounded-xl border-2 border-dashed p-5">
          <div className="flex h-full items-center justify-center">
            <div className="bg-muted h-4 w-28 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
