"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, CreditCard, PieChart, Wallet } from "lucide-react"
import { useState } from "react"

const LandingPage = () => {
  // const { isAuthenticated } = useContext(AuthContext)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-xl font-bold text-primary">ExpenseTracker</div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Login
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Track Your Expenses with Ease
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Manage your finances, track expenses, and visualize your spending patterns all in one place.
              </p>
            </div>
            <div className="space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="h-11 px-8">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg" className="h-11 px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-24">
          <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Expense Tracking</h3>
              <p className="text-muted-foreground">
                Record and categorize your expenses to keep track of your spending habits.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Visual Analytics</h3>
              <p className="text-muted-foreground">
                Visualize your spending patterns with interactive charts and graphs.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Expense Insights</h3>
              <p className="text-muted-foreground">
                Gain insights into your spending habits and identify areas for improvement.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Budget Management</h3>
              <p className="text-muted-foreground">
                Set budgets for different categories and track your progress over time.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2024 ExpenseTracker. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
