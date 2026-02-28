import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/pages/dashboard-page", () => ({
  default: () => <div data-testid="dashboard-page">Dashboard page</div>,
}));

vi.mock("@/pages/notifications-page", () => ({
  default: () => <div data-testid="notifications-page">Notifications page</div>,
}));

import App from "@/App";

describe("App", () => {
  beforeEach((): void => {
    window.history.replaceState({}, "", "/");
  });

  it("renders DashboardPage on default route", () => {
    render(<App />);

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    expect(screen.queryByTestId("notifications-page")).not.toBeInTheDocument();
  });

  it("renders NotificationsPage on /dashboard/notifications", () => {
    window.history.pushState({}, "", "/dashboard/notifications");

    render(<App />);

    expect(screen.getByTestId("notifications-page")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
  });

  it("renders NotificationsPage when query string/hash are present", () => {
    window.history.pushState({}, "", "/dashboard/notifications?tab=all#latest");

    render(<App />);

    expect(screen.getByTestId("notifications-page")).toBeInTheDocument();
  });

  it("falls back to DashboardPage for unknown routes", () => {
    window.history.pushState({}, "", "/dashboard/notifications/archive");

    render(<App />);

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    expect(screen.queryByTestId("notifications-page")).not.toBeInTheDocument();
  });

  it("re-evaluates the route on re-render", () => {
    const { rerender } = render(<App />);

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();

    window.history.pushState({}, "", "/dashboard/notifications");
    rerender(<App />);

    expect(screen.getByTestId("notifications-page")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
  });
});
