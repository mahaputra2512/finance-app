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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color: string
  icon: string
}

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("categories").select("*").order("name")
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

    const { error } = await supabase.from("transactions").insert({
      amount: Number.parseFloat(amount),
      description,
      type,
      category_id: categoryId || null,
      user_id: user.id,
      transaction_date: date,
    })

    if (!error) {
      setOpen(false)
      setAmount("")
      setDescription("")
      setCategoryId("")
      setDate(new Date().toISOString().split("T")[0])
      router.refresh()
    }

    setIsLoading(false)
  }

  const filteredCategories = categories.filter((cat) => cat.type === type)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Baru</DialogTitle>
          <DialogDescription>Masukkan detail transaksi Anda di bawah ini.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Jenis Transaksi</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as "income" | "expense")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="text-green-600">
                    Pemasukan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="text-red-600">
                    Pengeluaran
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Jumlah (Rp)</Label>
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
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi transaksi..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Transaksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
