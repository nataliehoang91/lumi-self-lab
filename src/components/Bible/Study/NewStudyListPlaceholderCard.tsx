"use client";

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondaryLight"
          className="group bg-primary/10 border-2 border-dashed border-primary/40 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 min-h-[180px]"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Plus className="w-5 h-5  text-foreground group-hover:text-muted-foreground transition-colors" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-muted-foreground transition-colors">
            {label}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new study list</DialogTitle>
        </DialogHeader>
        <CreateStudyListForm />
      </DialogContent>
    </Dialog>
  );
}
