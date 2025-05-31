import { z } from "zod";
import { accounts, expenseCategories, paymentMethods } from "./types";

export const incomeFormSchema = z.object({
  source: z.string().min(1, "Source is required."),
  amount: z.preprocess(
    (val) => (val === null || val === "" ? undefined : parseFloat(String(val))),
    z.number({required_error: "Amount is required.", invalid_type_error: "Amount must be a number."}).positive("Amount must be positive.")
  ),
  date: z.date({required_error: "Date is required."}),
  account: z.enum([...accounts] as [string, ...string[]], { required_error: "Account is required." }),
  paymentMethod: z.enum([...paymentMethods] as [string, ...string[]], { required_error: "Payment method is required." }),
});

export const expenseFormSchema = z.object({
  category: z.enum([...expenseCategories] as [string, ...string[]], {required_error: "Category is required."}),
  description: z.string().optional(),
  amount: z.preprocess(
    (val) => (val === null || val === "" ? undefined : parseFloat(String(val))),
    z.number({required_error: "Amount is required.", invalid_type_error: "Amount must be a number."}).positive("Amount must be positive.")
  ),
  date: z.date({required_error: "Date is required."}),
  account: z.enum([...accounts] as [string, ...string[]], { required_error: "Account is required." }),
  paymentMethod: z.enum([...paymentMethods] as [string, ...string[]], { required_error: "Payment method is required." }),
});

export const savingsInsightsFormSchema = z.object({
  targetSavingsRate: z.preprocess(
    (val) => (val === null || val === "" ? undefined : parseFloat(String(val))),
    z.number({required_error: "Target savings rate is required.", invalid_type_error: "Rate must be a number."})
    .min(0, "Rate must be at least 0.")
    .max(1, "Rate must be at most 1.")
  ),
});

export const transferFormSchema = z.object({
  fromAccount: z.enum([...accounts] as [string, ...string[]], { required_error: "From account is required." }),
  toAccount: z.enum([...accounts] as [string, ...string[]], { required_error: "To account is required." }),
  amount: z.preprocess(
    (val) => (val === null || val === "" ? undefined : parseFloat(String(val))),
    z.number({required_error: "Amount is required.", invalid_type_error: "Amount must be a number."}).positive("Amount must be positive.")
  ),
  date: z.date({required_error: "Date is required."}),
  note: z.string().optional(),
});

