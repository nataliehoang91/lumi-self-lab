"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type NavbarHeaderContextValue = {
  content: ReactNode;
  setContent: (content: ReactNode) => void;
};

const NavbarHeaderContentContext = createContext<NavbarHeaderContextValue | null>(null);

export function NavbarHeaderContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<ReactNode>(null);

  const setContent = useCallback((node: ReactNode) => {
    setContentState(() => node);
  }, []);

  return (
    <NavbarHeaderContentContext.Provider value={{ content, setContent }}>
      {children}
    </NavbarHeaderContentContext.Provider>
  );
}

export function useNavbarHeaderContent(): (content: ReactNode) => void {
  const ctx = useContext(NavbarHeaderContentContext);
  if (!ctx) {
    return () => {};
  }
  return ctx.setContent;
}

export function useNavbarHeaderContentValue(): ReactNode {
  const ctx = useContext(NavbarHeaderContentContext);
  return ctx?.content ?? null;
}
