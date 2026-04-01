import React from "react";
import { useFinancialInsights } from "@/hooks/useDashboard";
import { Transaction } from "@/types/finance";
import { formatCurrency } from "@/utils/helpers";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Target,
  BarChart3,
} from "lucide-react";

interface InsightsProps {
  transactions: Transaction[];
}

/**
 * Insights Component
 * Displays financial insights including spending patterns and savings rate
 */
const Insights: React.FC<InsightsProps> = ({ transactions }) => {
  const insights = useFinancialInsights(transactions);

  // Determine insight status based on savings rate
  const getSavingsStatus = (rate: number) => {
    if (rate >= 30) return { label: "Excellent", color: "text-green-600 dark:text-green-400" };
    if (rate >= 20) return { label: "Good", color: "text-blue-600 dark:text-blue-400" };
    if (rate >= 10) return { label: "Fair", color: "text-yellow-600 dark:text-yellow-400" };
    return { label: "Poor", color: "text-red-600 dark:text-red-400" };
  };

  const savingsStatus = getSavingsStatus(insights.savingsRate);

  // Get month-over-month comparison
  const monthlyComparison = insights.monthlyComparison;
  const latestMonth = monthlyComparison[monthlyComparison.length - 1];
  const previousMonth = monthlyComparison[monthlyComparison.length - 2];

  const incomeChange = previousMonth
    ? ((latestMonth.income - previousMonth.income) / previousMonth.income) * 100
    : 0;
  const expenseChange = previousMonth
    ? ((latestMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
    : 0;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Card 1: Highest Spending Category */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Highest Spending
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.highestSpendingCategory.category}
            </p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
          {formatCurrency(insights.highestSpendingCategory.amount)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          This is where you spend the most
        </p>
      </div>

      {/* Card 2: Savings Rate */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Savings Rate
            </p>
            <p className={`text-2xl font-bold ${savingsStatus.color}`}>
              {insights.savingsRate.toFixed(1)}%
            </p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className={`text-sm font-medium ${savingsStatus.color}`}>
          {savingsStatus.label} savings
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Percentage of income saved
        </p>
      </div>

      {/* Card 3: Latest Month Summary */}
      {latestMonth && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {latestMonth.month}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(latestMonth.income - latestMonth.expenses)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-green-600 dark:text-green-400">
              +{formatCurrency(latestMonth.income)}
            </span>
            <span className="text-red-600 dark:text-red-400">
              -{formatCurrency(latestMonth.expenses)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Net income for the month
          </p>
        </div>
      )}

      {/* Card 4: Monthly Trends - Income */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Income Trend
            </p>
            {previousMonth && (
              <p
                className={`text-2xl font-bold ${
                  incomeChange >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {incomeChange >= 0 ? "+" : ""}
                {incomeChange.toFixed(1)}%
              </p>
            )}
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            {incomeChange >= 0 ? (
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>
        {previousMonth && (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(latestMonth.income)} this month
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              vs {formatCurrency(previousMonth.income)} last month
            </p>
          </>
        )}
      </div>

      {/* Card 5: Monthly Trends - Expenses */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Expense Trend
            </p>
            {previousMonth && (
              <p
                className={`text-2xl font-bold ${
                  expenseChange <= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {expenseChange >= 0 ? "+" : ""}
                {expenseChange.toFixed(1)}%
              </p>
            )}
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            {expenseChange <= 0 ? (
              <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>
        {previousMonth && (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(latestMonth.expenses)} this month
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              vs {formatCurrency(previousMonth.expenses)} last month
            </p>
          </>
        )}
      </div>

      {/* Card 6: Top Insight */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Quick Insight
          </h3>
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <AlertCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <p className="text-sm text-gray-900 dark:text-white">
          {insights.savingsRate >= 30
            ? "Great job! You're saving a healthy portion of your income. Keep it up!"
            : insights.savingsRate >= 20
              ? "You're doing well. Try to increase your savings by reducing discretionary spending."
              : insights.savingsRate >= 10
                ? "Consider creating a budget to improve your savings rate."
                : "Your savings rate is low. Focus on reducing expenses or increasing income."}
        </p>
      </div>
    </div>
  );
};

export default Insights;
