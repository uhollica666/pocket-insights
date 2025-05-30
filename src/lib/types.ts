export interface Transaction {
  id: string;
  amount: number;
  date: Date;
}

export interface IncomeRecord extends Transaction {
  source: string;
}

export interface ExpenseRecord extends Transaction {
  category: ExpenseCategory;
  description: string;
}

export type ExpenseCategory = 'Food' | 'Transport' | 'Housing' | 'Utilities' | 'Entertainment' | 'Health' | 'Shopping' | 'Other';

export const expenseCategories: ExpenseCategory[] = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

export const categoryIcons: Record<ExpenseCategory, React.ElementType> = {
  Food: "Utensils",
  Transport: "Car",
  Housing: "Home",
  Utilities: "Zap",
  Entertainment: "Film",
  Health: "HeartPulse",
  Shopping: "ShoppingBag",
  Other: "HelpCircle",
};
