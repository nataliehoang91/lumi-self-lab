export default function FlashcardLoading() {
  return (
    <div className="flex min-h-screen w-full animate-pulse flex-col">
      {/* Collection tabs */}
      <div className="border-border flex gap-2 border-b px-4 py-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-7 w-20 rounded-full" />
        ))}
      </div>

      {/* Card area — centered single card */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="bg-card border-border h-72 w-full rounded-2xl border shadow-sm sm:h-80">
            <div className="flex h-full flex-col justify-between p-6">
              <div className="space-y-2">
                <div className="bg-muted h-3 w-20 rounded" />
              </div>
              <div className="space-y-3">
                <div className="bg-muted h-5 w-full rounded" />
                <div className="bg-muted h-5 w-5/6 rounded" />
                <div className="bg-muted h-5 w-4/6 rounded" />
              </div>
              <div className="bg-muted h-4 w-24 rounded" />
            </div>
          </div>

          {/* Nav dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="bg-muted h-7 w-7 rounded-full" />
            <div className="bg-muted h-3 w-16 rounded-full" />
            <div className="bg-muted h-7 w-7 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
