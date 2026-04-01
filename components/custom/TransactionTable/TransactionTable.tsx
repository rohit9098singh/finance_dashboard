"use client";

import React, { useState } from "react";
import { Transaction, TransactionType } from "@/types/finance";
import { useApp } from "@/context/app-context";
import { formatCurrency, formatDate, getCategoryColor, getTypeColor } from "@/utils/helpers";
import { useFilteredTransactions, useCategories } from "@/hooks/useDashboard";
import {
  Search,
  Filter,
  X,
  Trash2,
  Edit2,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  onAddTransaction?: () => void;
  onEditTransaction?: (transaction: Transaction) => void;
}

/**
 * TransactionTable Component
 * Displays transactions with search, filter, sort, and action buttons
 */
const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onAddTransaction,
  onEditTransaction,
}) => {
  const { deleteTransaction } = useApp();
  const allCategories = useCategories(transactions);

  // Filter and sort state
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<TransactionType | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Get filtered and sorted transactions
  const filteredTransactions = useFilteredTransactions(transactions, {
    searchText,
    type: selectedType,
    category: selectedCategory,
    sortBy,
    sortOrder,
  });

  // Handle delete transaction
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchText("");
    setSelectedType(undefined);
    setSelectedCategory(undefined);
    setSortBy("date");
    setSortOrder("desc");
  };

  const hasActiveFilters =
    searchText || selectedType || selectedCategory;

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with search and filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4">
          {/* Title and action button */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Transactions
            </h2>
            {onAddTransaction && (
              <button
                onClick={onAddTransaction}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </button>
            )}
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description, category, or amount..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Type filter */}
            <div className="relative">
              <select
                value={selectedType || ""}
                onChange={(e) =>
                  setSelectedType(e.target.value ? (e.target.value as TransactionType) : undefined)
                }
                className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedType
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200"
                }`}
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category filter */}
            <div className="relative">
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || undefined)}
                className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200"
                }`}
              >
                <option value="">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort controls */}
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
                className="text-sm font-medium bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors"
                title={`Order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
              >
                {sortOrder === "asc" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Reset filters button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

          {/* Result count */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>
      </div>

      {/* Transactions table or empty state */}
      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {transactions.length === 0
                ? "No transactions yet. Create your first transaction!"
                : "No transactions match your filters."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                    index % 2 === 0
                      ? "bg-white dark:bg-slate-800"
                      : "bg-gray-50 dark:bg-slate-700"
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {transaction.type.charAt(0).toUpperCase() +
                        transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold text-right ${getTypeColor(transaction.type)}`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEditTransaction && (
                        <button
                          onClick={() => onEditTransaction(transaction)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
