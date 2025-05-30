
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AppHeader } from "@/components/pocket-insights/AppHeader";
import { IncomeForm } from "@/components/pocket-insights/IncomeForm";
import { ExpenseForm } from "@/components/pocket-insights/ExpenseForm";
import { MonthlyOverview } from "@/components/pocket-insights/MonthlyOverview";
import { SpendingAnalysis } from "@/components/pocket-insights/SpendingAnalysis";
import { SavingsInsightsSection } from "@/components/pocket-insights/SavingsInsights";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { IncomeRecord, ExpenseRecord, ExpenseCategory } from "@/lib/types";
import { isDateInCurrentMonth } from "@/lib/date-utils";
import { getSavingsInsights, type SavingsInsightsInput } from "@/ai/flows/savings-insights";
import { Separator } from "@/components/ui/separator";

export default function PocketInsightsPage() {
  const { toast } = useToast();
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);

  const [savingsInsights, setSavingsInsights] = useState<string[] | undefined>(undefined);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [savingsInsightsError, setSavingsInsightsError] = useState<string | null>(null);

  // Hydration-safe state initialization for localStorage
  useEffect(() => {
    const storedIncome = localStorage.getItem("pocketInsightsIncome");
    if (storedIncome) {
      setIncomeRecords(JSON.parse(storedIncome, (key, value) => key === 'date' ? new Date(value) : value));
    }
    const storedExpenses = localStorage.getItem("pocketInsightsExpenses");
    if (storedExpenses) {
      setExpenseRecords(JSON.parse(storedExpenses, (key, value) => key === 'date' ? new Date(value) : value));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pocketInsightsIncome", JSON.stringify(incomeRecords));
  }, [incomeRecords]);

  useEffect(() => {
    localStorage.setItem("pocketInsightsExpenses", JSON.stringify(expenseRecords));
  }, [expenseRecords]);


  const currentMonthIncomeRecords = useMemo(() => {
    return incomeRecords.filter((record) => isDateInCurrentMonth(record.date));
  }, [incomeRecords]);

  const currentMonthExpenseRecords = useMemo(() => {
    return expenseRecords.filter((record) => isDateInCurrentMonth(record.date));
  }, [expenseRecords]);

  const totalMonthlyIncome = useMemo(() => {
    return currentMonthIncomeRecords.reduce((sum, record) => sum + record.amount, 0);
  }, [currentMonthIncomeRecords]);

  const totalMonthlyExpenses = useMemo(() => {
    return currentMonthExpenseRecords.reduce((sum, record) => sum + record.amount, 0);
  }, [currentMonthExpenseRecords]);

  const monthlyBalance = useMemo(() => {
    return totalMonthlyIncome - totalMonthlyExpenses;
  }, [totalMonthlyIncome, totalMonthlyExpenses]);

  const highestSpendingCategory = useMemo(() => {
    if (currentMonthExpenseRecords.length === 0) return undefined;

    const spendingByCategory: Record<string, number> = {};
    currentMonthExpenseRecords.forEach((expense) => {
      spendingByCategory[expense.category] = (spendingByCategory[expense.category] || 0) + expense.amount;
    });

    let maxAmount = 0;
    let categoryWithMaxSpending: ExpenseCategory | undefined = undefined;

    for (const category in spendingByCategory) {
      if (spendingByCategory[category] > maxAmount) {
        maxAmount = spendingByCategory[category];
        categoryWithMaxSpending = category as ExpenseCategory;
      }
    }
    
    return categoryWithMaxSpending ? { category: categoryWithMaxSpending, amount: maxAmount } : undefined;
  }, [currentMonthExpenseRecords]);

  const handleAddIncome = (data: Omit<IncomeRecord, "id">) => {
    const newRecord: IncomeRecord = { ...data, id: Date.now().toString() };
    setIncomeRecords((prev) => [...prev, newRecord]);
    toast({ title: "Income Added", description: `${data.source}: $${data.amount.toFixed(2)}` });
  };

  const handleAddExpense = (data: Omit<ExpenseRecord, "id">) => {
    const newRecord: ExpenseRecord = { ...data, id: Date.now().toString() };
    setExpenseRecords((prev) => [...prev, newRecord]);
    toast({ title: "Expense Added", description: `${data.category}: $${data.amount.toFixed(2)}` });
  };

  const handleGetSavingsInsights = async (targetSavingsRate: number) => {
    setIsLoadingInsights(true);
    setSavingsInsightsError(null);
    setSavingsInsights(undefined);

    const expensesForAI: Record<string, number> = currentMonthExpenseRecords.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const input: SavingsInsightsInput = {
      income: totalMonthlyIncome,
      expenses: expensesForAI,
      targetSavingsRate,
    };

    try {
      const result = await getSavingsInsights(input);
      setSavingsInsights(result.insights);
      toast({ title: "Insights Generated!", description: "Check out your personalized savings tips."});
    } catch (error) {
      console.error("Error getting savings insights:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate insights.";
      setSavingsInsightsError(errorMessage);
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setIsLoadingInsights(false);
    }
  };
  
  // Ensure component is client-side for localStorage access
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <div className="container mx-auto max-w-3xl p-4 flex-grow space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
             <CardTitle className="text-2xl font-semibold tracking-tight">Record Transactions</CardTitle>
             <CardDescription>Log your income and expenses to keep track of your finances.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="expense" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="income">Add Income</TabsTrigger>
                <TabsTrigger value="expense">Add Expense</TabsTrigger>
              </TabsList>
              <TabsContent value="income" className="pt-6">
                <IncomeForm onSubmit={handleAddIncome} />
              </TabsContent>
              <TabsContent value="expense" className="pt-6">
                <ExpenseForm onSubmit={handleAddExpense} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <MonthlyOverview
            totalIncome={totalMonthlyIncome}
            totalExpenses={totalMonthlyExpenses}
            balance={monthlyBalance}
          />
          {currentMonthExpenseRecords.length > 0 && <Separator className="my-4"/>}
          <SpendingAnalysis highestSpending={highestSpendingCategory} />
        </Card>

        <Card className="shadow-lg">
          <SavingsInsightsSection
            onGetInsights={handleGetSavingsInsights}
            isLoadingInsights={isLoadingInsights}
            savingsInsights={savingsInsights}
            savingsInsightsError={savingsInsightsError}
          />
        </Card>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Pocket Insights. All rights reserved.
      </footer>
    </div>
  );
}
