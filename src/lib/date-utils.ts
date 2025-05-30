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
  // Intl.NumberFormat for 'BTN' (Bhutanese Ngultrum) typically displays 'BTN' as the code.
  // To display 'Nu.', we'll format the number and prepend 'Nu. '.
  return 'Nu. ' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatDate = (date: Date): string => {
  return formatDateFns(date, "PPP"); // e.g., "Jul 22, 2024"
};
