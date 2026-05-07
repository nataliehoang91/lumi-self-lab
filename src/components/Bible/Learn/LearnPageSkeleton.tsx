export function LearnPageSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      {/* Intro block */}
      <div className="space-y-3">
        <div className="bg-muted h-9 w-2/3 rounded" />
        <div className="bg-muted h-9 w-1/2 rounded" />
        <div className="mt-4 space-y-2">
          <div className="bg-muted h-4 w-full rounded" />
          <div className="bg-muted h-4 w-5/6 rounded" />
          <div className="bg-muted h-4 w-3/4 rounded" />
        </div>
      </div>

      {/* Divider */}
      <div className="bg-border h-px w-full" />

      {/* Section blocks */}
      {Array.from({ length: 3 }).map((_, s) => (
        <div key={s} className="space-y-4">
          <div className="bg-muted h-6 w-48 rounded" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted h-4 rounded"
                style={{ width: `${95 - i * 8}%` }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Quote block */}
      <div className="bg-muted/50 border-primary/30 rounded-lg border-l-4 p-5">
        <div className="space-y-2">
          <div className="bg-muted h-4 w-full rounded" />
          <div className="bg-muted h-4 w-4/5 rounded" />
          <div className="bg-muted mt-3 h-3 w-24 rounded" />
        </div>
      </div>

      {/* Accordion placeholders */}
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border-border rounded-lg border p-4">
            <div className="bg-muted h-5 w-2/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
