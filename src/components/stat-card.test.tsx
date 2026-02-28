import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatCard from "@/components/stat-card";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Income" value="$100.00" />);

    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });

  it("renders hint only when provided", () => {
    const { rerender } = render(<StatCard label="Transactions" value="10" hint="Last 30 days" />);
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();

    rerender(<StatCard label="Transactions" value="10" />);
    expect(screen.queryByText("Last 30 days")).not.toBeInTheDocument();
  });
});
