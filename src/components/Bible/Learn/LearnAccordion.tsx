"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { cn } from "@/lib/utils";

export interface LearnAccordionItem {
  term: string;
  def: string;
}

interface LearnAccordionProps {
  items: LearnAccordionItem[];
  className?: string;
  itemClassName?: string;
}

export function LearnAccordion({ items, className, itemClassName }: LearnAccordionProps) {
  const { fontSize } = useBibleApp();
  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";

  return (
    <Accordion type="multiple" className={cn("space-y-2 bg-background/50 rounded-xl", className)}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className={cn(
            "border-b border-border overflow-hidden transition-all last:border-b-0 ",
            itemClassName
          )}
        >
          <AccordionTrigger className="px-5 py-3.5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
            <span className={cn("font-bold text-left", bodyClass)}>{item.term}</span>
          </AccordionTrigger>
          <AccordionContent className={cn("px-5 pb-4 leading-relaxed pt-3", bodyClass)}>
            {item.def}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
