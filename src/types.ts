import type {
  TransactionCategory,
  TransactionInput,
  TransactionType,
} from "@/lib/validation";

export type Transaction = TransactionInput & {
  id: string;
};

export type TransactionFormInput = {
  description: string;
  amount: string;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  note: string;
};

export type StructuredError = {
  code: string;
  message: string;
  status: number;
  details?: Record<string, string[] | undefined>;
};

export type DashboardStats = {
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
};

export type DonutPoint = {
  category: TransactionCategory;
  value: number;
};

export type TrendPoint = {
  date: string;
  income: number;
  expense: number;
  balance: number;
};
