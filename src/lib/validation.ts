import { z } from "zod";

export const TRANSACTION_TYPES = ["income", "expense"] as const;
export const TRANSACTION_CATEGORIES = [
  "housing",
  "food",
  "transportation",
  "utilities",
  "healthcare",
  "insurance",
  "debt",
  "entertainment",
  "shopping",
  "travel",
  "education",
  "salary",
  "freelance",
  "investment",
  "other",
] as const;

export const transactionTypeSchema = z.enum(TRANSACTION_TYPES);
export const transactionCategorySchema = z.enum(TRANSACTION_CATEGORIES);

const dateSchema = z
  .string()
  .trim()
  .min(1, "Date is required")
  .refine((value: string): boolean => !Number.isNaN(new Date(value).getTime()), {
    message: "Date must be a valid date",
  });

export const transactionInputSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(120, "Description must be 120 characters or fewer"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .finite("Amount must be a finite number")
    .positive("Amount must be greater than 0"),
  type: transactionTypeSchema,
  category: transactionCategorySchema,
  date: dateSchema,
  note: z
    .string()
    .trim()
    .max(240, "Note must be 240 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type TransactionCategory = z.infer<typeof transactionCategorySchema>;
export type TransactionInput = z.infer<typeof transactionInputSchema>;

export type ValidationFailure = {
  success: false;
  message: "Validation failed";
  fieldErrors: Record<string, string[]>;
};

export type ValidationSuccess = {
  success: true;
  data: TransactionInput;
};

export type ValidationResult = ValidationSuccess | ValidationFailure;

export const parseTransactionInput = (input: unknown): ValidationResult => {
  const parsed = transactionInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
};
