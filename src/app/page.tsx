"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/pocket-insights/AppHeader";
import { IncomeForm } from "@/components/pocket-insights/IncomeForm";
import { ExpenseForm } from "@/components/pocket-insights/ExpenseForm";
import { MonthlyOverview } from "@/components/pocket-insights/MonthlyOverview";
import { SpendingAnalysis } from "@/components/pocket-insights/SpendingAnalysis";
import { SavingsInsightsSection } from "@/components/pocket-insights/SavingsInsights";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { IncomeRecord, ExpenseRecord, ExpenseCategory, Account, TransferRecord } from "@/lib/types";
import { isDateInCurrentMonth } from "@/lib/date-utils";
import { getSavingsInsights, type SavingsInsightsInput } from "@/ai/flows/savings-insights";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp, query, orderBy, FirestoreError } from "firebase/firestore";
import { ListChecks } from "lucide-react";
import { TransferForm } from "@/components/pocket-insights/TransferForm";

declare global {
  interface Window {
    __accountBalances?: Record<string, { income: number; expenses: number; balance: number; cashWithdrawals: number }>;
  }
}

export default function PocketInsightsPage() {
  const { toast } = useToast();
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);
  const [transferRecords, setTransferRecords] = useState<TransferRecord[]>([]);
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

      // Fetch transfers
      const transferQuery = query(collection(db, "transfers"), orderBy("date", "desc"));
      const transferSnapshot = await getDocs(transferQuery);
      const fetchedTransfers = transferSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date: (data.date as Timestamp).toDate(),
        } as TransferRecord;
      });
      setTransferRecords(fetchedTransfers);
    } catch (error) {
      let description = "Could not load financial records. Please check console and try again later.";
      if (error instanceof FirestoreError) {
        description = `Firestore Error: ${error.code} - ${error.message}. Check console.`;
      } else if (error instanceof Error) {
        description = `Error: ${error.message}. Check console.`;
      }
      toast({
        variant: "destructive",
        title: "Error Loading Data",
        description,
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

  // Compute per-account balances and cash withdrawals
  const accounts = useMemo(() => {
    const accountSet = new Set<Account>();
    currentMonthIncomeRecords.forEach(r => accountSet.add(r.account));
    currentMonthExpenseRecords.forEach(r => accountSet.add(r.account));
    return Array.from(accountSet);
  }, [currentMonthIncomeRecords, currentMonthExpenseRecords]);

  const accountBalances = useMemo(() => {
    const balances: Record<Account, { income: number; expenses: number; balance: number; cashWithdrawals: number }> = {} as any;
    accounts.forEach(account => {
      const income = currentMonthIncomeRecords.filter(r => r.account === account).reduce((sum, r) => sum + r.amount, 0);
      const expenses = currentMonthExpenseRecords.filter(r => r.account === account).reduce((sum, r) => sum + r.amount, 0);
      const cashWithdrawals = currentMonthExpenseRecords.filter(r => r.account === account && r.category === 'Cash Withdrawals').reduce((sum, r) => sum + r.amount, 0);
      // Transfers
      const transferIn = transferRecords.filter(t => t.toAccount === account).reduce((sum, t) => sum + t.amount, 0);
      const transferOut = transferRecords.filter(t => t.fromAccount === account).reduce((sum, t) => sum + t.amount, 0);
      balances[account] = {
        income,
        expenses,
        balance: income - expenses + transferIn - transferOut,
        cashWithdrawals,
      };
    });
    return balances;
  }, [accounts, currentMonthIncomeRecords, currentMonthExpenseRecords, transferRecords]);

  const combinedCashWithdrawals = useMemo(() => {
    return currentMonthExpenseRecords.filter(r => r.category === 'Cash Withdrawals').reduce((sum, r) => sum + r.amount, 0);
  }, [currentMonthExpenseRecords]);

  const handleAddIncome = async (data: Omit<IncomeRecord, "id">) => {
    if (!(data.date instanceof Date)) {
      toast({ variant: "destructive", title: "Internal Error", description: "Date is invalid." });
      return;
    }
    try {
      const firestoreData = {
        ...data,
        date: Timestamp.fromDate(data.date),
      };
      const docRef = await addDoc(collection(db, "incomeRecords"), firestoreData);

      setIncomeRecords(prev => [{ ...data, id: docRef.id, date: data.date }, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
      toast({ title: "Income Added", description: `${data.source}: Nu. ${data.amount.toFixed(2)}` });
    } catch (error) {
      let description = "Could not add income record. Please check console for details.";
      if (error instanceof FirestoreError) {
        description = `Firestore Error: ${error.code} - ${error.message}. Check console.`;
      } else if (error instanceof Error) {
        description = `Error: ${error.message}. Check console.`;
      }
      toast({ variant: "destructive", title: "Error Adding Income", description });
    }
  };

  const handleAddExpense = async (data: Omit<ExpenseRecord, "id">) => {
    if (!(data.date instanceof Date)) {
      toast({ variant: "destructive", title: "Internal Error", description: "Date is invalid." });
      return;
    }
    try {
      const firestoreData = {
        ...data,
        date: Timestamp.fromDate(data.date),
      };
      const docRef = await addDoc(collection(db, "expenseRecords"), firestoreData);

      setExpenseRecords(prev => [{ ...data, id: docRef.id, date: data.date }, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
      toast({ title: "Expense Added", description: `${data.category}: Nu. ${data.amount.toFixed(2)}` });
    } catch (error) {
      let description = "Could not add expense record. Please check console for details.";
      if (error instanceof FirestoreError) {
        description = `Firestore Error: ${error.code} - ${error.message}. Check console.`;
      } else if (error instanceof Error) {
        description = `Error: ${error.message}. Check console.`;
      }
      toast({ variant: "destructive", title: "Error Adding Expense", description });
    }
  };

  const handleAddTransfer = async (data: Omit<TransferRecord, "id">) => {
    try {
      const firestoreData = {
        ...data,
        date: Timestamp.fromDate(data.date),
      };
      const docRef = await addDoc(collection(db, "transfers"), firestoreData);
      setTransferRecords(prev => [{ ...data, id: docRef.id, date: data.date }, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
      toast({ title: "Transfer Complete", description: `Transferred Nu. ${data.amount} from ${data.fromAccount} to ${data.toAccount}` });
    } catch (error) {
      let description = "Could not add transfer record. Please check console for details.";
      if (error instanceof FirestoreError) {
        description = `Firestore Error: ${error.code} - ${error.message}. Check console.`;
      } else if (error instanceof Error) {
        description = `Error: ${error.message}. Check console.`;
      }
      toast({ variant: "destructive", title: "Error Adding Transfer", description });
    }
  };

  const handleGetSavingsInsights = async (targetSavingsRate: number) => {
    setIsLoadingInsights(true);
    setSavingsInsightsError(null);
    setSavingsInsights(undefined);

    if (totalMonthlyIncome === 0 && currentMonthExpenseRecords.length === 0) {
      toast({ variant: "default", title: "No Data for Insights", description: "Please add some income and expenses for the current month to get insights." });
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
      toast({ title: "Insights Generated!", description: "Check out your personalized savings tips." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate insights.";
      setSavingsInsightsError(errorMessage);
      toast({ variant: "destructive", title: "Error Generating Insights", description: errorMessage });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Helper to get last 5 transactions
  const last5Transactions = useMemo(() => {
    // Normalize all to a common structure
    const txs = [
      ...incomeRecords.map(r => ({
        type: 'Income',
        date: r.date,
        amount: r.amount,
        account: r.account,
        description: r.source,
        extra: r.paymentMethod,
      })),
      ...expenseRecords.map(r => ({
        type: 'Expense',
        date: r.date,
        amount: r.amount,
        account: r.account,
        description: r.category + (r.description ? `: ${r.description}` : ''),
        extra: r.paymentMethod,
      })),
      ...transferRecords.map(r => ({
        type: 'Transfer',
        date: r.date,
        amount: r.amount,
        account: `${r.fromAccount} → ${r.toAccount}`,
        description: r.note || '',
        extra: '',
      })),
    ];
    return txs.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }, [incomeRecords, expenseRecords, transferRecords]);

  // Expose accountBalances globally for validation in forms. This is a temporary solution; ideally, use context or props.
  if (typeof window !== "undefined") {
    window.__accountBalances = accountBalances;
  }

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
            <CardDescription>Log your income, expenses, or transfer funds between accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="expense" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="income">Add Income</TabsTrigger>
                <TabsTrigger value="expense">Add Expense</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
              </TabsList>
              <TabsContent value="income" className="pt-6">
                <IncomeForm onSubmit={handleAddIncome} />
              </TabsContent>
              <TabsContent value="expense" className="pt-6">
                <ExpenseForm onSubmit={handleAddExpense} accountBalances={accountBalances} />
              </TabsContent>
              <TabsContent value="transfer" className="pt-6">
                <TransferForm onSubmit={handleAddTransfer} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <MonthlyOverview
            totalIncome={totalMonthlyIncome}
            totalExpenses={totalMonthlyExpenses}
            balance={monthlyBalance}
            accountBalances={accountBalances}
            combinedCashWithdrawals={combinedCashWithdrawals}
          />
          {currentMonthExpenseRecords.length > 0 && <Separator className="my-4" />}
          <SpendingAnalysis highestSpending={highestSpendingCategory} />
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">Last 5 Transactions</CardTitle>
            <CardDescription>Recent income, expenses, and transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">Type</th>
                    <th className="px-2 py-1 text-left">Date</th>
                    <th className="px-2 py-1 text-left">Account(s)</th>
                    <th className="px-2 py-1 text-left">Description</th>
                    <th className="px-2 py-1 text-right">Amount</th>
                    <th className="px-2 py-1 text-left">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {last5Transactions.map((tx, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-2 py-1 font-medium">{tx.type}</td>
                      <td className="px-2 py-1">{tx.date.toLocaleDateString()}</td>
                      <td className="px-2 py-1">{tx.account}</td>
                      <td className="px-2 py-1">{tx.description}</td>
                      <td className="px-2 py-1 text-right">Nu. {tx.amount.toFixed(2)}</td>
                      <td className="px-2 py-1">{tx.extra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">Expense History</CardTitle>
            <CardDescription>View all your recorded expense transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/all-expenses">
                <ListChecks className="mr-2 h-4 w-4" /> View All Expenses
              </Link>
            </Button>
          </CardContent>
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
        © {new Date().getFullYear()} Pocket Insights. Developed by Ujwal Hollica with help of Firebase Studio.
      </footer>
    </div>
  );
}
