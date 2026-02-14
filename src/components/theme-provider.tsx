"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme as useNextTheme,
} from "next-themes";

// Create a context for the custom theme hook
const ThemeContext = React.createContext<{
  theme: string;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Custom hook that matches the user's expected API
export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Return light theme during SSR to avoid hydration mismatch
  if (!mounted) {
    return {
      theme: "light",
      toggleTheme: () => {},
    };
  }

  return {
    theme: theme || "light",
    toggleTheme,
  };
}
