
import { z } from "zod";
import { expenseCategories } from "./types";

export const incomeFormSchema = z.object({
  source: z.string().min(1, "Source is required."),
  amount: z.preprocess(
    (val) => (val === null || val === "" ? undefined : parseFloat(String(val))),
    z.number({required_error: "Amount is required.", invalid_type_error: "Amount must be a number."}).positive("Amount must be positive.")
  ),
  date: z.date({required_error: "Date is required."}),
});

export const expenseFormSchema = z.object({
  category: z.enum(expenseCategories, {required_error: "Category is required."}),
  description: z.string().optional(),
  amount: z.preprocess(
    (val) => (val === null || val === "" ? undefined : parseFloat(String(val))),
    z.number({required_error: "Amount is required.", invalid_type_error: "Amount must be a number."}).positive("Amount must be positive.")
  ),
  date: z.date({required_error: "Date is required."}),
});

export const savingsInsightsFormSchema = z.object({
  targetSavingsRate: z.preprocess(
    (val) => (val === null || val === "" ? undefined : parseFloat(String(val))),
    z.number({required_error: "Target savings rate is required.", invalid_type_error: "Rate must be a number."})
    .min(0, "Rate must be at least 0.")
    .max(1, "Rate must be at most 1.")
  ),
});

