"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../lib/AuthContext";
import api from "../lib/api";
import type { Expense, ExpenseStats } from "../lib/types";
import Header from "../components/Header";
import ExpenseDrawer from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import ExpenseChart from "@/components/ExpenseChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const expensesResponse = await api.get("/api/expense/expenses");
        setExpenses(expensesResponse.data.data);
        const statsResponse = await api.get("/api/expense/stats");
        setStats(statsResponse.data.data);
        console.log(statsResponse.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveExpense = async (expenseData: {
    id?: string;
    title: string;
    amount: number;
    category: string;
    date: string;
  }) => {
    try {
      let response: any;

      // If we have an ID, it's an update operation
      if (expenseData.id) {
        const { id, ...updateData } = expenseData;
        response = await api.put(`/api/expense/${id}`, updateData);

        // Update the expenses list
        setExpenses(
          expenses.map((exp) => (exp._id === id ? response.data.data : exp))
        );
      } else {
        // Otherwise it's a new expense
        response = await api.post("/api/expense", expenseData);
        setExpenses([response.data.data, ...expenses]);
      }

      // Refresh stats
      const statsResponse = await api.get("/api/expense/stats");
      setStats(statsResponse.data.data);

      return true;
    } catch (err: any) {
      console.error("Error saving expense:", err);
      throw new Error(err.response?.data?.message || "Failed to save expense");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await api.delete(`/api/expense/${id}`);

      setExpenses(expenses.filter((expense) => expense._id !== id));

      const statsResponse = await api.get("/api/expense/stats");
      setStats(statsResponse.data.data);
    } catch (err: any) {
      console.error("Error deleting expense:", err);
      throw new Error(
        err.response?.data?.message || "Failed to delete expense"
      );
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setDrawerOpen(true);
  };

  const handleAddExpense = () => {
    setExpenseToEdit(null);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setExpenseToEdit(null);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto flex flex-1 items-center justify-center p-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Loading your expenses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen min-w-full grid-cols-1 bg-background">
      <Header />
      <main className="container flex-1 p-4 md:p-6 space-y-4 lg:space-y-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold tracking-tight">
              Welcome, {user?.name}
            </p>
            {stats && (
              <div>
                <p className="text-sm font-medium">Total Expenses</p>
                <Badge className="scale-105">
                  {formatCurrency(stats.total)}
                </Badge>
              </div>
            )}
          </div>
          <Button
            onClick={handleAddExpense}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        <ExpenseChart
          expenses={expenses}
          categoryData={stats?.byCategory || []}
          monthlyData={stats?.byMonth || []}
        />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Expenses</CardTitle>
            <CardDescription>Manage and track your spending</CardDescription>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEditExpense}
            />
          </CardContent>
        </Card>

        <ExpenseDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSaveExpense={handleSaveExpense}
          expenseToEdit={expenseToEdit}
        />
      </main>
    </div>
  );
};

export default Dashboard;
