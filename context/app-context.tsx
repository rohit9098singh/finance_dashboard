"use client";

import React, { createContext, useContext, useEffect, useState, useRef, startTransition } from "react";
import { Transaction, UserRole, AppContextType } from "@/types/finance";
import { MOCK_TRANSACTIONS } from "@/constant/mockData";

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [role, setRole] = useState<UserRole>("viewer");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const initializedRef = useRef(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    // Skip if already initialized
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeFromStorage = () => {
      try {
        const savedTransactions = localStorage.getItem("finance_transactions");
        const savedRole = localStorage.getItem("finance_role") as UserRole;
        const savedDarkMode = localStorage.getItem("finance_darkMode");

        if (savedTransactions) {
          return {
            transactions: JSON.parse(savedTransactions),
            role: savedRole || "viewer",
            darkMode: savedDarkMode ? JSON.parse(savedDarkMode) : false,
          };
        } else {
          localStorage.setItem("finance_transactions", JSON.stringify(MOCK_TRANSACTIONS));
          return {
            transactions: MOCK_TRANSACTIONS,
            role: savedRole || "viewer",
            darkMode: false,
          };
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        return {
          transactions: MOCK_TRANSACTIONS,
          role: "viewer" as UserRole,
          darkMode: false,
        };
      }
    };

    const data = initializeFromStorage();
    startTransition(() => {
      setTransactions(data.transactions);
      setRole(data.role);
      setDarkMode(data.darkMode);
      setIsLoaded(true);
    });
  }, []);

  // Update localStorage when transactions change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("finance_transactions", JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  // Update localStorage when role changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("finance_role", role);
    }
  }, [role, isLoaded]);

  // Update localStorage when dark mode changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("finance_darkMode", JSON.stringify(darkMode));
      // Apply dark mode to document
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode, isLoaded]);

  // Add a new transaction
  const addTransaction = (newTransaction: Omit<Transaction, "id">) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  // Update an existing transaction
  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, "id">) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updatedTransaction, id } : t))
    );
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const value: AppContextType = {
    transactions,
    role,
    darkMode,
    setTransactions,
    setRole,
    setDarkMode,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
