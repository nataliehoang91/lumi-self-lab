"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export type Palette = "default" | "warm";

const ThemeContext = React.createContext<{
  theme: string;
  toggleTheme: () => void;
  palette: Palette;
  setPalette: (p: Palette) => void;
}>({
  theme: "light",
  toggleTheme: () => {},
  palette: "default",
  setPalette: () => {},
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState("light");
  const [palette, setPaletteState] = React.useState<Palette>("default");

  React.useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedPalette = (localStorage.getItem("theme-palette") as Palette) || "default";
    setTheme(savedTheme);
    setPaletteState(savedPalette);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    document.documentElement.classList.toggle("theme-warm", savedPalette === "warm");
  }, []);

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, [theme]);

  const setPalette = React.useCallback((p: Palette) => {
    setPaletteState(p);
    localStorage.setItem("theme-palette", p);
    document.documentElement.classList.toggle("theme-warm", p === "warm");
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, palette, setPalette }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
