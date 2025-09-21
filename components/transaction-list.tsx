"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Transaction {
  id: string
  amount: number
  description: string
  type: "income" | "expense"
  transaction_date: string
  created_at: string
  categories: {
    name: string
    color: string
  } | null
}

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("transactions")
      .select(
        `
        *,
        categories (
          name,
          color
        )
      `,
      )
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false })

    if (data) {
      setTransactions(data)
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("transactions").delete().eq("id", id)

    if (!error) {
      setTransactions(transactions.filter((t) => t.id !== id))
      router.refresh()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Memuat transaksi...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
          <CardDescription>Belum ada transaksi. Mulai tambahkan transaksi pertama Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Tidak ada transaksi</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Terbaru</CardTitle>
        <CardDescription>Daftar transaksi terbaru Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2">
                    {transaction.categories && (
                      <Badge variant="secondary" style={{ backgroundColor: transaction.categories.color + "20" }}>
                        {transaction.categories.name}
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">{formatDate(transaction.transaction_date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(transaction.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
