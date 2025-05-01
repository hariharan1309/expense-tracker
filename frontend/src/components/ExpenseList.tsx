// Updated ExpenseList.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { Expense } from "../lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => Promise<void>;
  onEditExpense: (expense: Expense) => void;
}

const ExpenseList = ({
  expenses,
  onDeleteExpense,
  onEditExpense,
}: ExpenseListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  // Filter expenses based on search term and category
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle delete expense
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        setLoading((prev) => ({ ...prev, [id]: true }));
        setError("");
        await onDeleteExpense(id);

        toast("Expense deleted", {
          description: "Your expense has been deleted successfully.",
          descriptionClassName: "text-primary",
        });
      } catch (err: any) {
        setError(err.message || "Failed to delete expense");
      } finally {
        setLoading((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  // Get category badge variant
  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, string> = {
      food: "green",
      transportation: "blue",
      entertainment: "purple",
      utilities: "yellow",
      housing: "red",
      healthcare: "indigo",
      education: "pink",
      other: "gray",
    };
    return variants[category] || "default";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row mt-2">
        <div className="flex-1">
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category" className="!bg-white !ring-1">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {filteredExpenses.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No expenses found. Add some expenses to get started!
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {filteredExpenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell className="font-medium pl-4">
                    {expense.title}
                  </TableCell>
                  <TableCell>
                    {expense?.description || "No Description"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getCategoryBadgeVariant(expense.category) as any}
                      className="capitalize"
                    >
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditExpense(expense)}
                        className="!bg-background"
                      >
                        <Pencil className="h-4 w-4 text-primary" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(expense._id)}
                        disabled={loading[expense._id]}
                        className="!bg-background"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
