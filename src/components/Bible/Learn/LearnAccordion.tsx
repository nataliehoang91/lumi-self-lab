"use client";

import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { cn } from "@/lib/utils";

export interface LearnAccordionItem {
  term: string | ReactNode;
  def: string | ReactNode;
}

interface LearnAccordionProps {
  items: readonly LearnAccordionItem[];
  className?: string;
  itemClassName?: string;
}

export function LearnAccordion({ items, className, itemClassName }: LearnAccordionProps) {
  const { fontSize } = useBibleApp();
  const bodyClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-md";

  return (
    <Accordion
      type="multiple"
      className={cn("bg-background/60 space-y-2 rounded-xl", className)}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className={cn(
            "border-border overflow-hidden border-b transition-all last:border-b-0",
            itemClassName
          )}
        >
          <AccordionTrigger
            className="data-[state=open]:text-primary-dark px-5 py-3.5 hover:no-underline
              [&[data-state=open]>svg]:rotate-180"
          >
            <span className={cn("text-left font-bold", bodyClass)}>{item.term}</span>
          </AccordionTrigger>
          <AccordionContent className={cn("px-5 pt-3 pb-4 leading-relaxed", bodyClass)}>
            {item.def}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
