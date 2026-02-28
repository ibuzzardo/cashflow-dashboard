import { z } from "zod";

import { fetchJson } from "@/lib/api/client";
import {
  createTransactionSchema,
  transactionQuerySchema,
  type CreateTransactionInput,
  type Transaction,
  type TransactionQueryInput,
} from "@/lib/schemas/transaction-schema";

interface StructuredApiError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, string[] | undefined>;
}

const API_MODE_ENABLED: boolean =
  process.env.NEXT_PUBLIC_TRANSACTIONS_MODE === "api";

const mockTransactions: Transaction[] = [];

export const toStructuredApiError = (error: unknown): StructuredApiError => {
  if (error instanceof z.ZodError) {
    return {
      code: "VALIDATION_ERROR",
      message: "Invalid request payload.",
      status: 400,
      details: error.flatten().fieldErrors,
    };
  }

  if (error instanceof Error) {
    const candidate = error as Error & {
      status?: number;
      code?: string;
      details?: Record<string, string[] | undefined>;
    };

    return {
      code: candidate.code ?? "REQUEST_FAILED",
      message: candidate.message,
      status: candidate.status ?? 500,
      details: candidate.details,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Unexpected error occurred while processing transactions.",
    status: 500,
  };
};

const buildTransactionsQueryString = (query: TransactionQueryInput): string => {
  const params = new URLSearchParams();

  if (typeof query.limit === "number") {
    params.set("limit", String(query.limit));
  }

  if (typeof query.type === "string" && query.type.length > 0) {
    params.set("type", query.type);
  }

  if (typeof query.category === "string" && query.category.length > 0) {
    params.set("category", query.category);
  }

  const queryString = params.toString();
  return queryString.length > 0 ? `?${queryString}` : "";
};

export const listTransactions = async (
  input: unknown = {},
): Promise<Transaction[]> => {
  try {
    const query = transactionQuerySchema.parse(input);

    if (!API_MODE_ENABLED) {
      const limited =
        typeof query.limit === "number"
          ? mockTransactions.slice(0, query.limit)
          : mockTransactions;

      return limited;
    }

    const queryString = buildTransactionsQueryString(query);
    const response = await fetchJson<Transaction[]>(`/transactions${queryString}`);

    return response;
  } catch (error: unknown) {
    throw toStructuredApiError(error);
  }
};

export const createTransaction = async (
  input: unknown,
): Promise<Transaction> => {
  try {
    const payload: CreateTransactionInput = createTransactionSchema.parse(input);

    if (!API_MODE_ENABLED) {
      const created: Transaction = {
        id: crypto.randomUUID(),
        ...payload,
      };

      mockTransactions.unshift(created);
      return created;
    }

    const response = await fetchJson<Transaction>("/transactions", {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    return response;
  } catch (error: unknown) {
    throw toStructuredApiError(error);
  }
};
