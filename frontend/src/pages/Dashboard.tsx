"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../lib/AuthContext";
import api from "../lib/api";
import type { Expense, ExpenseStats } from "../lib/types";
import Header from "../components/Header";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ExpenseChart from "@/components/ExpenseChart";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
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

  const handleAddExpense = async (
    newExpense: Omit<Expense, "_id" | "userId" | "createdAt">
  ) => {
    try {
      const response = await api.post("/api/expense", newExpense);

      setExpenses([response.data.data, ...expenses]);
      const statsResponse = await api.get("/api/expense/stats");
      setStats(statsResponse.data.data);

      return true;
    } catch (err: any) {
      console.error("Error adding expense:", err);
      throw new Error(err.response?.data?.message || "Failed to add expense");
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
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="container mx-auto flex-1 p-4 md:p-6">
        <div className="mb-8">
          <p className="text-2xl font-bold tracking-tight">
            Welcome, {user?.name}
          </p>
          {stats && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.total)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
                <CardDescription>Record your latest expense</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm onAddExpense={handleAddExpense} />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <Tabs defaultValue="list" className="w-full">
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Expenses</CardTitle>
                    <TabsList>
                      <TabsTrigger value="list" className="text-white">
                        List
                      </TabsTrigger>
                      <TabsTrigger value="chart" className="text-white">
                        Chart
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <CardDescription>
                    Manage and track your spending
                  </CardDescription>

                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <TabsContent value="list" className="mt-4">
                    <ExpenseList
                      expenses={expenses}
                      onDeleteExpense={handleDeleteExpense}
                    />
                  </TabsContent>

                  <TabsContent value="chart" className="mt-4">
                    <ExpenseChart
                      expenses={expenses}
                      categoryData={stats?.byCategory || []}
                      monthlyData={stats?.byMonth || []}
                    />
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
