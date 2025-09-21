import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react"
import { TransactionList } from "@/components/transaction-list"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get financial summary
  const { data: incomeData } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", data.user.id)
    .eq("type", "income")

  const { data: expenseData } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", data.user.id)
    .eq("type", "expense")

  const totalIncome = incomeData?.reduce((sum, t) => sum + t.amount, 0) || 0
  const totalExpense = expenseData?.reduce((sum, t) => sum + t.amount, 0) || 0
  const balance = totalIncome - totalExpense

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Dashboard"
        user={{
          full_name: profile?.full_name || "User",
          email: data.user.email,
        }}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-balance">Selamat datang, {profile?.full_name || "User"}!</h2>
              <p className="text-muted-foreground">Berikut adalah ringkasan keuangan Anda hari ini.</p>
            </div>
            <AddTransactionDialog />
          </div>

          {/* Financial Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {balance.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">Saldo keseluruhan Anda</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pemasukan</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">Total pemasukan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pengeluaran</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">Rp {totalExpense.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">Total pengeluaran</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trend</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalIncome > totalExpense ? "+" : ""}
                  {((balance / (totalIncome || 1)) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Rasio saldo</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <TransactionList />
        </div>
      </div>
    </div>
  )
}
