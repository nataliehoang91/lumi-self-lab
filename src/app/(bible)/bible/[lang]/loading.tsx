export default function BibleLangLoading() {
  return (
    <div className="bg-body flex min-h-screen animate-pulse flex-col items-center justify-center gap-8 px-4">
      {/* Hero text */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-muted h-12 w-64 rounded-lg sm:w-80" />
        <div className="bg-muted h-12 w-48 rounded-lg sm:w-64" />
        <div className="mt-2 space-y-2">
          <div className="bg-muted h-4 w-72 rounded sm:w-96" />
          <div className="bg-muted mx-auto h-4 w-56 rounded sm:w-72" />
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col items-center gap-3">
        <div className="bg-muted h-12 w-44 rounded-lg" />
        <div className="bg-muted h-4 w-8 rounded" />
        <div className="bg-muted h-12 w-44 rounded-lg" />
      </div>

      {/* Verse of the day card */}
      <div className="bg-card border-border w-full max-w-lg rounded-2xl border p-6">
        <div className="bg-muted mb-4 h-3 w-28 rounded" />
        <div className="space-y-2">
          <div className="bg-muted h-5 w-full rounded" />
          <div className="bg-muted h-5 w-4/5 rounded" />
        </div>
        <div className="bg-muted mt-4 h-3.5 w-24 rounded" />
        <div className="bg-muted mt-5 h-3.5 w-32 rounded" />
      </div>
    </div>
  );
}
