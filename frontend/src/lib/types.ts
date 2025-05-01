export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  userId: string;
  createdAt: string;
}

export interface ExpenseStats {
  total: number;
  byCategory: Array<{
    _id: string;
    total: number;
  }>;
  byMonth: Array<{
    _id: {
      year: number;
      month: number;
    };
    total: number;
  }>;
}
