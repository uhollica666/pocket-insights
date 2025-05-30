import { startOfMonth, endOfMonth, isWithinInterval, format as formatDateFns } from 'date-fns';

export const getCurrentMonthDateRange = (): { start: Date; end: Date } => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};

export const isDateInCurrentMonth = (date: Date): boolean => {
  const { start, end } = getCurrentMonthDateRange();
  // Ensure the date part of start/end is used for comparison
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const normalizedStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const normalizedEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  return isWithinInterval(normalizedDate, { start: normalizedStart, end: normalizedEnd });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const formatDate = (date: Date): string => {
  return formatDateFns(date, "PPP"); // e.g., "Jul 22, 2024"
};
