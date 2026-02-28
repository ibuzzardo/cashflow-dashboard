import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/pages/dashboard-page", () => ({
  default: () => <main data-testid="dashboard-page">Dashboard Page</main>
}));

vi.mock("@/pages/about-page", () => ({
  default: () => <main data-testid="about-page">About Page</main>
}));

import App from "@/App";

const renderAt = (path: string): void => {
  window.history.pushState({}, "", path);
  render(<App />);
};

describe("App routing", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/");
  });

  it("renders DashboardPage on the root route", () => {
    renderAt("/");

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    expect(screen.queryByTestId("about-page")).not.toBeInTheDocument();
  });

  it("renders AboutPage on /about", () => {
    renderAt("/about");

    expect(screen.getByTestId("about-page")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
  });

  it("redirects unknown routes to root and renders DashboardPage", async () => {
    renderAt("/does-not-exist");

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
      expect(window.location.pathname).toBe("/");
    });
    expect(screen.queryByTestId("about-page")).not.toBeInTheDocument();
  });

  it("redirects unknown deep paths (with query/hash) to root", async () => {
    renderAt("/bad/path?foo=1#section");

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
      expect(window.location.pathname).toBe("/");
    });
  });
});
