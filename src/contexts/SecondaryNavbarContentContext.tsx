"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type SecondaryNavbarContextValue = {
  content: ReactNode;
  setContent: (content: ReactNode) => void;
};

const SecondaryNavbarContentContext = createContext<SecondaryNavbarContextValue | null>(null);

export function SecondaryNavbarContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<ReactNode>(null);

  const setContent = useCallback((node: ReactNode) => {
    setContentState(() => node);
  }, []);

  return (
    <SecondaryNavbarContentContext.Provider value={{ content, setContent }}>
      {children}
    </SecondaryNavbarContentContext.Provider>
  );
}

export function useSecondaryNavbarContent(): (content: ReactNode) => void {
  const ctx = useContext(SecondaryNavbarContentContext);
  if (!ctx) return () => {};
  return ctx.setContent;
}

export function useSecondaryNavbarContentValue(): ReactNode {
  const ctx = useContext(SecondaryNavbarContentContext);
  return ctx?.content ?? null;
}
