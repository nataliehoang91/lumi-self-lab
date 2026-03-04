import React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  isCurrentPage?: boolean;
}

interface EllipsisBreadcrumbProps {
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  className?: string;
}

export function EllipsisBreadcrumb({
  items,
  maxVisibleItems = 3,
  className,
}: EllipsisBreadcrumbProps) {
  // Always apply responsive logic for better mobile experience
  // Show ellipsis on mobile even when items.length === maxVisibleItems
  const shouldShowEllipsis = items.length >= maxVisibleItems;

  if (!shouldShowEllipsis) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.isCurrentPage || !item.href ? (
                  <BreadcrumbPage className="text-foreground font-bold">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className="transition-colors hover:opacity-80"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // For breadcrumbs with maxVisibleItems or more, show responsive layout
  const firstItem = items[0];
  const lastItem = items[items.length - 1]; // Always show the last item (current page)
  const middleItems = items.slice(1, items.length - 1); // Items between first and last

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {/* First item - always visible */}
        <BreadcrumbItem>
          {firstItem?.isCurrentPage || !firstItem?.href ? (
            <BreadcrumbPage className="text-foreground font-bold">
              {firstItem?.label}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink
              href={firstItem?.href}
              className="transition-colors hover:text-blue-800"
            >
              {firstItem?.label}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Middle items - visible only on lg and above */}
        <div className="hidden lg:flex lg:items-center">
          {middleItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.isCurrentPage || !item.href ? (
                  <BreadcrumbPage className="text-foreground font-bold">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className="transition-colors hover:text-blue-800"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          ))}
        </div>

        {/* Ellipsis for hidden items - visible only on screens smaller than lg */}
        <BreadcrumbItem className="lg:hidden">
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator className="lg:hidden" />

        {/* Last item (current page) - visible on all screens */}
        <BreadcrumbItem>
          {lastItem?.isCurrentPage || !lastItem?.href ? (
            <BreadcrumbPage className="text-foreground font-bold">
              {lastItem?.label}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink
              href={lastItem?.href}
              className="transition-colors hover:text-blue-800"
            >
              {lastItem?.label}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
