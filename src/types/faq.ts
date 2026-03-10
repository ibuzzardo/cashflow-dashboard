export type FAQCategory = "Getting Started" | "Account" | "Billing";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}
