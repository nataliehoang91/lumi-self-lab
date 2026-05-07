import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BibleNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-sm space-y-4">
        <div
          className="bg-muted/60 border-border mx-auto flex h-14 w-14
            items-center justify-center rounded-full border"
        >
          <BookOpen className="text-muted-foreground h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-foreground text-base font-semibold">Page not found</h2>
          <p className="text-muted-foreground text-sm">
            This page doesn&apos;t exist or may have moved.
          </p>
        </div>

        <div className="flex justify-center pt-1">
          <Button asChild variant="outline" size="sm">
            <Link href="/bible">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Bible
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
