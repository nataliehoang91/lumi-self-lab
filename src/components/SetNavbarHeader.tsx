"use client";

import { useEffect, useRef } from "react";
import { useNavbarHeaderContent } from "@/contexts/NavbarHeaderContentContext";

/**
 * Client component to set navbar header content for the current page.
 * Place it in your page and pass the header as children. Cleans up on unmount.
 *
 * @example
 * // In a page (server component can pass JSX):
 * <SetNavbarHeader>
 *   <PageBreadcrumb backLabel="Back to Dashboard" backHref="/dashboard" trail={[...]} showLogo={false} />
 * </SetNavbarHeader>
 * ...rest of page...
 */
export function SetNavbarHeader({ children }: { children: React.ReactNode }) {
  const setContent = useNavbarHeaderContent();
  const childrenRef = useRef(children);
  childrenRef.current = children;

  useEffect(() => {
    setContent(childrenRef.current);
    return () => setContent(null);
  }, [setContent]);

  return null;
}
