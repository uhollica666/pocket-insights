"use client";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/date-utils";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, TrendingUp, TrendingDown, Scale } from "lucide-react";
import { accounts, type Account } from "@/lib/types";

interface MonthlyOverviewProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  accountBalances: Record<Account, { income: number; expenses: number; balance: number; cashWithdrawals: number }>;
  combinedCashWithdrawals: number;
}

export function MonthlyOverview({ totalIncome, totalExpenses, balance, accountBalances, combinedCashWithdrawals }: MonthlyOverviewProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Monthly Summary</CardTitle>
        <CardDescription>Your financial overview for the current cycle (27th–26th).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          {accounts.map(account => {
            const acc = accountBalances[account] || { income: 0, expenses: 0, balance: 0, cashWithdrawals: 0 };
            return (
              <div key={account} className="p-3 rounded-lg border bg-secondary/30 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="font-semibold text-base">{account}</div>
                <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
                  <span className="text-green-600">Income: {formatCurrency(acc.income)}</span>
                  <span className="text-red-600">Expenses: {formatCurrency(acc.expenses)}</span>
                  <span className={acc.balance >= 0 ? "text-primary" : "text-destructive"}>Balance: {formatCurrency(acc.balance)}</span>
                  <span className="text-yellow-700">Cash Withdrawals: {formatCurrency(acc.cashWithdrawals)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/50 mt-4">
          <div className="flex flex-col">
            <span className="text-lg font-medium">Combined Total Balance</span>
            <span className="text-yellow-700 text-sm">Combined Cash Withdrawals: {formatCurrency(combinedCashWithdrawals)}</span>
          </div>
          <span className={`text-xl font-bold ${balance >= 0 ? 'text-primary' : 'text-destructive'}`}>{formatCurrency(balance)}</span>
        </div>
      </CardContent>
    </>
  );
}
