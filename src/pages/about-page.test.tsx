import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AboutPage from "@/pages/about-page";

vi.mock("@/components/layout", () => ({
  default: ({ children }: { children: ReactNode }) => <div data-testid="layout-shell">{children}</div>
}));

describe("AboutPage", () => {
  it("renders inside Layout and shows the page title/version", () => {
    render(<AboutPage />);

    expect(screen.getByTestId("layout-shell")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Cashflow Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("v1.0.0")).toBeInTheDocument();
  });

  it("renders all descriptive paragraphs", () => {
    render(<AboutPage />);

    expect(
      screen.getByText("Cashflow Dashboard helps teams track incoming and outgoing cash in one place.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "It provides a clear snapshot of balances, trends, and recent activity so decisions can be made quickly."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The interface is designed for fast daily use, with responsive layouts and dark mode support."
      )
    ).toBeInTheDocument();
  });

  it("renders stable key content exactly once", () => {
    render(<AboutPage />);

    expect(screen.getAllByRole("heading", { level: 1, name: "Cashflow Dashboard" })).toHaveLength(1);
    expect(screen.getAllByText("v1.0.0")).toHaveLength(1);
  });
});
