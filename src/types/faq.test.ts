import { describe, expectTypeOf, it } from "vitest";

import type { FAQ, FAQCategory } from "@/types/faq";

describe("FAQ types", () => {
  it("enforces the FAQCategory literal union", () => {
    expectTypeOf<FAQCategory>().toEqualTypeOf<"Getting Started" | "Account" | "Billing">();
  });

  it("enforces the FAQ interface shape", () => {
    type ExpectedFAQ = {
      id: string;
      question: string;
      answer: string;
      category: FAQCategory;
    };

    expectTypeOf<FAQ>().toEqualTypeOf<ExpectedFAQ>();
  });

  it("accepts a valid FAQ object", () => {
    const faq: FAQ = {
      id: "faq-1",
      question: "Question?",
      answer: "Answer",
      category: "Account",
    };

    expectTypeOf(faq.category).toEqualTypeOf<FAQCategory>();
  });
});
