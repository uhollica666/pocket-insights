
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
import { transferFormSchema } from "@/lib/schemas";
import { accounts, type Account } from "@/lib/types";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

interface TransferFormProps {
    onSubmit: (data: { fromAccount: Account; toAccount: Account; amount: number; date: Date; note?: string }) => void;
}

const accountOptions: ComboboxOption[] = accounts.map((account) => ({
    value: account,
    label: account,
}));

export function TransferForm({ onSubmit }: TransferFormProps) {
    const form = useForm<z.infer<typeof transferFormSchema>>({
        resolver: zodResolver(transferFormSchema),
        defaultValues: {
            fromAccount: "U-bob",
            toAccount: "R-bob",
            amount: undefined,
            date: new Date(),
            note: "",
        },
    });

    const handleSubmit = (values: z.infer<typeof transferFormSchema>) => {
        if (values.fromAccount === values.toAccount) {
            form.setError("toAccount", { message: "Cannot transfer to the same account." });
            return;
        }
        onSubmit({
            ...values,
            fromAccount: values.fromAccount as Account,
            toAccount: values.toAccount as Account,
        });
        form.reset({
            fromAccount: "U-bob",
            toAccount: "R-bob",
            amount: undefined,
            date: new Date(),
            note: "",
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="fromAccount"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>From Account</FormLabel>
                            <Combobox
                                options={accountOptions}
                                value={field.value}
                                onChange={(value) => field.onChange(value as Account)}
                                placeholder="Select source account"
                                notFoundText="No account found."
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="toAccount"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>To Account</FormLabel>
                            <Combobox
                                options={accountOptions}
                                value={field.value}
                                onChange={(value) => field.onChange(value as Account)}
                                placeholder="Select destination account"
                                notFoundText="No account found."
                            />
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
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
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
                    name="note"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Note (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., For cash distribution" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full sm:w-auto">
                    Transfer
                </Button>
            </form>
        </Form>
    );
}
