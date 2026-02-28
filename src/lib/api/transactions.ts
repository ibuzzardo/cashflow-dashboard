import { seedTransactions } from "@/seedData";
import type { StructuredError, Transaction } from "@/types";

/**
 * Local-only API stub — all data comes from seedData.
 * Suitable for a static SPA deployment (e.g. Vercel).
 */

let localStore: Transaction[] = [...seedTransactions];

export async function listTransactions(
  _query: Record<string, unknown>,
): Promise<Transaction[]> {
  return [...localStore];
}

export async function createTransaction(
  data: Omit<Transaction, "id"> & { id?: string },
): Promise<Transaction> {
  const tx: Transaction = {
    ...data,
    id: data.id ?? crypto.randomUUID(),
  };
  localStore = [tx, ...localStore];
  return tx;
}

export function toStructuredApiError(caught: unknown): StructuredError {
  if (
    typeof caught === "object" &&
    caught !== null &&
    "code" in caught &&
    "message" in caught
  ) {
    const err = caught as Record<string, unknown>;
    return {
      code: String(err.code ?? "UNKNOWN"),
      message: String(err.message ?? "An error occurred"),
      status: typeof err.status === "number" ? err.status : 500,
    };
  }

  if (caught instanceof Error) {
    return {
      code: "INTERNAL_ERROR",
      message: caught.message,
      status: 500,
    };
  }

  return {
    code: "UNKNOWN",
    message: "An unexpected error occurred",
    status: 500,
  };
}
