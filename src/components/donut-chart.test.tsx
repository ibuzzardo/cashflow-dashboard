import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="rc">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

import DonutChart from "@/components/donut-chart";

describe("DonutChart", () => {
  it("shows empty state when there is no data", () => {
    render(<DonutChart data={[]} />);

    expect(screen.getByText("No expense data yet.")).toBeInTheDocument();
    expect(screen.queryByTestId("pie-chart")).not.toBeInTheDocument();
  });

  it("renders chart when data exists", () => {
    render(
      <DonutChart
        data={[
          { category: "food", value: 10 },
          { category: "utilities", value: 20 },
        ]}
      />,
    );

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getAllByTestId("cell")).toHaveLength(2);
  });
});
