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
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { savingsInsightsFormSchema } from "@/lib/schemas";
import { Lightbulb, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SavingsInsightsFormProps {
  onSubmit: (targetRate: number) => Promise<void>;
  isLoading: boolean;
}

export function SavingsInsightsForm({ onSubmit, isLoading }: SavingsInsightsFormProps) {
  const form = useForm<z.infer<typeof savingsInsightsFormSchema>>({
    resolver: zodResolver(savingsInsightsFormSchema),
    defaultValues: {
      targetSavingsRate: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof savingsInsightsFormSchema>) => {
    await onSubmit(values.targetSavingsRate);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="targetSavingsRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Savings Rate (e.g., 0.2 for 20%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.0 - 1.0" 
                  step="0.01" 
                  min="0" 
                  max="1" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Get Savings Insights
        </Button>
      </form>
    </Form>
  );
}

interface SavingsInsightsDisplayProps {
  insights?: string[];
  isLoading: boolean;
  error?: string | null;
}

export function SavingsInsightsDisplay({ insights, isLoading, error }: SavingsInsightsDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Generating insights...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <p className="mt-4 text-center text-muted-foreground">
        Enter a target savings rate and click "Get Savings Insights" to see personalized suggestions.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <h4 className="text-md font-semibold">Here are your personalized savings insights:</h4>
      <ul className="list-disc space-y-2 pl-5 text-sm text-foreground/90">
        {insights.map((insight, index) => (
          <li key={index} className="rounded-md bg-background p-3 shadow-sm border border-border/50">
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SavingsInsightsSection({
  onGetInsights,
  isLoadingInsights,
  savingsInsights,
  savingsInsightsError,
}: {
  onGetInsights: (targetRate: number) => Promise<void>;
  isLoadingInsights: boolean;
  savingsInsights: string[] | undefined;
  savingsInsightsError: string | null;
}) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">AI Savings Advisor</CardTitle>
        <CardDescription>Get AI-powered insights to help you reach your savings goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <SavingsInsightsForm onSubmit={onGetInsights} isLoading={isLoadingInsights} />
        <SavingsInsightsDisplay
          insights={savingsInsights}
          isLoading={false} // Form handles its own loading state for button, display just shows results/error
          error={savingsInsightsError}
        />
      </CardContent>
    </>
  );
}
