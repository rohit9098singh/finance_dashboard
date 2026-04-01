import { Transaction, BalanceTrendData } from "@/types/finance";

// Mock transactions data
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    date: "2024-03-28",
    amount: 5000,
    category: "Salary",
    type: "income",
    description: "Monthly Salary",
  },
  {
    id: "2",
    date: "2024-03-27",
    amount: 1200,
    category: "Groceries",
    type: "expense",
    description: "Weekly grocery shopping",
  },
  {
    id: "3",
    date: "2024-03-26",
    amount: 800,
    category: "Entertainment",
    type: "expense",
    description: "Movie tickets and dinner",
  },
  {
    id: "4",
    date: "2024-03-25",
    amount: 2000,
    category: "Freelance",
    type: "income",
    description: "Project payment",
  },
  {
    id: "5",
    date: "2024-03-24",
    amount: 450,
    category: "Utilities",
    type: "expense",
    description: "Electricity and water bills",
  },
  {
    id: "6",
    date: "2024-03-23",
    amount: 1500,
    category: "Rent",
    type: "expense",
    description: "Monthly rent payment",
  },
  {
    id: "7",
    date: "2024-03-22",
    amount: 300,
    category: "Transport",
    type: "expense",
    description: "Fuel and parking",
  },
  {
    id: "8",
    date: "2024-03-21",
    amount: 600,
    category: "Healthcare",
    type: "expense",
    description: "Doctor visit and prescription",
  },
  {
    id: "9",
    date: "2024-03-20",
    amount: 150,
    category: "Subscriptions",
    type: "expense",
    description: "Netflix and Spotify",
  },
  {
    id: "10",
    date: "2024-03-19",
    amount: 3000,
    category: "Bonus",
    type: "income",
    description: "Performance bonus",
  },
  {
    id: "11",
    date: "2024-03-18",
    amount: 250,
    category: "Dining",
    type: "expense",
    description: "Restaurant dinner",
  },
  {
    id: "12",
    date: "2024-03-17",
    amount: 100,
    category: "Books",
    type: "expense",
    description: "Educational books",
  },
];

// Mock balance trend data for chart
export const MOCK_BALANCE_TREND: BalanceTrendData[] = [
  { date: "Mar 1", balance: 15000 },
  { date: "Mar 5", balance: 16200 },
  { date: "Mar 10", balance: 14800 },
  { date: "Mar 15", balance: 18500 },
  { date: "Mar 20", balance: 17200 },
  { date: "Mar 25", balance: 19800 },
  { date: "Mar 28", balance: 23000 },
];

// Spending categories for the breakdown
export const SPENDING_CATEGORIES = [
  "Groceries",
  "Entertainment",
  "Utilities",
  "Rent",
  "Transport",
  "Healthcare",
  "Subscriptions",
  "Dining",
  "Books",
];

export const INCOME_CATEGORIES = ["Salary", "Freelance", "Bonus", "Interest", "Other"];
