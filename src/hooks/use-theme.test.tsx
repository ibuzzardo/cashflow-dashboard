import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTheme } from "@/hooks/use-theme";

const STORAGE_KEY = "cashflow-theme";

describe("useTheme", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("initializes from localStorage", () => {
    window.localStorage.setItem(STORAGE_KEY, "dark");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("falls back to matchMedia when storage does not have a valid value", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
  });

  it("setTheme updates class and persisted value", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setTheme("dark"));

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("toggleTheme flips between light and dark", () => {
    const { result } = renderHook(() => useTheme());

    const initial = result.current.theme;

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe(initial === "dark" ? "light" : "dark");

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe(initial);
  });
});
