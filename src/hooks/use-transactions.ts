import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createTransaction,
  listTransactions,
  toStructuredApiError,
} from "@/lib/api/transactions";
import { TRANSACTION_CATEGORIES, parseTransactionInput } from "@/lib/validation";
import type { DashboardStats, DonutPoint, StructuredError, Transaction, TrendPoint } from "@/types";

type UseTransactionsResult = {
  transactions: Transaction[];
  loading: boolean;
  error: StructuredError | null;
  stats: DashboardStats;
  donutData: DonutPoint[];
  trendData: TrendPoint[];
  reload: () => Promise<void>;
  addTransaction: (input: unknown) => Promise<void>;
  updateTransaction: (id: string, input: unknown) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
};

const normalizeTransaction = (value: unknown): Transaction | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.id !== "string") {
    return null;
  }

  const parsed = parseTransactionInput({
    description: obj.description,
    amount: obj.amount,
    type: obj.type,
    category: obj.category,
    date: obj.date,
    note: obj.note,
  });

  if (!parsed.success) {
    return null;
  }

  return {
    id: obj.id,
    ...parsed.data,
  };
};

const fallbackError = (message: string): StructuredError => ({
  code: "NOT_IMPLEMENTED",
  message,
  status: 501,
});

export const useTransactions = (): UseTransactionsResult => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<StructuredError | null>(null);

  const reload = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await listTransactions({});
      const normalized = result
        .map((item) => normalizeTransaction(item))
        .filter((item): item is Transaction => item !== null);
      setTransactions(normalized);
    } catch (caught: unknown) {
      setError(toStructuredApiError(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (input: unknown): Promise<void> => {
    try {
      const parsed = parseTransactionInput(input);
      if (!parsed.success) {
        setError({
          code: "VALIDATION_ERROR",
          message: parsed.message,
          status: 400,
          details: parsed.fieldErrors,
        });
        return;
      }

      const created = await createTransaction(parsed.data);
      const normalized = normalizeTransaction(created);

      if (normalized === null) {
        setError({
          code: "UNPROCESSABLE_ENTITY",
          message: "Created transaction payload is invalid.",
          status: 422,
        });
        return;
      }

      setTransactions((current) => [normalized, ...current]);
      setError(null);
    } catch (caught: unknown) {
      setError(toStructuredApiError(caught));
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, input: unknown): Promise<void> => {
    try {
      setError(fallbackError("Update transaction API is not available in current module."));
      void id;
      void input;
    } catch (caught: unknown) {
      setError(toStructuredApiError(caught));
    }
  }, []);

  const removeTransaction = useCallback(async (id: string): Promise<void> => {
    try {
      setTransactions((current) => current.filter((item) => item.id !== id));
      setError(null);
    } catch (caught: unknown) {
      setError(toStructuredApiError(caught));
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stats = useMemo<DashboardStats>(() => {
    const income = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expense = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const donutData = useMemo<DonutPoint[]>(() => {
    return TRANSACTION_CATEGORIES.map((category) => {
      const value = transactions
        .filter((tx) => tx.type === "expense" && tx.category === category)
        .reduce((sum, tx) => sum + tx.amount, 0);

      return { category, value };
    }).filter((point) => point.value > 0);
  }, [transactions]);

  const trendData = useMemo<TrendPoint[]>(() => {
    const byDate = new Map<string, { income: number; expense: number }>();

    for (const tx of transactions) {
      const current = byDate.get(tx.date) ?? { income: 0, expense: 0 };
      if (tx.type === "income") {
        current.income += tx.amount;
      } else {
        current.expense += tx.amount;
      }
      byDate.set(tx.date, current);
    }

    const sortedDates = [...byDate.keys()].sort((a, b) => a.localeCompare(b));
    let runningBalance = 0;

    return sortedDates.map((date) => {
      const row = byDate.get(date) ?? { income: 0, expense: 0 };
      runningBalance += row.income - row.expense;

      return {
        date,
        income: row.income,
        expense: row.expense,
        balance: runningBalance,
      };
    });
  }, [transactions]);

  return {
    transactions,
    loading,
    error,
    stats,
    donutData,
    trendData,
    reload,
    addTransaction,
    updateTransaction,
    removeTransaction,
  };
};
