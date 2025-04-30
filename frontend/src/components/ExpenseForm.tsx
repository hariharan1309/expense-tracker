// components/ExpenseDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { Expense } from "../lib/types";

interface ExpenseDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveExpense: (expense: {
    id?: string;
    title: string;
    amount: number;
    category: string;
    date: string;
  }) => Promise<boolean>;
  expenseToEdit: Expense | null;
}

const ExpenseDrawer = ({
  open,
  onOpenChange,
  onSaveExpense,
  expenseToEdit,
}: ExpenseDrawerProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update form when expenseToEdit changes
  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setDate(new Date(expenseToEdit.date).toISOString().split("T")[0]);
    } else {
      // Reset form for new expense
      setTitle("");
      setAmount("");
      setCategory("food");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [expenseToEdit]);

  const handleSubmit = async () => {
    if (!title || !amount || !category || !date) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const expenseData = {
        ...(expenseToEdit && { id: expenseToEdit._id }),
        title,
        amount: Number.parseFloat(amount),
        category,
        date: new Date(date).toISOString(),
      };

      const success = await onSaveExpense(expenseData);

      if (success) {
        toast(expenseToEdit ? "Expense updated" : "Expense added", {
          description: `Your expense has been ${
            expenseToEdit ? "updated" : "added"
          } successfully.`,
          descriptionClassName: "text-primary",
        });
        onOpenChange(false);
      }
    } catch (err: any) {
      setError(
        err.message || `Failed to ${expenseToEdit ? "update" : "add"} expense`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto p-4">
        <div className="">
          <DrawerHeader>
            <DrawerTitle>
              {expenseToEdit ? "Edit Expense" : "Add New Expense"}
            </DrawerTitle>
            <DrawerDescription>
              {expenseToEdit
                ? "Update your expense details"
                : "Record your latest expense"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4 max-w-sm mx-auto">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Grocery shopping"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="category"
                  className="!bg-white !ring-1 w-full"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <DrawerFooter className="">
            <div className="flex items-center justify-evenly">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading
                  ? expenseToEdit
                    ? "Updating..."
                    : "Adding..."
                  : expenseToEdit
                  ? "Update Expense"
                  : "Add Expense"}
              </Button>
              <DrawerClose asChild>
                <Button>Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ExpenseDrawer;
