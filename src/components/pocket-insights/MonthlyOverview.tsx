"use client";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Import Progress
import { Separator } from "@/components/ui/separator"; // Optional, for visual separation
import { formatCurrency } from "@/lib/date-utils";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Scale,
  TrendingUp,
  TrendingDown,
  Landmark, // For bank accounts
  Wallet, // For cash/other accounts
  PiggyBank, // General finance icon
  DollarSign, // For cash withdrawals
  Activity // For overall activity
} from "lucide-react";
import { accounts, type Account } from "@/lib/types";
import { cn } from "@/lib/utils"; // For conditional classes

interface MonthlyOverviewProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  accountBalances: Record<Account, { income: number; expenses: number; balance: number; cashWithdrawals: number }>;
  combinedCashWithdrawals: number;
}

// Helper to get an icon for an account type
const getAccountIcon = (accountName: Account) => {
  const name = accountName.toLowerCase();
  if (name.includes("bank") || name.includes("checking") || name.includes("savings")) return <Landmark className="h-5 w-5 text-primary" />;
  if (name.includes("cash")) return <Wallet className="h-5 w-5 text-primary" />;
  return <PiggyBank className="h-5 w-5 text-primary" />;
};

export function MonthlyOverview({
  totalIncome,
  totalExpenses,
  balance,
  accountBalances,
  combinedCashWithdrawals,
}: MonthlyOverviewProps) {
  const overallExpenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  return (
    <>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight flex items-center">
              <Activity className="mr-2 h-6 w-6 text-primary" />
              Monthly Summary
            </CardTitle>
            <CardDescription className="mt-1">
              Your financial overview for the current cycle (27th–26th).
            </CardDescription>
          </div>
          {/* Maybe a small icon button or link here in the future if needed */}
        </div>
      </CardHeader>

      <CardContent className="pt-2 space-y-6">
        {/* Section 1: Key Overall Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Income */}
          <div className="p-4 bg-muted/50 rounded-lg flex items-start space-x-3 shadow-sm border">
            <div className="p-2 bg-green-500/10 rounded-md">
              <ArrowUpCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(totalIncome)}
              </p>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="p-4 bg-muted/50 rounded-lg flex items-start space-x-3 shadow-sm border">
            <div className="p-2 bg-red-500/10 rounded-md">
              <ArrowDownCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>

          {/* Net Balance */}
          <div className="p-4 bg-muted/50 rounded-lg flex items-start space-x-3 shadow-sm border">
            <div className={cn("p-2 rounded-md", balance >= 0 ? "bg-blue-500/10" : "bg-orange-500/10")}>
              <Scale className={cn("h-6 w-6", balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400")} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p className={cn("text-2xl font-semibold", balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400")}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Expense Ratio Progress Bar & Combined Cash Withdrawals */}
        {totalIncome > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg shadow-sm border space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Overall Spending</p>
              <p className="text-sm font-semibold">
                {formatCurrency(totalExpenses)} spent of {formatCurrency(totalIncome)}
              </p>
            </div>
            <Progress value={Math.min(overallExpenseRatio, 100)} className="h-2 [&>*]:bg-gradient-to-r [&>*]:from-amber-500 [&>*]:to-red-600" />
            <p className="text-xs text-muted-foreground text-right">
              {overallExpenseRatio > 100
                ? `Overspent by ${formatCurrency(totalExpenses - totalIncome)} (${(overallExpenseRatio - 100).toFixed(1)}%)`
                : `${overallExpenseRatio.toFixed(1)}% of income spent`}
            </p>
          </div>
        )}

        {combinedCashWithdrawals > 0 && (
          <div className="p-4 bg-yellow-500/10 rounded-lg flex items-center justify-between shadow-sm border border-yellow-500/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-md">
                <DollarSign className="h-6 w-6 text-yellow-700 dark:text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Combined Cash Withdrawals</p>
                <p className="text-lg font-semibold text-yellow-700 dark:text-yellow-500">
                  {formatCurrency(combinedCashWithdrawals)}
                </p>
              </div>
            </div>
          </div>
        )}


        <Separator className="my-6" />

        {/* Section 2: Account Breakdown */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            Account Details
          </h3>
          <div className="space-y-4">
            {accounts.map(account => {
              const acc = accountBalances[account] || { income: 0, expenses: 0, balance: 0, cashWithdrawals: 0 };
              const expenseRatio = acc.income > 0 ? (acc.expenses / acc.income) * 100 : 0;

              return (
                <div key={account} className="p-4 border rounded-lg bg-background shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getAccountIcon(account)}
                      <h4 className="font-semibold text-lg">{account}</h4>
                    </div>
                    <span className={cn("text-lg font-bold", acc.balance >= 0 ? "text-primary" : "text-destructive")}>
                      {formatCurrency(acc.balance)}
                    </span>
                  </div>

                  {/* Progress Bar for account */}
                  {acc.income > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Expenses vs Income</span>
                        <span>{expenseRatio.toFixed(0)}%</span>
                      </div>
                      <Progress
                        value={Math.min(expenseRatio, 100)}
                        className={`
                          h-1.5
                          [&>*]:${expenseRatio > 75 ? (expenseRatio > 100 ? "bg-red-500" : "bg-amber-500") : "bg-green-500"}
                        `}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Income</p>
                        <p className="font-medium text-green-600">{formatCurrency(acc.income)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Expenses</p>
                        <p className="font-medium text-red-600">{formatCurrency(acc.expenses)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Cash Withdrawals</p>
                        <p className="font-medium text-yellow-700">{formatCurrency(acc.cashWithdrawals)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </>
  );
}