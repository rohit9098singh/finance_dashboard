import React from "react";
import { formatCurrency } from "@/utils/helpers";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";

interface SummaryCardProps {
  title: string;
  amount: number;
  type?: "balance" | "income" | "expense";
  trend?: number;
}

/**
 * SummaryCard Component
 * Displays a summary metric with icon, title, and amount
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type = "balance", trend }) => {
  // Get icon and color based on type
  const getIconAndColor = () => {
    switch (type) {
      case "income":
        return {
          icon: <ArrowUp className="w-6 h-6" />,
          bgColor: "bg-green-50 dark:bg-green-950",
          textColor: "text-green-600 dark:text-green-400",
          borderColor: "border-green-200 dark:border-green-800",
        };
      case "expense":
        return {
          icon: <ArrowDown className="w-6 h-6" />,
          bgColor: "bg-red-50 dark:bg-red-950",
          textColor: "text-red-600 dark:text-red-400",
          borderColor: "border-red-200 dark:border-red-800",
        };
      default:
        return {
          icon: <Wallet className="w-6 h-6" />,
          bgColor: "bg-blue-50 dark:bg-blue-950",
          textColor: "text-blue-600 dark:text-blue-400",
          borderColor: "border-blue-200 dark:border-blue-800",
        };
    }
  };

  const { icon, bgColor, textColor, borderColor } = getIconAndColor();

  return (
    <div
      className={`rounded-lg border-2 p-6 ${borderColor} ${bgColor} transition-all duration-300 hover:shadow-lg dark:hover:shadow-lg`}
    >
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
        <div className={`p-2 rounded-full ${bgColor} ${textColor}`}>{icon}</div>
      </div>

      {/* Amount */}
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(amount)}</p>

        {/* Trend indicator */}
        {trend !== undefined && (
          <span
            className={`text-sm font-medium ${
              trend >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {trend >= 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
