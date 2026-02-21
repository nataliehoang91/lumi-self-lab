"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ReadFocusContextValue {
  readFocusMode: boolean;
  setReadFocusMode: (value: boolean) => void;
}

const ReadFocusContext = createContext<ReadFocusContextValue>({
  readFocusMode: false,
  setReadFocusMode: () => {},
});

export function ReadFocusProvider({ children }: { children: React.ReactNode }) {
  const [readFocusMode, setReadFocusMode] = useState(false);
  return (
    <ReadFocusContext.Provider value={{ readFocusMode, setReadFocusMode }}>
      {children}
    </ReadFocusContext.Provider>
  );
}

export function useReadFocus() {
  return useContext(ReadFocusContext);
}
