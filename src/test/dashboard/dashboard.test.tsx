import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { createTransactionMock, listTransactionsMock, fetchJsonMock } = vi.hoisted(() => {
  return {
    createTransactionMock: vi.fn(),
    listTransactionsMock: vi.fn(),
    fetchJsonMock: vi.fn(),
  };
});

vi.mock("@/lib/api/transactions", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/transactions")>(
    "@/lib/api/transactions",
  );

  return {
    ...actual,
    createTransaction: (...args: unknown[]) => createTransactionMock(...args),
    listTransactions: (...args: unknown[]) => listTransactionsMock(...args),
  };
});

vi.mock("@/lib/api/client", () => {
  return {
    fetchJson: (...args: unknown[]) => fetchJsonMock(...args),
  };
});

import App from "@/App";
import { listTransactions, toStructuredApiError } from "@/lib/api/transactions";

const baseTransactions = [
  {
    amount: 120,
    category: "Food",
    date: "2026-02-01",
    description: "Lunch",
    id: "t1",
    type: "expense",
  },
];

describe("dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    listTransactionsMock.mockResolvedValue(baseTransactions);
    createTransactionMock.mockResolvedValue({
      amount: 50,
      category: "Income",
      date: "2026-02-02",
      description: "Freelance",
      id: "new-id",
      type: "income",
    });
  });

  it("loads and renders initial transactions", async () => {
    render(<App />);

    await waitFor(() => {
      expect(listTransactions).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText(/lunch/i)).toBeInTheDocument();
  });

  it("shows form validation feedback in add-transaction modal", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /add transaction/i }));
    await user.click(screen.getByRole("button", { name: /save transaction/i }));

    expect(await screen.findAllByText(/required|invalid/i)).not.toHaveLength(0);
  });

  it("handles add-transaction success flow", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    await user.type(screen.getByLabelText(/description/i), "Taxi");
    await user.type(screen.getByLabelText(/amount/i), "24.50");
    await user.type(screen.getByLabelText(/date/i), "2026-02-15");

    await user.click(screen.getByRole("button", { name: /save transaction/i }));

    await waitFor(() => {
      expect(createTransactionMock).toHaveBeenCalledTimes(1);
    });
  });

  it("shows API load error from structured error payload", async () => {
    listTransactionsMock.mockRejectedValueOnce(
      toStructuredApiError(
        Object.assign(new Error("Load failed"), {
          status: 503,
          code: "SERVICE_UNAVAILABLE",
        }),
      ),
    );

    render(<App />);

    expect(await screen.findByText(/load failed/i)).toBeInTheDocument();
  });

  it("shows create error feedback when save fails", async () => {
    const user = userEvent.setup();

    createTransactionMock.mockRejectedValueOnce(
      toStructuredApiError(
        Object.assign(new Error("Save failed"), {
          status: 500,
          code: "REQUEST_FAILED",
        }),
      ),
    );

    render(<App />);

    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    await user.type(screen.getByLabelText(/description/i), "Taxi");
    await user.type(screen.getByLabelText(/amount/i), "24.50");
    await user.type(screen.getByLabelText(/date/i), "2026-02-15");

    await user.click(screen.getByRole("button", { name: /save transaction/i }));

    expect(await screen.findByText(/save failed/i)).toBeInTheDocument();
  });
});
