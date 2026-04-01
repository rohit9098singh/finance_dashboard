"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import { useDashboardSummary, useCategoryBreakdown } from "@/hooks/useDashboard";
import SummaryCard from "@/components/custom/SummaryCard/SummaryCard";
import { BalanceTrendChart, CategoryBarChart, PieChart } from "@/components/custom/Charts/Charts";
import TransactionTable from "@/components/custom/TransactionTable/TransactionTable";
import Insights from "@/components/custom/Insights/Insights";

import DarkModeToggle from "@/components/custom/darkMode/DarkModeToggle";
import TransactionFormModal from "@/components/custom/TransactionFormModal/TransactionFormModal";
import { MOCK_BALANCE_TREND } from "@/constant/mockData";
import { Download, FileJson } from "lucide-react";
import { exportToCSV, exportToJSON } from "@/utils/helpers";
import { Transaction } from "@/types/finance";

/**
 * DashBoard Component
 * Main dashboard screen with all sections:
 * - Summary cards
 * - Charts (balance trend, category breakdown)
 * - Transactions table
 * - Insights
 * - Export functionality
 */
const DashBoard: React.FC = () => {
  const { transactions } = useApp();
  const summary = useDashboardSummary(transactions);
  const categoryBreakdown = useCategoryBreakdown(transactions);

  // State for transaction form modal
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
    exportToCSV(transactions, `finance-dashboard-${new Date().toISOString().split("T")[0]}.csv`);
  };

  // Handle export to JSON
  const handleExportJSON = () => {
    exportToJSON(
      transactions,
      `finance-dashboard-${new Date().toISOString().split("T")[0]}.json`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Title and subtitle */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                💰 Finance Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track your income and expenses at a glance
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Cards Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Summary Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard
              title="Total Balance"
              amount={summary.totalBalance}
              type="balance"
            />
            <SummaryCard
              title="Total Income"
              amount={summary.totalIncome}
              type="income"
            />
            <SummaryCard
              title="Total Expenses"
              amount={summary.totalExpenses}
              type="expense"
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Analytics & Trends
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Balance Trend Chart */}
            <BalanceTrendChart data={MOCK_BALANCE_TREND} />

            {/* Category Breakdown - Bar Chart */}
            {categoryBreakdown.length > 0 ? (
              <CategoryBarChart data={categoryBreakdown} />
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center h-80">
                <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
              </div>
            )}
          </div>

          {/* Pie Chart - Full Width */}
          {categoryBreakdown.length > 0 && (
            <div>
              <PieChart data={categoryBreakdown} />
            </div>
          )}
        </section>

        {/* Insights Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Financial Insights
          </h2>
          <Insights transactions={transactions} />
        </section>

        {/* Transactions Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>

            {/* Export buttons */}
            {transactions.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Export to CSV"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Export to JSON"
                >
                  <FileJson className="w-4 h-4" />
                  <span className="hidden sm:inline">JSON</span>
                </button>
              </div>
            )}
          </div>

          <TransactionTable
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
          />
        </section>

        {/* Empty State */}
        {transactions.length === 0 && (
          <section className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No transactions yet. Start adding some data to see your financial overview!
            </p>
            <button
              onClick={handleAddTransaction}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add First Transaction
            </button>
          </section>
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
            💼 Finance Dashboard • Built with React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashBoard;