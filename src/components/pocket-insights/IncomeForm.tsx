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
import { incomeFormSchema } from "@/lib/schemas";
import type { IncomeRecord } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { accounts, type Account, paymentMethods, type PaymentMethod } from "@/lib/types";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

interface IncomeFormProps {
  onSubmit: (data: Omit<IncomeRecord, "id">) => void;
}

const accountOptions: ComboboxOption[] = accounts.map((account) => ({
  value: account,
  label: account,
}));

const paymentMethodOptions: ComboboxOption[] = paymentMethods.map(method => ({
  value: method,
  label: method,
}));

export function IncomeForm({ onSubmit }: IncomeFormProps) {
  const form = useForm<z.infer<typeof incomeFormSchema>>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      source: "",
      amount: undefined,
      date: new Date(),
      account: "U-bob",
      paymentMethod: "Account",
    },
  });

  const handleSubmit = (values: z.infer<typeof incomeFormSchema>) => {
    // Ensure amount is a number before submitting, schema will validate
    const dataToSubmit = {
      ...values,
      amount:
        typeof values.amount === "string"
          ? (values.amount as string).trim() === "" ? 0 : Number(values.amount)
          : Number(values.amount),
    };
    onSubmit(dataToSubmit as Omit<IncomeRecord, "id">);
    form.reset({
      source: "",
      amount: 0,
      date: new Date(),
      account: "U-bob",
      paymentMethod: "Account",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Income Source</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Salary, Freelance Project" {...field} />
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
                  value={field.value ?? ""} // Always use string for input
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers or empty string
                    if (/^\d*\.?\d*$/.test(value)) {
                      field.onChange(value);
                    }
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
              <DatePicker value={field.value} onChange={field.onChange} />
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
          <PlusCircle className="mr-2 h-4 w-4" /> Add Income
        </Button>
      </form>
    </Form>
  );
}

