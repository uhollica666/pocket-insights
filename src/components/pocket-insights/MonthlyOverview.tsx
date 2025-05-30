"use client";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/date-utils";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, TrendingUp, TrendingDown, Scale } from "lucide-react";

interface MonthlyOverviewProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function MonthlyOverview({ totalIncome, totalExpenses, balance }: MonthlyOverviewProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Monthly Summary</CardTitle>
        <CardDescription>Your financial overview for the current month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ArrowUpCircle className="h-6 w-6 text-green-500" />
            <span className="text-lg">Total Income</span>
          </div>
          <span className="text-lg font-semibold text-green-600">{formatCurrency(totalIncome)}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ArrowDownCircle className="h-6 w-6 text-red-500" />
            <span className="text-lg">Total Expenses</span>
          </div>
          <span className="text-lg font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/50">
          <div className="flex items-center space-x-3">
            <Scale className="h-6 w-6 text-primary" />
            <span className="text-lg font-medium">Current Balance</span>
          </div>
          <span className={`text-xl font-bold ${balance >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {formatCurrency(balance)}
          </span>
        </div>
      </CardContent>
    </>
  );
}
