import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseChart } from "@/components/expense-chart"
import { IncomeExpenseChart } from "@/components/income-expense-chart"
import { FinancialInsights } from "@/components/financial-insights"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get expense data by category
  const { data: expenseByCategory } = await supabase
    .from("transactions")
    .select(
      `
      amount,
      categories (
        name,
        color
      )
    `,
    )
    .eq("user_id", data.user.id)
    .eq("type", "expense")
    .not("categories", "is", null)

  // Process expense data for pie chart
  const expenseData =
    expenseByCategory?.reduce(
      (acc, transaction) => {
        if (transaction.categories) {
          const existing = acc.find((item) => item.category === transaction.categories!.name)
          if (existing) {
            existing.amount += transaction.amount
          } else {
            acc.push({
              category: transaction.categories.name,
              amount: transaction.amount,
              color: transaction.categories.color,
            })
          }
        }
        return acc
      },
      [] as Array<{ category: string; amount: number; color: string }>,
    ) || []

  // Get monthly income/expense data for the last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data: monthlyData } = await supabase
    .from("transactions")
    .select("amount, type, transaction_date")
    .eq("user_id", data.user.id)
    .gte("transaction_date", sixMonthsAgo.toISOString().split("T")[0])

  // Process monthly data
  const monthlyStats =
    monthlyData?.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.transaction_date)
        const monthKey = date.toLocaleDateString("id-ID", { year: "numeric", month: "short" })

        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, income: 0, expense: 0 }
        }

        if (transaction.type === "income") {
          acc[monthKey].income += transaction.amount
        } else {
          acc[monthKey].expense += transaction.amount
        }

        return acc
      },
      {} as Record<string, { month: string; income: number; expense: number }>,
    ) || {}

  const monthlyChartData = Object.values(monthlyStats).sort((a, b) => {
    const dateA = new Date(a.month + " 1")
    const dateB = new Date(b.month + " 1")
    return dateA.getTime() - dateB.getTime()
  })

  // Calculate financial metrics
  const totalIncome = monthlyData?.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0) || 0
  const totalExpense = monthlyData?.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0) || 0
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

  // Find top expense category
  const topExpenseCategory =
    expenseData.length > 0 ? expenseData.reduce((max, current) => (current.amount > max.amount ? current : max)) : null

  const topExpenseCategoryWithPercentage = topExpenseCategory
    ? {
        name: topExpenseCategory.category,
        amount: topExpenseCategory.amount,
        percentage: (topExpenseCategory.amount / totalExpense) * 100,
      }
    : null

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Analisis Keuangan"
        user={{
          full_name: profile?.full_name || "User",
          email: data.user.email,
        }}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Analisis Keuangan</h2>
            <p className="text-muted-foreground">Dapatkan wawasan mendalam tentang pola keuangan Anda.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString("id-ID")}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">Rp {totalExpense.toLocaleString("id-ID")}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Tingkat Tabungan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ExpenseChart data={expenseData} />
            <IncomeExpenseChart data={monthlyChartData} />
          </div>

          {/* Financial Insights */}
          <FinancialInsights
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            topExpenseCategory={topExpenseCategoryWithPercentage}
            savingsRate={savingsRate}
          />
        </div>
      </div>
    </div>
  )
}
