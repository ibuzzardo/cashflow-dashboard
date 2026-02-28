import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/pages/dashboard-page", () => ({
  default: () => <div>Dashboard page</div>,
}));

import App from "@/App";

describe("App", () => {
  it("renders DashboardPage", () => {
    render(<App />);
    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });
});
