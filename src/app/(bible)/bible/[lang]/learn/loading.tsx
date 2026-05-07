export default function LearnLoading() {
  return (
    <div className="bg-read min-h-screen">
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-16">
        {/* Breadcrumb */}
        <div className="bg-muted mb-10 h-3.5 w-32 rounded" />

        {/* Hero heading */}
        <div className="mb-4 space-y-3">
          <div className="bg-muted h-10 w-2/3 rounded" />
          <div className="bg-muted h-10 w-1/2 rounded" />
        </div>

        {/* Subheading */}
        <div className="mb-12 space-y-2">
          <div className="bg-muted h-4 w-3/4 rounded" />
          <div className="bg-muted h-4 w-1/2 rounded" />
        </div>

        {/* Lesson cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border-border rounded-xl border p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-muted h-8 w-8 rounded-full" />
                <div className="bg-muted h-5 w-2/3 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="bg-muted h-3.5 w-full rounded" />
                <div className="bg-muted h-3.5 w-4/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
