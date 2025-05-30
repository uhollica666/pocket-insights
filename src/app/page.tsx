
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
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
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp, query, orderBy } from "firebase/firestore";

export default function PocketInsightsPage() {
  const { toast } = useToast();
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [savingsInsights, setSavingsInsights] = useState<string[] | undefined>(undefined);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [savingsInsightsError, setSavingsInsightsError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const incomeQuery = query(collection(db, "incomeRecords"), orderBy("date", "desc"));
      const incomeSnapshot = await getDocs(incomeQuery);
      const fetchedIncomeRecords = incomeSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          ...data, 
          id: doc.id, 
          date: (data.date as Timestamp).toDate() 
        } as IncomeRecord;
      });
      setIncomeRecords(fetchedIncomeRecords);

      const expenseQuery = query(collection(db, "expenseRecords"), orderBy("date", "desc"));
      const expenseSnapshot = await getDocs(expenseQuery);
      const fetchedExpenseRecords = expenseSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          ...data, 
          id: doc.id, 
          date: (data.date as Timestamp).toDate() 
        } as ExpenseRecord;
      });
      setExpenseRecords(fetchedExpenseRecords);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      toast({
        variant: "destructive",
        title: "Error Loading Data",
        description: "Could not load financial records. Please try again later.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


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

  const handleAddIncome = async (data: Omit<IncomeRecord, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "incomeRecords"), {
        ...data,
        date: Timestamp.fromDate(data.date), // Convert Date to Firestore Timestamp
      });
      // Optimistically update UI or re-fetch
      setIncomeRecords(prev => [{ ...data, id: docRef.id }, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
      toast({ title: "Income Added", description: `${data.source}: Nu. ${data.amount.toFixed(2)}` });
    } catch (error) {
      console.error("Error adding income to Firestore: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add income record." });
    }
  };

  const handleAddExpense = async (data: Omit<ExpenseRecord, "id">) => {
     try {
      const docRef = await addDoc(collection(db, "expenseRecords"), {
        ...data,
        date: Timestamp.fromDate(data.date), // Convert Date to Firestore Timestamp
      });
      // Optimistically update UI or re-fetch
      setExpenseRecords(prev => [{ ...data, id: docRef.id }, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
      toast({ title: "Expense Added", description: `${data.category}: Nu. ${data.amount.toFixed(2)}` });
    } catch (error) {
      console.error("Error adding expense to Firestore: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add expense record." });
    }
  };

  const handleGetSavingsInsights = async (targetSavingsRate: number) => {
    setIsLoadingInsights(true);
    setSavingsInsightsError(null);
    setSavingsInsights(undefined);

    if (totalMonthlyIncome === 0 && currentMonthExpenseRecords.length === 0) {
         toast({ variant: "default", title: "No Data for Insights", description: "Please add some income and expenses for the current month to get insights."});
         setIsLoadingInsights(false);
         return;
    }


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
  
  if (isLoadingData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <AppHeader />
        <p className="text-lg text-muted-foreground mt-8">Loading financial data...</p>
      </div>
    );
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
