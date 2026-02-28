import { describe, expect, it } from "vitest";

import { seedTransactions } from "@/seedData";

describe("seedTransactions", () => {
  it("keeps only valid parsed transactions", () => {
    expect(seedTransactions.length).toBeGreaterThan(0);

    for (const tx of seedTransactions) {
      expect(typeof tx.id).toBe("string");
      expect(typeof tx.description).toBe("string");
      expect(typeof tx.amount).toBe("number");
      expect(["income", "expense"]).toContain(tx.type);
      expect(typeof tx.date).toBe("string");
    }
  });

  it("includes expected stable seed record IDs", () => {
    expect(seedTransactions.map((tx) => tx.id)).toEqual(
      expect.arrayContaining(["seed-1", "seed-2", "seed-3"]),
    );
  });
});
