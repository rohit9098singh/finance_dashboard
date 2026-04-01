// Transaction type definitions
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

// Dashboard data types
export interface SummaryData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

// Chart data types
export interface BalanceTrendData {
  date: string;
  balance: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

// Insights types
export interface InsightsData {
  highestSpendingCategory: {
    category: string;
    amount: number;
  };
  monthlyComparison: {
    month: string;
    income: number;
    expenses: number;
  }[];
  savingsRate: number;
}

// App context types
export type UserRole = "viewer" | "admin";

export interface AppContextType {
  transactions: Transaction[];
  role: UserRole;
  darkMode: boolean;
  setTransactions: (transactions: Transaction[]) => void;
  setRole: (role: UserRole) => void;
  setDarkMode: (darkMode: boolean) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
}

// Filter types
export interface TransactionFilters {
  searchText: string;
  type?: TransactionType;
  category?: string;
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}
