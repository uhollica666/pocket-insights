import { isWithinInterval, format as formatDateFns } from 'date-fns';

export const getCurrentMonthDateRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  // If today is 27th or later, start is 27th of this month, end is 26th of next month
  // If today is before 27th, start is 27th of previous month, end is 26th of this month
  let start: Date, end: Date;
  if (now.getDate() >= 27) {
    start = new Date(year, month, 27);
    // End is 26th of next month
    end = new Date(year, month + 1, 26);
  } else {
    // Start is 27th of previous month
    start = new Date(year, month - 1, 27);
    end = new Date(year, month, 26);
  }
  return { start, end };
};

export const isDateInCurrentMonth = (date: Date): boolean => {
  const { start, end } = getCurrentMonthDateRange();
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
