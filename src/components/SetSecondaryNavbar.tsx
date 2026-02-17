"use client";

import { useEffect, useRef } from "react";
import { useSecondaryNavbarContent } from "@/contexts/SecondaryNavbarContentContext";

/**
 * Sets the secondary navbar content for the current page. Cleans up on unmount.
 * Use in any page that needs a header in the secondary navbar (title, actions, etc.).
 *
 * @example
 * <SetSecondaryNavbar>
 *   <div className="flex items-center justify-between w-full">...</div>
 * </SetSecondaryNavbar>
 */
export function SetSecondaryNavbar({ children }: { children: React.ReactNode }) {
  const setContent = useSecondaryNavbarContent();
  const childrenRef = useRef(children);
  // eslint-disable-next-line react-hooks/refs
  childrenRef.current = children;

  useEffect(() => {
    setContent(childrenRef.current);
    return () => setContent(null);
  }, [setContent]);

  return null;
}
