import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TransactionList from "@/components/transaction-list";

const tx = {
  id: "t-1",
  description: "Groceries",
  amount: 12.34,
  type: "expense" as const,
  category: "food" as const,
  date: "2026-02-05",
  note: "weekly",
};

describe("TransactionList", () => {
  it("renders loading state", () => {
    render(<TransactionList loading errorMessage={null} transactions={[]} onDelete={vi.fn()} />);
    expect(screen.getByText("Loading transactions...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(<TransactionList loading={false} errorMessage="boom" transactions={[]} onDelete={vi.fn()} />);
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<TransactionList loading={false} errorMessage={null} transactions={[]} onDelete={vi.fn()} />);
    expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
  });

  it("renders rows and deletes selected transaction", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockResolvedValue(undefined);

    render(<TransactionList loading={false} errorMessage={null} transactions={[tx]} onDelete={onDelete} />);

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("-$12.34")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledWith("t-1");
  });
});
