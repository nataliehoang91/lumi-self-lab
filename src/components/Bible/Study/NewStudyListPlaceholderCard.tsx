"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateStudyListForm } from "./CreateStudyListForm";

interface NewStudyListPlaceholderCardProps {
  label?: string;
}

export function NewStudyListPlaceholderCard({
  label = "New list",
}: NewStudyListPlaceholderCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondaryLight"
          className="group bg-primary/10 border-primary/40 hover:border-primary/40
            hover:bg-primary/5 flex w-full min-h-[180px] lg:min-h-[120px] flex-col items-center justify-center
            gap-3 rounded-xl border-2 border-dashed p-6 lg:p-4 transition-all duration-200"
        >
          <div
            className="bg-primary/30 group-hover:bg-primary/10 flex h-12 w-12 items-center
              justify-center rounded-xl transition-colors"
          >
            <Plus
              className="text-foreground group-hover:text-muted-foreground h-6 w-6
                transition-colors"
            />
          </div>
          <span
            className="text-foreground group-hover:text-muted-foreground text-base
              font-semibold transition-colors"
          >
            {label}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new study list</DialogTitle>
        </DialogHeader>
        <CreateStudyListForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
