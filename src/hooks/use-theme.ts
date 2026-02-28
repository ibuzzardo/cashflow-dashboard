import { useCallback, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type UseThemeResult = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "cashflow-theme";

const getPreferredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
  } catch {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useTheme = (): UseThemeResult => {
  const [theme, setThemeState] = useState<Theme>(() => getPreferredTheme());

  useEffect((): void => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      return;
    }
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme): void => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback((): void => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return useMemo(
    (): UseThemeResult => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );
};
