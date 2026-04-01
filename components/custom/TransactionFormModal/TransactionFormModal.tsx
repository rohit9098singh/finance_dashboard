"use client";

import React, { useState, useEffect, useRef, startTransition } from "react";
import { Transaction, TransactionType } from "@/types/finance";
import { useApp } from "@/context/app-context";

import { X } from "lucide-react";
import { SPENDING_CATEGORIES, INCOME_CATEGORIES } from "@/constant/mockData";

interface TransactionFormModalProps {
  isOpen: boolean;
  transaction?: Transaction;
  onClose: () => void;
}

/**
 * TransactionFormModal Component
 * Modal for adding/editing transactions (Admin only)
 */
const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  transaction,
  onClose,
}) => {
  const { addTransaction, updateTransaction } = useApp();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    category: "",
    type: "expense" as TransactionType,
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const lastTransactionRef = useRef<Transaction | undefined>(undefined);
  const lastIsOpenRef = useRef(isOpen);

  // Initialize form with transaction data for editing
  useEffect(() => {
    // Check if props actually changed to avoid unnecessary updates
    if (
      lastTransactionRef.current === transaction &&
      lastIsOpenRef.current === isOpen
    ) {
      return;
    }

    lastTransactionRef.current = transaction;
    lastIsOpenRef.current = isOpen;

    const getInitialFormData = () => {
      if (transaction) {
        return {
          date: transaction.date,
          amount: transaction.amount,
          category: transaction.category,
          type: transaction.type,
          description: transaction.description,
        };
      }
      return {
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        category: "",
        type: "expense" as TransactionType,
        description: "",
      };
    };

    if (isOpen) {
      startTransition(() => {
        setFormData(getInitialFormData());
        setErrors({});
      });
    }
  }, [transaction, isOpen]);

  // Get categories based on transaction type
  const categoryOptions =
    formData.type === "income" ? INCOME_CATEGORIES : SPENDING_CATEGORIES;

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = "Date is required";
    if (formData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (transaction) {
      updateTransaction(transaction.id, formData);
    } else {
      addTransaction(formData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-slate-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {transaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                  errors.date
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Type
              </label>
              <div className="flex gap-3">
                {["income", "expense"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: type as TransactionType,
                        category: "", // Reset category when type changes
                      })
                    }
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                      formData.type === type
                        ? type === "income"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                  errors.category
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select a category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                  }
                  className={`w-full pl-7 pr-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                    errors.amount
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                placeholder="Enter transaction description"
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {transaction ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TransactionFormModal;
