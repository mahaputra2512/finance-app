"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  type: "income" | "expense"
}

export function AddBudgetDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [period, setPeriod] = useState<"monthly" | "weekly" | "yearly">("monthly")
  const [categoryId, setCategoryId] = useState("all") // Updated default value to "all"
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("categories").select("*").eq("type", "expense").order("name")
    if (data) {
      setCategories(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // Calculate start and end dates based on period
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (period) {
      case "weekly":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
        break
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
      default: // monthly
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }

    const { error } = await supabase.from("budgets").insert({
      name,
      amount: Number.parseFloat(amount),
      period,
      category_id: categoryId === "all" ? null : categoryId, // Updated condition to handle "all" value
      user_id: user.id,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    })

    if (!error) {
      setOpen(false)
      setName("")
      setAmount("")
      setPeriod("monthly")
      setCategoryId("all") // Reset category to "all"
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Budget Baru</DialogTitle>
          <DialogDescription>Buat budget untuk mengontrol pengeluaran Anda.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Budget</Label>
              <Input
                id="name"
                placeholder="Contoh: Budget Makanan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Jumlah Budget (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="period">Periode</Label>
              <Select value={period} onValueChange={(value) => setPeriod(value as "monthly" | "weekly" | "yearly")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Kategori (Opsional)</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
