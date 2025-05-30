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
import { type ExpenseRecord, expenseCategories, type ExpenseCategory } from "@/lib/types";
import { PlusCircle } from "lucide-react";


interface ExpenseFormProps {
  onSubmit: (data: Omit<ExpenseRecord, "id">) => void;
}

const categoryOptions: ComboboxOption[] = expenseCategories.map(category => ({
  value: category,
  label: category,
}));

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      category: undefined,
      description: "",
      amount: null,
      date: new Date(),
    },
  });

  const handleSubmit = (values: z.infer<typeof expenseFormSchema>) => {
    const dataToSubmit = {
        ...values,
        amount: values.amount === null ? 0 : values.amount, 
    };
    onSubmit(dataToSubmit as Omit<ExpenseRecord, "id">);
    form.reset();
    form.setValue("date", new Date());
    form.setValue("amount", null); 
    form.setValue("category", undefined);
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
        <Button type="submit" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </form>
    </Form>
  );
}
