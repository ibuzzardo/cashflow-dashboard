import { describe, expect, it } from "vitest";

import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
  parseTransactionInput,
  transactionCategorySchema,
  transactionInputSchema,
  transactionTypeSchema,
} from "@/lib/validation";

const validPayload = {
  description: "Paycheck",
  amount: 2500,
  type: "income" as const,
  category: "salary" as const,
  date: "2026-02-28",
  note: "Monthly salary",
};

describe("dashboard transaction validation", () => {
  describe("enum schemas", () => {
    it("accepts every supported transaction type enum value", () => {
      for (const type of TRANSACTION_TYPES) {
        const parsed = transactionTypeSchema.safeParse(type);
        expect(parsed.success).toBe(true);
      }
    });

    it("rejects unsupported transaction types", () => {
      expect(transactionTypeSchema.safeParse("transfer").success).toBe(false);
      expect(transactionTypeSchema.safeParse("INCOME").success).toBe(false);
    });

    it("accepts every supported transaction category enum value", () => {
      for (const category of TRANSACTION_CATEGORIES) {
        const parsed = transactionCategorySchema.safeParse(category);
        expect(parsed.success).toBe(true);
      }
    });

    it("rejects unsupported categories", () => {
      expect(transactionCategorySchema.safeParse("random-category").success).toBe(false);
      expect(transactionCategorySchema.safeParse("Food").success).toBe(false);
    });
  });

  describe("transactionInputSchema", () => {
    it("validates a complete transaction payload", () => {
      const parsed = transactionInputSchema.safeParse(validPayload);
      expect(parsed.success).toBe(true);

      if (parsed.success) {
        expect(parsed.data.category).toBe("salary");
        expect(parsed.data.amount).toBe(2500);
        expect(parsed.data.description).toBe("Paycheck");
      }
    });

    it("trims description and note", () => {
      const parsed = transactionInputSchema.safeParse({
        ...validPayload,
        description: "  Groceries  ",
        note: "  Weekly shopping  ",
        type: "expense",
        category: "food",
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.description).toBe("Groceries");
        expect(parsed.data.note).toBe("Weekly shopping");
      }
    });

    it("allows note to be omitted", () => {
      const parsed = transactionInputSchema.safeParse({
        ...validPayload,
        note: undefined,
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.note).toBeUndefined();
      }
    });

    it("allows note as an explicit empty string", () => {
      const parsed = transactionInputSchema.safeParse({
        ...validPayload,
        note: "",
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.note).toBe("");
      }
    });

    it("rejects blank and overlong descriptions", () => {
      const blank = transactionInputSchema.safeParse({
        ...validPayload,
        description: "   ",
      });
      expect(blank.success).toBe(false);

      const tooLong = transactionInputSchema.safeParse({
        ...validPayload,
        description: "a".repeat(121),
      });
      expect(tooLong.success).toBe(false);
    });

    it("rejects overlong notes", () => {
      const parsed = transactionInputSchema.safeParse({
        ...validPayload,
        note: "a".repeat(241),
      });

      expect(parsed.success).toBe(false);
    });

    it("rejects invalid amount values", () => {
      expect(transactionInputSchema.safeParse({ ...validPayload, amount: 0 }).success).toBe(false);
      expect(transactionInputSchema.safeParse({ ...validPayload, amount: -1 }).success).toBe(false);
      expect(transactionInputSchema.safeParse({ ...validPayload, amount: Infinity }).success).toBe(false);
      expect(transactionInputSchema.safeParse({ ...validPayload, amount: -Infinity }).success).toBe(false);
      expect(transactionInputSchema.safeParse({ ...validPayload, amount: "10" }).success).toBe(false);
      expect(transactionInputSchema.safeParse({ ...validPayload, amount: Number.NaN }).success).toBe(false);
    });

    it("rejects empty and invalid date values", () => {
      expect(transactionInputSchema.safeParse({ ...validPayload, date: "   " }).success).toBe(false);
      expect(transactionInputSchema.safeParse({ ...validPayload, date: "not-a-date" }).success).toBe(false);
    });

    it("accepts parseable date formats and trims whitespace", () => {
      const parsed = transactionInputSchema.safeParse({
        ...validPayload,
        date: "  2026-02-28T12:30:00.000Z  ",
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.date).toBe("2026-02-28T12:30:00.000Z");
      }
    });

    it("strips unknown fields from parsed output", () => {
      const parsed = transactionInputSchema.safeParse({
        ...validPayload,
        extra: "remove-me",
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect((parsed.data as Record<string, unknown>).extra).toBeUndefined();
      }
    });
  });

  describe("parseTransactionInput", () => {
    it("returns structured field errors for invalid dashboard modal input", () => {
      const result = parseTransactionInput({
        description: "",
        amount: -10,
        type: "income",
        category: "not-real",
        date: "invalid-date",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe("Validation failed");
        expect(result.fieldErrors.description?.[0]).toContain("Description is required");
        expect(result.fieldErrors.amount?.[0]).toContain("greater than 0");
        expect(result.fieldErrors.category?.length).toBeGreaterThan(0);
        expect(result.fieldErrors.date?.[0]).toContain("valid date");
      }
    });

    it("returns required_error and invalid_type_error messages for amount", () => {
      const missingAmount = parseTransactionInput({
        description: "Rent",
        type: "expense",
        category: "housing",
        date: "2026-02-28",
      });

      expect(missingAmount.success).toBe(false);
      if (!missingAmount.success) {
        expect(missingAmount.fieldErrors.amount?.[0]).toContain("Amount is required");
      }

      const invalidTypeAmount = parseTransactionInput({
        description: "Rent",
        amount: "1000",
        type: "expense",
        category: "housing",
        date: "2026-02-28",
      });

      expect(invalidTypeAmount.success).toBe(false);
      if (!invalidTypeAmount.success) {
        expect(invalidTypeAmount.fieldErrors.amount?.[0]).toContain("Amount must be a number");
      }
    });

    it("returns finite amount error for non-finite numbers", () => {
      const infiniteAmount = parseTransactionInput({
        ...validPayload,
        amount: Infinity,
      });

      expect(infiniteAmount.success).toBe(false);
      if (!infiniteAmount.success) {
        expect(infiniteAmount.fieldErrors.amount?.[0]).toContain("finite number");
      }
    });

    it("returns enum errors for invalid type and category", () => {
      const result = parseTransactionInput({
        ...validPayload,
        type: "bonus",
        category: "misc",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.type?.length).toBeGreaterThan(0);
        expect(result.fieldErrors.category?.length).toBeGreaterThan(0);
      }
    });

    it("returns sanitized successful data for valid modal submissions", () => {
      const result = parseTransactionInput({
        description: "  Groceries  ",
        amount: 84.52,
        type: "expense",
        category: "food",
        date: "2026-02-20",
        note: "  Weekly shopping  ",
        extra: "should-be-stripped",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe("Groceries");
        expect(result.data.note).toBe("Weekly shopping");
        expect(result.data.category).toBe("food");
        expect((result.data as Record<string, unknown>).extra).toBeUndefined();
      }
    });
  });
});
