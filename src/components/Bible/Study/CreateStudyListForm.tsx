"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createStudyList } from "@/app/actions/bible/study";
import { Loader2 } from "lucide-react";

interface CreateStudyListFormProps {
  onSuccess?: () => void;
}

export function CreateStudyListForm({ onSuccess }: CreateStudyListFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createStudyList(data);
      if (result.errors) {
        setError(result.errors.general?.[0] ?? result.errors.title?.[0] ?? "Something went wrong.");
        return;
      }
      router.refresh();
      onSuccess?.();
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">Name*</label>
        <Input
          id="title"
          name="title"
          required
          minLength={1}
          maxLength={80}
          placeholder="e.g. Morning Devotion"
          disabled={isPending}
          className="w-full"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Input
          id="description"
          name="description"
          maxLength={200}
          placeholder="What is this study about?"
          disabled={isPending}
          className="w-full"
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating…
          </>
        ) : (
          "Create List"
        )}
      </Button>
    </form>
  );
}
