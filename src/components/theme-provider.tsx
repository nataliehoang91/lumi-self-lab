"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme as useNextTheme,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Custom hook that matches the user's expected API
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Before mount: use "light" so SSR/hydration matches (no flash). Same toggleTheme
  // so the toggle doesn't remount when we flip to real theme — keeps CSS transition.
  const resolved = resolvedTheme || theme || "light";
  const themeForDisplay = mounted ? resolved : "light";

  return {
    theme: themeForDisplay,
    toggleTheme,
  };
}
