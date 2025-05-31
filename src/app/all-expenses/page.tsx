"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/pocket-insights/AppHeader"; // Assuming this is styled
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"; // Import Table components
import {
  Loader2,
  ArrowLeft,
  Search,
  Filter,
  RotateCcw, // For Reset
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox, // For empty state
  CalendarIcon, // Though DatePicker uses it internally
  X // For clearing search
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, Timestamp, query, orderBy, FirestoreError } from "firebase/firestore";
import type { ExpenseRecord } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/date-utils"; // Assuming formatDate is like 'MMM d, yyyy'
import { useToast } from "@/hooks/use-toast";
import { accounts, expenseCategories } from "@/lib/types";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker"; // Import DatePicker
import { cn } from "@/lib/utils"; // For conditional classes

// Helper for Sort Icon
const SortIcon = ({ sortKey, currentKey, sortDir }: { sortKey: string; currentKey: string; sortDir: 'asc' | 'desc' }) => {
  if (sortKey !== currentKey) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
  return sortDir === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
};


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

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [accountFilter, setAccountFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      if (search && !(
        exp.description?.toLowerCase().includes(search.toLowerCase()) ||
        exp.category.toLowerCase().includes(search.toLowerCase())
      )) return false;
      if (categoryFilter && exp.category !== categoryFilter) return false;
      if (accountFilter && exp.account !== accountFilter) return false;
      // Adjust date comparison to be inclusive of the 'to' date by setting it to end of day
      if (dateRange.from && exp.date < dateRange.from) return false;
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // End of the selected day
        if (exp.date > toDate) return false;
      }
      if (minAmount && exp.amount < parseFloat(minAmount)) return false;
      if (maxAmount && exp.amount > parseFloat(maxAmount)) return false;
      return true;
    });
  }, [expenses, search, categoryFilter, accountFilter, dateRange, minAmount, maxAmount]);

  const [sortKey, setSortKey] = useState<'date' | 'amount' | 'category' | 'account'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: 'date' | 'amount' | 'category' | 'account') => {
    if (sortKey === key) {
      setSortDir(prevDir => prevDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc'); // Default to ascending when changing sort key
    }
  };

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = a.date.getTime() - b.date.getTime();
      else if (sortKey === 'amount') cmp = a.amount - b.amount;
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortKey === 'account') cmp = a.account.localeCompare(b.account);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredExpenses, sortKey, sortDir]);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter(undefined);
    setAccountFilter(undefined);
    setDateRange({});
    setMinAmount("");
    setMaxAmount("");
  };

  const categoryOptions = useMemo(() => [
    { value: '', label: 'All Categories' },
    ...expenseCategories.map(c => ({ value: c, label: c }))
  ], []);

  const accountOptions = useMemo(() => [
    { value: '', label: 'All Accounts' },
    ...accounts.map(a => ({ value: a, label: a }))
  ], []);


  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <AppHeader /> {/* Or some minimal header for loading state */}
        <div className="flex items-center justify-center py-20 flex-grow">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">Loading expenses...</p>
        </div>
        <footer className="py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pocket Insights.
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <main className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 flex-grow">
        <Card className="shadow-xl border-border/40">
          <CardHeader className="border-b border-border/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight">All Expenses</CardTitle>
                <CardDescription className="mt-1 text-muted-foreground">
                  View, filter, and sort all your recorded expenses.
                </CardDescription>
              </div>
              <Button variant="outline" asChild className="shrink-0">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {expenses.length === 0 && !isLoading ? (
              <div className="text-center py-20">
                <Inbox className="mx-auto h-16 w-16 text-muted-foreground/70" />
                <h3 className="mt-4 text-xl font-semibold">No Expenses Yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Looks like you haven't recorded any expenses.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/add-expense">Add Your First Expense</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* --- Filter Section --- */}
                <div className="mb-6 p-4 border rounded-lg bg-background shadow-sm">
                  <div className="flex items-center mb-3">
                    <Filter className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-lg font-semibold">Filters</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-8 w-full"
                        placeholder="Search description/category..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                      {search && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => setSearch("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Combobox
                      options={categoryOptions}
                      value={categoryFilter}
                      onChange={v => setCategoryFilter(v || undefined)}
                      placeholder="Select Category"
                      notFoundText="No category found"
                      className="w-full"
                    />
                    <Combobox
                      options={accountOptions}
                      value={accountFilter}
                      onChange={v => setAccountFilter(v || undefined)}
                      placeholder="Select Account"
                      notFoundText="No account found"
                      className="w-full"
                    />
                    <DatePicker
                      value={dateRange.from}
                      onChange={date => setDateRange(r => ({ ...r, from: date }))}
                      placeholder="From Date"
                      className="w-full"
                    />
                    <DatePicker
                      value={dateRange.to}
                      onChange={date => setDateRange(r => ({ ...r, to: date }))}
                      placeholder="To Date"
                      className="w-full"
                    />
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Min Amount"
                        value={minAmount}
                        onChange={e => setMinAmount(e.target.value)}
                        className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Hide number arrows
                        min="0"
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Max Amount"
                        value={maxAmount}
                        onChange={e => setMaxAmount(e.target.value)}
                        className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Hide number arrows
                        min="0"
                      />
                    </div>
                    <Button variant="outline" onClick={resetFilters} className="w-full sm:col-start-auto xl:col-start-4">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset Filters
                    </Button>
                  </div>
                </div>

                {/* --- Table Section --- */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-muted transition-colors w-[120px]"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center">
                            Date <SortIcon sortKey="date" currentKey={sortKey} sortDir={sortDir} />
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted transition-colors w-[150px]"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center">
                            Category <SortIcon sortKey="category" currentKey={sortKey} sortDir={sortDir} />
                          </div>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted transition-colors w-[150px]"
                          onClick={() => handleSort('account')}
                        >
                          <div className="flex items-center">
                            Account <SortIcon sortKey="account" currentKey={sortKey} sortDir={sortDir} />
                          </div>
                        </TableHead>
                        <TableHead className="w-[120px]">Payment</TableHead>
                        <TableHead
                          className="text-right cursor-pointer hover:bg-muted transition-colors w-[130px]"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center justify-end">
                            Amount <SortIcon sortKey="amount" currentKey={sortKey} sortDir={sortDir} />
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedExpenses.map((expense) => (
                        <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium whitespace-nowrap">{formatDate(expense.date)}</TableCell>
                          <TableCell>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                              {expense.category}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" title={expense.description || undefined}>
                            {expense.description || <span className="text-muted-foreground italic">N/A</span>}
                          </TableCell>
                          <TableCell>{expense.account}</TableCell>
                          <TableCell>{expense.paymentMethod}</TableCell>
                          <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(expense.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    {sortedExpenses.length === 0 && (
                      <TableCaption className="py-10 text-center">
                        <Inbox className="mx-auto h-12 w-12 text-muted-foreground/70 mb-2" />
                        No expenses match your current filters.
                      </TableCaption>
                    )}
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Pocket Insights. All rights reserved.
      </footer>
    </div>
  );
}