import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { TransactionList } from "@/components/transaction-list"

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Check if user has categories, if not create default ones
  const { data: categories } = await supabase.from("categories").select("id").eq("user_id", data.user.id).limit(1)

  if (!categories || categories.length === 0) {
    // Create default categories using the SQL function
    await supabase.rpc("create_default_categories", { user_id: data.user.id })
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Transaksi"
        user={{
          full_name: profile?.full_name || "User",
          email: data.user.email,
        }}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Kelola Transaksi</h2>
              <p className="text-muted-foreground">Tambah, edit, dan pantau semua transaksi keuangan Anda.</p>
            </div>
            <AddTransactionDialog />
          </div>

          <TransactionList />
        </div>
      </div>
    </div>
  )
}
