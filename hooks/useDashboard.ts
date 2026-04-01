import { useMemo } from "react";
import { Transaction, TransactionFilters, SummaryData, CategoryBreakdown, InsightsData } from "@/types/finance";

/**
 * Hook to compute dashboard summary data
 * Calculates total balance, income, and expenses
 */
export const useDashboardSummary = (transactions: Transaction[]): SummaryData => {
  return useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
    };
  }, [transactions]);
};

/**
 * Hook to compute spending category breakdown
 * Returns array of categories with total amounts and percentages
 */
export const useCategoryBreakdown = (transactions: Transaction[]): CategoryBreakdown[] => {
  return useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");

    const categoryMap = new Map<string, number>();
    expenses.forEach((t) => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    const total = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);
};

/**
 * Hook to compute financial insights
 */
export const useFinancialInsights = (transactions: Transaction[]): InsightsData => {
  // Call other hooks outside useMemo
  const categoryBreakdown = useCategoryBreakdown(transactions);
  const summary = useDashboardSummary(transactions);

  return useMemo(() => {
    // Highest spending category
    const highestSpendingCategory = categoryBreakdown[0] || {
      category: "N/A",
      amount: 0,
    };

    // Monthly comparison
    const monthlyMap = new Map<string, { income: number; expenses: number }>();
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { income: 0, expenses: 0 });
      }

      const monthData = monthlyMap.get(monthKey)!;
      if (t.type === "income") {
        monthData.income += t.amount;
      } else {
        monthData.expenses += t.amount;
      }
    });

    const monthlyComparison = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Savings rate
    const savingsRate = summary.totalIncome > 0 ? (summary.totalBalance / summary.totalIncome) * 100 : 0;

    return {
      highestSpendingCategory,
      monthlyComparison,
      savingsRate,
    };
  }, [transactions, categoryBreakdown, summary]);
};

/**
 * Hook to filter and sort transactions
 */
export const useFilteredTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  return useMemo(() => {
    let filtered = [...transactions];

    // Filter by search text
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower) ||
          t.amount.toString().includes(searchLower)
      );
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === "date") {
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (filters.sortBy === "amount") {
        comparison = b.amount - a.amount;
      }

      return filters.sortOrder === "asc" ? -comparison : comparison;
    });

    return filtered;
  }, [transactions, filters]);
};

/**
 * Hook to get unique categories from transactions
 */
export const useCategories = (transactions: Transaction[], type?: "income" | "expense") => {
  return useMemo(() => {
    const filtered = type ? transactions.filter((t) => t.type === type) : transactions;
    const categories = new Set(filtered.map((t) => t.category));
    return Array.from(categories).sort();
  }, [transactions, type]);
};
