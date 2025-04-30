export interface User {
    _id: string
    name: string
    email: string
  }
  
  export interface Expense {
    _id: string
    title: string
    amount: number
    category: string
    date: string
    userId: string
    createdAt: string
  }