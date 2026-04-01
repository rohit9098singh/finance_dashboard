import React from "react";
import { formatCurrency } from "@/utils/helpers";
import { BalanceTrendData, CategoryBreakdown } from "@/types/finance";

interface BalanceTrendChartProps {
  data: BalanceTrendData[];
  title?: string;
  height?: number;
}

/**
 * Simple Line Chart Component for balance trend
 * Uses SVG to render a basic line chart
 */
export const BalanceTrendChart: React.FC<BalanceTrendChartProps> = ({
  data,
  title = "Balance Trend",
  height = 300,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  // Calculate chart dimensions
  const padding = 40;
  const width = 600;
  const innerWidth = width - 2 * padding;
  const innerHeight = height - 2 * padding;

  // Find min and max values
  const balances = data.map((d) => d.balance);
  const minBalance = Math.min(...balances);
  const maxBalance = Math.max(...balances);
  const balanceRange = maxBalance - minBalance || 1;

  // Calculate points for the line
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * innerWidth;
    const y = padding + ((maxBalance - d.balance) / balanceRange) * innerHeight;
    return { x, y, ...d };
  });

  // Create path string
  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={`grid-${i}`}
              x1={padding}
              y1={padding + ratio * innerHeight}
              x2={width - padding}
              y2={padding + ratio * innerHeight}
              stroke="#e5e7eb"
              strokeDasharray="4"
              className="dark:stroke-gray-600"
            />
          ))}

          {/* Y-axis */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#9ca3af"
            strokeWidth="2"
          />

          {/* X-axis */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#9ca3af"
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {[0, 0.5, 1].map((ratio, i) => {
            const value = minBalance + ratio * balanceRange;
            return (
              <text
                key={`y-label-${i}`}
                x={padding - 10}
                y={padding + (1 - ratio) * innerHeight + 5}
                fontSize="12"
                textAnchor="end"
                className="fill-gray-600 dark:fill-gray-300"
              >
                {formatCurrency(value, "USD").slice(0, -3)}
              </text>
            );
          })}

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={`x-label-${i}`}
              x={p.x}
              y={height - padding + 20}
              fontSize="12"
              textAnchor="middle"
              className="fill-gray-600 dark:fill-gray-300"
            >
              {p.date}
            </text>
          ))}

          {/* Line path */}
          <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="3" />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all"
            >
              <title>{`${p.date}: ${formatCurrency(p.balance)}`}</title>
            </circle>
          ))}
        </svg>
      </div>
    </div>
  );
};

interface CategoryBarChartProps {
  data: CategoryBreakdown[];
  title?: string;
}

/**
 * Horizontal Bar Chart Component for category breakdown
 * Shows spending by category with percentages
 */
export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({
  data,
  title = "Spending by Category",
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const maxAmount = Math.max(...data.map((d) => d.amount));
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-cyan-500",
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-end gap-4">
            {/* Category label */}
            <div className="w-24">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {item.category}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.percentage.toFixed(1)}%
              </p>
            </div>

            {/* Bar */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                    style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-fit">
                  ${item.amount.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PieChartProps {
  data: CategoryBreakdown[];
  title?: string;
}

/**
 * Simple Pie Chart Component for category breakdown
 * Uses canvas or SVG to render a pie chart
 */
export const PieChart: React.FC<PieChartProps> = ({ data, title = "Spending Distribution" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-500 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
    "#10b981",
    "#ef4444",
    "#6366f1",
    "#06b6d4",
  ];

  // Calculate pie segments
  const segments = data.map((item, index) => {
    const currentAngle = data.slice(0, index).reduce((sum, d) => sum + (d.amount / total) * 2 * Math.PI, -Math.PI / 2);
    const sliceAngle = (item.amount / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    // Calculate path points
    const radius = 100;
    const centerX = 120;
    const centerY = 120;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    return { pathData, color: colors[index % colors.length], ...item };
  });

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Pie Chart */}
        <svg width="240" height="240" viewBox="0 0 240 240" className="shrink-0">
          {segments.map((segment, index) => (
            <g key={`segment-${index}`}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="dark:stroke-slate-800 hover:opacity-80 transition-opacity cursor-pointer"
              />
              <title>{`${segment.category}: ${segment.percentage.toFixed(1)}%`}</title>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {item.category}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white ml-auto">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
