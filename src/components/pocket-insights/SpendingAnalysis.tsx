"use client";

import { CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/date-utils";
import { PieChart, TrendingUp } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { ExpenseCategory } from "@/lib/types";
import { categoryIcons } from "@/lib/types";

interface SpendingAnalysisProps {
  highestSpending?: { category: ExpenseCategory; amount: number };
}

export function SpendingAnalysis({ highestSpending }: SpendingAnalysisProps) {
  const IconComponent = highestSpending ? LucideIcons[categoryIcons[highestSpending.category] as keyof typeof LucideIcons.icons] || PieChart : PieChart;

  return (
    <CardContent className="pt-4">
      <h3 className="text-lg font-semibold mb-3 text-foreground/90">Spending Hotspot</h3>
      {highestSpending ? (
        <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg border border-accent/50">
          <div className="flex items-center space-x-3">
            <IconComponent className="h-6 w-6 text-accent-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Highest Spending Category</p>
              <p className="text-lg font-medium text-accent-foreground">{highestSpending.category}</p>
            </div>
          </div>
          <span className="text-lg font-semibold text-accent-foreground">{formatCurrency(highestSpending.amount)}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
          <PieChart className="h-6 w-6 text-muted-foreground" />
          <p className="text-muted-foreground">No expenses recorded this month to analyze.</p>
        </div>
      )}
    </CardContent>
  );
}
