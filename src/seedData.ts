import { parseTransactionInput } from "@/lib/validation";
import type { Transaction } from "@/types";

const rawSeed = [
  {
    id: "seed-1",
    description: "Monthly Salary",
    amount: 4800,
    type: "income",
    category: "salary",
    date: "2026-02-01",
    note: "Primary job",
  },
  {
    id: "seed-2",
    description: "Groceries",
    amount: 128.44,
    type: "expense",
    category: "food",
    date: "2026-02-03",
    note: "Weekly",
  },
  {
    id: "seed-3",
    description: "Electric Bill",
    amount: 92.11,
    type: "expense",
    category: "utilities",
    date: "2026-02-05",
    note: "",
  },
] as const;

const isTransaction = (candidate: unknown): candidate is Transaction => {
  if (typeof candidate !== "object" || candidate === null) {
    return false;
  }

  const obj = candidate as Record<string, unknown>;
  return typeof obj.id === "string";
};

export const seedTransactions: Transaction[] = rawSeed
  .map((item) => {
    const parsed = parseTransactionInput({
      description: item.description,
      amount: item.amount,
      type: item.type,
      category: item.category,
      date: item.date,
      note: item.note,
    });

    if (!parsed.success) {
      return null;
    }

    const candidate: unknown = {
      id: item.id,
      ...parsed.data,
    };

    if (!isTransaction(candidate)) {
      return null;
    }

    return candidate;
  })
  .filter((item): item is Transaction => item !== null);
