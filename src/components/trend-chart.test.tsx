import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="rc">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Line: () => <div data-testid="line" />,
}));

import TrendChart from "@/components/trend-chart";

describe("TrendChart", () => {
  it("shows empty state when there is no data", () => {
    render(<TrendChart data={[]} />);

    expect(screen.getByText("No trend data yet.")).toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("renders trend lines for populated data", () => {
    render(
      <TrendChart
        data={[
          { date: "2026-02-01", income: 100, expense: 50, balance: 50 },
          { date: "2026-02-02", income: 0, expense: 10, balance: 40 },
        ]}
      />,
    );

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getAllByTestId("line")).toHaveLength(3);
  });
});
