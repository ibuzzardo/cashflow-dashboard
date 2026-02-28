import { describe, expect, it, vi } from "vitest";

describe("main bootstrap", () => {
  it("throws when #root element is missing", async () => {
    document.body.innerHTML = "";

    vi.resetModules();
    vi.doMock("@/App", () => ({ default: () => null }));
    vi.doMock("react-dom/client", () => ({
      default: { createRoot: vi.fn() },
      createRoot: vi.fn(),
    }));

    await expect(import("@/main")).rejects.toThrow("Root element #root was not found.");
  });

  it("mounts app into #root when present", async () => {
    document.body.innerHTML = '<div id="root"></div>';

    const render = vi.fn();
    const createRoot = vi.fn(() => ({ render }));

    vi.resetModules();
    vi.doMock("@/App", () => ({ default: () => null }));
    vi.doMock("react-dom/client", () => ({
      default: { createRoot },
      createRoot,
    }));

    await import("@/main");

    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledTimes(1);
  });
});
