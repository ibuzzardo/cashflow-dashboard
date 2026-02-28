import { describe, expect, it, vi, beforeEach } from "vitest";
import { z } from "zod";

const { fetchJsonMock } = vi.hoisted(() => {
  return {
    fetchJsonMock: vi.fn(),
  };
});

vi.mock("@/lib/api/client", () => {
  return {
    fetchJson: (...args: unknown[]) => fetchJsonMock(...args),
  };
});

const validCreateInput = {
  amount: 125.5,
  category: "Income",
  date: "2026-02-10",
  description: "Consulting",
  type: "income" as const,
};

const importTransactions = async (mode?: "api" | "mock") => {
  vi.resetModules();

  if (mode) {
    process.env.NEXT_PUBLIC_TRANSACTIONS_MODE = mode;
  } else {
    delete process.env.NEXT_PUBLIC_TRANSACTIONS_MODE;
  }

  return import("@/lib/api/transactions");
};

describe("transactions API utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_TRANSACTIONS_MODE;
  });

  describe("toStructuredApiError", () => {
    it("maps zod validation errors to VALIDATION_ERROR", async () => {
      const { toStructuredApiError } = await importTransactions();

      let parseError: unknown;
      try {
        z.object({ limit: z.number() }).parse({ limit: "10" });
      } catch (error) {
        parseError = error;
      }

      const structured = toStructuredApiError(parseError);

      expect(structured).toMatchObject({
        code: "VALIDATION_ERROR",
        message: "Invalid request payload.",
        status: 400,
      });
      expect(structured.details).toBeDefined();
      expect(structured.details?.limit).toBeDefined();
    });

    it("preserves custom error fields when present", async () => {
      const { toStructuredApiError } = await importTransactions();

      const error = new Error("Request failed") as Error & {
        status?: number;
        code?: string;
        details?: Record<string, string[] | undefined>;
      };
      error.status = 422;
      error.code = "UNPROCESSABLE_ENTITY";
      error.details = { amount: ["Must be positive"] };

      expect(toStructuredApiError(error)).toEqual({
        code: "UNPROCESSABLE_ENTITY",
        message: "Request failed",
        status: 422,
        details: { amount: ["Must be positive"] },
      });
    });

    it("returns UNKNOWN_ERROR for non-Error unknown values", async () => {
      const { toStructuredApiError } = await importTransactions();

      expect(toStructuredApiError("boom")).toEqual({
        code: "UNKNOWN_ERROR",
        message: "Unexpected error occurred while processing transactions.",
        status: 500,
      });
    });
  });

  describe("listTransactions", () => {
    it("uses mock mode when NEXT_PUBLIC_TRANSACTIONS_MODE is not api", async () => {
      const { listTransactions } = await importTransactions("mock");

      const result = await listTransactions({ limit: 5 });

      expect(result).toEqual([]);
      expect(fetchJsonMock).not.toHaveBeenCalled();
    });

    it("calls API with a query string containing all supported filters", async () => {
      const { listTransactions } = await importTransactions("api");
      const apiTransactions = [
        {
          id: "tx1",
          amount: 45,
          type: "expense",
          category: "Food",
          description: "Lunch",
          date: "2026-02-01",
        },
      ];
      fetchJsonMock.mockResolvedValue(apiTransactions);

      const result = await listTransactions({
        limit: 10,
        type: "expense",
        category: "Food & Dining",
      });

      expect(fetchJsonMock).toHaveBeenCalledTimes(1);
      expect(fetchJsonMock).toHaveBeenCalledWith(
        "/transactions?limit=10&type=expense&category=Food+%26+Dining",
      );
      expect(result).toEqual(apiTransactions);
    });

    it("omits empty string filters from API query string", async () => {
      const { listTransactions } = await importTransactions("api");
      fetchJsonMock.mockResolvedValue([]);

      await listTransactions({ type: "", category: "" });

      expect(fetchJsonMock).toHaveBeenCalledWith("/transactions");
    });

    it("maps schema parse failures to structured validation errors", async () => {
      const { listTransactions } = await importTransactions("api");

      await expect(listTransactions({ limit: "invalid" })).rejects.toMatchObject({
        code: "VALIDATION_ERROR",
        status: 400,
      });
      expect(fetchJsonMock).not.toHaveBeenCalled();
    });

    it("maps fetch failures into structured errors", async () => {
      const { listTransactions } = await importTransactions("api");

      const networkError = new Error("Network down") as Error & {
        status?: number;
        code?: string;
      };
      networkError.status = 503;
      networkError.code = "SERVICE_UNAVAILABLE";
      fetchJsonMock.mockRejectedValue(networkError);

      await expect(listTransactions({})).rejects.toMatchObject({
        code: "SERVICE_UNAVAILABLE",
        message: "Network down",
        status: 503,
      });
    });
  });

  describe("createTransaction", () => {
    it("maps create payload validation failures to structured validation errors", async () => {
      const { createTransaction } = await importTransactions("api");

      await expect(
        createTransaction({
          ...validCreateInput,
          amount: "bad",
        }),
      ).rejects.toMatchObject({
        code: "VALIDATION_ERROR",
        status: 400,
      });
      expect(fetchJsonMock).not.toHaveBeenCalled();
    });

    it("returns API response in api mode", async () => {
      const { createTransaction } = await importTransactions("api");
      const apiResponse = {
        ...validCreateInput,
        id: "created-1",
      };
      fetchJsonMock.mockResolvedValue(apiResponse);

      const result = await createTransaction(validCreateInput);

      expect(fetchJsonMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(apiResponse);
    });

    it("supports mock mode without using fetchJson", async () => {
      const { createTransaction } = await importTransactions("mock");

      const created = await createTransaction(validCreateInput);

      expect(fetchJsonMock).not.toHaveBeenCalled();
      expect(created).toMatchObject(validCreateInput);
      expect(created.id).toEqual(expect.any(String));
    });
  });
});
