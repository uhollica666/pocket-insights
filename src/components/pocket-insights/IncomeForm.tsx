
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

interface IncomeFormProps {
  onSubmit: (data: Omit<IncomeRecord, "id">) => void;
}

export function IncomeForm({ onSubmit }: IncomeFormProps) {
  const form = useForm<z.infer<typeof incomeFormSchema>>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      source: "",
      amount: null, // Changed from undefined
      date: new Date(),
    },
  });

  const handleSubmit = (values: z.infer<typeof incomeFormSchema>) => {
    // Ensure amount is a number before submitting, schema will validate
    const dataToSubmit = {
        ...values,
        amount: values.amount === null ? 0 : values.amount, // Or handle as per your schema's expectation for null
    };
    onSubmit(dataToSubmit as Omit<IncomeRecord, "id">); // Cast might be needed if schema expects number
    form.reset();
     form.setValue("date", new Date()); // Reset date to today after submission
     form.setValue("amount", null); // Explicitly reset amount to null
     form.setValue("source", ""); 
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
                  placeholder="0.00" 
                  {...field} 
                  value={field.value === null ? '' : field.value} // Display empty string for null
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
          <PlusCircle className="mr-2 h-4 w-4" /> Add Income
        </Button>
      </form>
    </Form>
  );
}

