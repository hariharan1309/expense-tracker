"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Expense } from "../lib/types";

interface CategoryData {
  _id: string;
  total: number;
}

interface MonthlyData {
  _id: {
    year: number;
    month: number;
  };
  total: number;
}

interface ExpenseChartProps {
  expenses: Expense[];
  categoryData: CategoryData[];
  monthlyData: MonthlyData[];
}

const ExpenseChart = ({
  expenses,
  categoryData,
  monthlyData,
}: ExpenseChartProps) => {
  const [chartType, setChartType] = useState<"category" | "time">("category");

  // Colors for different categories
  const COLORS = [
    "#4CAF50", // food
    "#2196F3", // transportation
    "#9C27B0", // entertainment
    "#FFC107", // utilities
    "#F44336", // housing
    "#3F51B5", // healthcare
    "#E91E63", // education
    "#607D8B", // other
  ];

  // Format category data for pie chart
  const formatCategoryData = () => {
    return categoryData.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.total,
    }));
  };

  // Format monthly data for bar chart
  const formatMonthlyData = () => {
    return monthlyData.map((item) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return {
        name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        amount: item.total,
      };
    });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const pieData = formatCategoryData();
  const barData = formatMonthlyData();

  if (expenses.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No expense data available. Add some expenses to see charts.
      </div>
    );
  }

  return (
    <div className=" grid grid-cols-2 items-center w-full gap-4 gap-6">
      <Card>
        <CardContent className="p-6 space-y-2">
          <CardTitle>Category Breakdown</CardTitle>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "0",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 space-y-2">
          <CardTitle>Monthly Breakdown</CardTitle>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "0",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseChart;
