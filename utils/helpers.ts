/**
 * Format currency values with proper symbols and decimals
 */
import { Transaction } from "@/types/finance";

export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format date to short format (MM/DD/YY)
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
};

/**
 * Format time from date string
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get color for transaction type
 */
export const getTypeColor = (type: "income" | "expense"): string => {
  return type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
};

/**
 * Get background color for transaction type
 */
export const getTypeBgColor = (type: "income" | "expense"): string => {
  return type === "income" ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950";
};

/**
 * Get badge color for category
 */
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Salary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Freelance: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Bonus: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Groceries: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    Utilities: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Rent: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    Transport: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    Healthcare: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
    Subscriptions: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
    Dining: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    Books: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300",
  };
  return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
};

/**
 * Export transactions to CSV
 */
export const exportToCSV = (transactions: Transaction[], filename: string = "transactions.csv") => {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t: Transaction) => [
    formatDate(t.date),
    t.description,
    t.category,
    t.type,
    t.amount,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export transactions to JSON
 */
export const exportToJSON = (transactions: Transaction[], filename: string = "transactions.json") => {
  const jsonContent = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (previous: number, current: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Generate ID for new items
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
