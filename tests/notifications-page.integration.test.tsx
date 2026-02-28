import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/layout", () => ({
  default: ({ children }: { children: ReactNode }) => <div data-testid="layout">{children}</div>,
}));

import NotificationsPage, { mockNotifications } from "@/pages/notifications-page";

describe("NotificationsPage", () => {
  it("renders inside Layout and shows all filter options", () => {
    render(<NotificationsPage />);

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Info" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Warning" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Error" })).toBeInTheDocument();
  });

  it("shows all mock notifications by default", () => {
    render(<NotificationsPage />);

    for (const notification of mockNotifications) {
      expect(screen.getByText(notification.title)).toBeInTheDocument();
      expect(screen.getByText(notification.message)).toBeInTheDocument();
    }
  });

  it("filters the list to warning notifications", async () => {
    const user = userEvent.setup();

    render(<NotificationsPage />);

    await user.click(screen.getByRole("button", { name: "Warning" }));

    expect(screen.getByText("Large expense detected")).toBeInTheDocument();
    expect(screen.getByText("Category limit nearing")).toBeInTheDocument();

    expect(screen.queryByText("Budget synced")).not.toBeInTheDocument();
    expect(screen.queryByText("Import failed")).not.toBeInTheDocument();
    expect(screen.queryByText("Monthly summary ready")).not.toBeInTheDocument();
  });

  it("filters to error notifications and can switch back to all", async () => {
    const user = userEvent.setup();

    render(<NotificationsPage />);

    await user.click(screen.getByRole("button", { name: "Error" }));

    expect(screen.getByText("Import failed")).toBeInTheDocument();
    expect(screen.queryByText("Budget synced")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "All" }));

    for (const notification of mockNotifications) {
      expect(screen.getByText(notification.title)).toBeInTheDocument();
    }
  });
});
