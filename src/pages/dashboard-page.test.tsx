import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const addTransaction = vi.fn();
const removeTransaction = vi.fn();

vi.mock("@/hooks/use-transactions", () => ({
  useTransactions: () => ({
    transactions: [
      {
        id: "1",
        description: "Salary",
        amount: 1000,
        type: "income",
        category: "salary",
        date: "2026-02-01",
        note: "",
      },
    ],
    loading: false,
    error: null,
    stats: {
      income: 1000,
      expense: 200,
      balance: 800,
      transactionCount: 1,
    },
    donutData: [{ category: "food", value: 200 }],
    trendData: [{ date: "2026-02-01", income: 1000, expense: 200, balance: 800 }],
    reload: vi.fn(),
    addTransaction,
    updateTransaction: vi.fn(),
    removeTransaction,
  }),
}));

vi.mock("@/components/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

vi.mock("@/components/add-transaction-modal", () => ({
  default: ({ loading }: { loading: boolean }) => <div data-testid="add-modal">{String(loading)}</div>,
}));

vi.mock("@/components/stat-card", () => ({
  default: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="stat-card">
      {label}:{value}
    </div>
  ),
}));

vi.mock("@/components/donut-chart", () => ({
  default: ({ data }: { data: unknown[] }) => <div data-testid="donut">{data.length}</div>,
}));

vi.mock("@/components/trend-chart", () => ({
  default: ({ data }: { data: unknown[] }) => <div data-testid="trend">{data.length}</div>,
}));

vi.mock("@/components/transaction-list", () => ({
  default: ({ transactions }: { transactions: unknown[] }) => <div data-testid="tx-list">{transactions.length}</div>,
}));

import DashboardPage from "@/pages/dashboard-page";

describe("DashboardPage", () => {
  it("renders overview and all composed sections", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("add-modal")).toHaveTextContent("false");
    expect(screen.getAllByTestId("stat-card")).toHaveLength(4);
    expect(screen.getByTestId("donut")).toHaveTextContent("1");
    expect(screen.getByTestId("trend")).toHaveTextContent("1");
    expect(screen.getByTestId("tx-list")).toHaveTextContent("1");
  });

  it("formats metrics into currency and string count", () => {
    render(<DashboardPage />);

    expect(screen.getByText(/Income:\$1,000.00/)).toBeInTheDocument();
    expect(screen.getByText(/Expenses:\$200.00/)).toBeInTheDocument();
    expect(screen.getByText(/Net Balance:\$800.00/)).toBeInTheDocument();
    expect(screen.getByText(/Transactions:1/)).toBeInTheDocument();
  });
});
