"use client";

import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"; // Changed from Select
import { Textarea } from "@/components/ui/textarea";
import { expenseFormSchema } from "@/lib/schemas";
import { type ExpenseRecord, expenseCategories, type ExpenseCategory, accounts, type Account, paymentMethods, type PaymentMethod } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface ExpenseFormProps {
  onSubmit: (data: Omit<ExpenseRecord, "id">) => void;
  accountBalances: Record<Account, { income: number; expenses: number; balance: number; cashWithdrawals: number }>;
}

const categoryOptions: ComboboxOption[] = expenseCategories.map(category => ({
  value: category,
  label: category,
}));

const accountOptions: ComboboxOption[] = accounts.map(account => ({
  value: account,
  label: account,
}));

const paymentMethodOptions: ComboboxOption[] = paymentMethods.map(method => ({
  value: method,
  label: method,
}));

export function ExpenseForm({ onSubmit, accountBalances }: ExpenseFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      category: undefined,
      description: "",
      amount: undefined,
      date: new Date(),
      account: "U-bob",
      paymentMethod: "Account",
    },
  });

  const handleSubmit = (values: z.infer<typeof expenseFormSchema>) => {
    const balances = accountBalances || {};
    const account = values.account as Account;
    const amount = values.amount === null ? 0 : values.amount;
    if (balances[account] !== undefined && amount > balances[account].balance) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `Not enough balance in ${account} to pay Nu. ${amount.toFixed(2)}. Available: Nu. ${balances[account].balance.toFixed(2)}`
      });
      return;
    }
    const dataToSubmit = {
      ...values,
      amount,
    };
    onSubmit(dataToSubmit as Omit<ExpenseRecord, "id">);
    form.reset();
    form.setValue("date", new Date());
    form.setValue("amount", 0);
    form.setValue("category", "");
    form.setValue("description", "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <Combobox
                options={categoryOptions}
                value={field.value}
                onChange={(value) => field.onChange(value as ExpenseCategory)}
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                notFoundText="No category found."
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Groceries for the week" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  value={field.value === null ? '' : field.value}
                  onChange={e => {
                    const value = e.target.value;
                    field.onChange(value === '' ? null : parseFloat(value) || null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Account</FormLabel>
              <Combobox
                options={accountOptions}
                value={field.value}
                onChange={(value) => field.onChange(value as Account)}
                placeholder="Select an account"
                notFoundText="No account found."
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Payment Method</FormLabel>
              <Combobox
                options={paymentMethodOptions}
                value={field.value}
                onChange={(value) => field.onChange(value as PaymentMethod)}
                placeholder="Select payment method"
                notFoundText="No method found."
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </form>
    </Form>
  );
}
