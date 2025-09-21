import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { AddBudgetDialog } from "@/components/add-budget-dialog"
import { BudgetCard } from "@/components/budget-card"
import { BudgetOverview } from "@/components/budget-overview"

export default async function BudgetPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get all budgets
  const { data: budgets } = await supabase
    .from("budgets")
    .select(
      `
      *,
      categories (
        name,
        color
      )
    `,
    )
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  // Calculate spending for each budget
  const budgetsWithSpending = await Promise.all(
    (budgets || []).map(async (budget) => {
      let query = supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", data.user.id)
        .eq("type", "expense")
        .gte("transaction_date", budget.start_date)
        .lte("transaction_date", budget.end_date)

      // If budget has a specific category, filter by it
      if (budget.category_id) {
        query = query.eq("category_id", budget.category_id)
      }

      const { data: transactions } = await query

      const spent = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0

      return {
        budget,
        spent,
      }
    }),
  )

  // Calculate totals
  const totalBudget = budgets?.reduce((sum, b) => sum + b.amount, 0) || 0
  const totalSpent = budgetsWithSpending.reduce((sum, b) => sum + b.spent, 0)

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Budget"
        user={{
          full_name: profile?.full_name || "User",
          email: data.user.email,
        }}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Kelola Budget</h2>
              <p className="text-muted-foreground">Buat dan pantau budget untuk mengontrol pengeluaran Anda.</p>
            </div>
            <AddBudgetDialog />
          </div>

          {budgets && budgets.length > 0 && (
            <BudgetOverview totalBudget={totalBudget} totalSpent={totalSpent} budgetCount={budgets.length} />
          )}

          {budgets && budgets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {budgetsWithSpending.map(({ budget, spent }) => (
                <BudgetCard key={budget.id} budget={budget} spent={spent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Belum ada budget</h3>
              <p className="text-muted-foreground mb-4">Mulai buat budget pertama Anda untuk mengontrol pengeluaran.</p>
              <AddBudgetDialog />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
