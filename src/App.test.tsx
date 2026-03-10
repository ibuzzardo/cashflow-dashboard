import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/pages/dashboard-page", () => ({
  default: () => <div>Dashboard page</div>,
}));

vi.mock("@/pages/help-page", () => ({
  default: () => <div>Help page</div>,
}));

import App from "@/App";

describe("App", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/dashboard");
  });

  it("renders DashboardPage on /dashboard", () => {
    render(<App />);

    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
    expect(screen.queryByText("Help page")).not.toBeInTheDocument();
  });

  it("renders HelpPage on /dashboard/help", () => {
    window.history.pushState({}, "", "/dashboard/help");

    render(<App />);

    expect(screen.getByText("Help page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard page")).not.toBeInTheDocument();
  });

  it("falls back to DashboardPage for unknown paths", () => {
    window.history.pushState({}, "", "/dashboard/unknown");

    render(<App />);

    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
    expect(screen.queryByText("Help page")).not.toBeInTheDocument();
  });

  it("reacts to popstate updates after initial render", () => {
    render(<App />);
    expect(screen.getByText("Dashboard page")).toBeInTheDocument();

    act(() => {
      window.history.pushState({}, "", "/dashboard/help");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.getByText("Help page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard page")).not.toBeInTheDocument();
  });
});
