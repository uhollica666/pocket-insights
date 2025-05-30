
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { expenseFormSchema } from "@/lib/schemas";
import { type ExpenseRecord, expenseCategories } from "@/lib/types";
import { PlusCircle } from "lucide-react";


interface ExpenseFormProps {
  onSubmit: (data: Omit<ExpenseRecord, "id">) => void;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      category: undefined,
      description: "",
      amount: null, // Changed from undefined
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
    form.setValue("date", new Date()); // Reset date to today
    form.setValue("amount", null); // Explicitly reset amount to null
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
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </form>
    </Form>
  );
}

