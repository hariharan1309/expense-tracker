# Expense Tracker

A full-stack MERN application for tracking personal expenses .

## Running the Application

1. Clone the repository: `git clone https://github.com/hariharan1309/expense-tracker.git`
2. Navigate to the cloned repository: `cd expense-tracker`
3. Install dependencies for the backend: `cd backend` and `pnpm install`
4. Install dependencies for the frontend: `cd frontend` and `pnpm install`
5. Start the backend server: `cd backend` and `pnpm run dev`
6. Start the frontend server: `cd frontend` and `pnpm run dev`
7. Open the application in your web browser: `http://localhost:5173`

## Overview

**Frontend (Client-side)**

The frontend is built using React, with the following components:

1. `Dashboard`: The main dashboard component that displays the list of expenses, charts, and allows users to add, edit, and delete expenses.
2. `ExpenseList`: A component that displays the list of expenses.
3. `ExpenseForm`: A component that handles the addition and editing of expenses.
4. `ExpenseChart`: A component that displays charts for expenses.

The frontend uses the following libraries and tools:

* `react-router-dom` for client-side routing
* `axios` for making API requests to the backend
* `recharts` for creating charts
* `shancn` for UI

Uses `useContext` for maintaining user auth status accross the app.

**Backend (Server-side)**

The backend is built using Node.js, Express.js, and MongoDB. The following controllers handle API requests:

1. `expenseControllers`: Handles CRUD (Create, Read, Update, Delete) operations for expenses.
	* `createExpense`: Creates a new expense.
	* `getExpenses`: Retrieves a list of expenses.
	* `getExpense`: Retrieves a single expense by ID.
	* `updateExpense`: Updates an existing expense.
	* `deleteExpense`: Deletes an expense.
   	* `getExpenseStats`: Expense Stats for charts.

2. `authControllers`: Handles authentication-related operations
	* `regHandler`: Creates a new uyser.
	* `loginHandler`: Authorizing the user by provided creds.

3. `authHandler` and `errorHandler` middlewares to handle auth and error better.