export default function ReadLoading() {
  return (
    <div className="bg-read flex min-h-screen w-full animate-pulse">
      {/* Left sidebar — book/chapter nav */}
      <div className="border-border hidden w-64 shrink-0 flex-col gap-3 border-r p-4 lg:flex">
        <div className="bg-muted h-8 w-3/4 rounded-md" />
        <div className="bg-muted h-5 w-1/2 rounded" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted h-7 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
          ))}
        </div>
      </div>

      {/* Main reading panel */}
      <div className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-8 lg:px-12">
        {/* Version selector bar */}
        <div className="flex items-center gap-3">
          <div className="bg-muted h-8 w-28 rounded-full" />
          <div className="bg-muted h-8 w-28 rounded-full" />
        </div>

        {/* Chapter heading */}
        <div className="bg-muted h-7 w-40 rounded" />

        {/* Verse lines */}
        <div className="space-y-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="bg-muted h-4 rounded" style={{ width: `${60 + (i % 5) * 8}%` }} />
              {i % 3 === 0 && <div className="bg-muted h-4 w-3/4 rounded" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
