"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import TransactionTable from "@/components/custom/TransactionTable/TransactionTable";
import TransactionFormModal from "@/components/custom/TransactionFormModal/TransactionFormModal";
import RoleSwitcher from "@/components/custom/RoleSwitcher/RoleSwitcher";
import DarkModeToggle from "@/components/custom/darkMode/DarkModeToggle";
import { Transaction } from "@/types/finance";
import { Download, FileJson } from "lucide-react";
import { exportToCSV, exportToJSON } from "@/utils/helpers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Transactions Component
 * Dedicated page for viewing and managing transactions
 * Features:
 * - Full transaction table with search, filter, sort
 * - Add, edit, delete transactions (Admin only)
 * - Export to CSV/JSON
 * - Role-based access
 * - Dark mode support
 */
const Transactions: React.FC = () => {
  const { transactions, role } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  // Handle open modal for adding new transaction
  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  // Handle open modal for editing transaction
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    exportToCSV(
      transactions,
      `transactions-export-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  // Handle export to JSON
  const handleExportJSON = () => {
    exportToJSON(
      transactions,
      `transactions-export-${new Date().toISOString().split("T")[0]}.json`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Back button and title */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  📊 Transactions
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage all your financial transactions
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <RoleSwitcher />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info section */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Total Transactions:</strong> {transactions.length}
          </p>
        </div>

        {/* Export buttons */}
        {transactions.length > 0 && (
          <div className="mb-6 flex gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Export all transactions to CSV"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Export all transactions to JSON"
            >
              <FileJson className="w-4 h-4" />
              Export to JSON
            </button>
          </div>
        )}

        {/* Transactions Table */}
        <TransactionTable
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
          onEditTransaction={handleEditTransaction}
        />

        {/* Empty state */}
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No transactions yet. Start adding some data to get started!
            </p>
            {role === "admin" && (
              <button
                onClick={handleAddTransaction}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add First Transaction
              </button>
            )}
          </div>
        )}
      </main>

      {/* Transaction Form Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        transaction={editingTransaction}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            📊 Transactions Manager • Built with React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Transactions;