"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/pocket-insights/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, Timestamp, query, orderBy, FirestoreError } from "firebase/firestore";
import type { ExpenseRecord } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/date-utils";
import { useToast } from "@/hooks/use-toast";

export default function AllExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const expenseQuery = query(collection(db, "expenseRecords"), orderBy("date", "desc"));
      const expenseSnapshot = await getDocs(expenseQuery);
      const fetchedExpenses = expenseSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date: (data.date as Timestamp).toDate(),
        } as ExpenseRecord;
      });
      setExpenses(fetchedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      let description = "Could not load expense records.";
      if (error instanceof FirestoreError) {
        description = `Firestore Error: ${error.code} - ${error.message}. Check console.`;
      } else if (error instanceof Error) {
        description = `Error: ${error.message}. Check console.`;
      }
      toast({
        variant: "destructive",
        title: "Error Loading Expenses",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <div className="container mx-auto max-w-3xl p-4 flex-grow space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold tracking-tight">All Expenses</CardTitle>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <CardDescription>A complete list of all your recorded expenses, latest first.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading expenses...</p>
              </div>
            ) : expenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No expenses recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="whitespace-nowrap">{formatDate(expense.date)}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{formatCurrency(expense.amount)}</TableCell>
                        <TableCell className="max-w-xs truncate" title={expense.description || undefined}>
                          {expense.description || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Pocket Insights. Developed by Ujwal Hollica with help of Firebase Studio.
      </footer>
    </div>
  );
}
