"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface FinancialInsightsProps {
  totalIncome: number
  totalExpense: number
  topExpenseCategory: {
    name: string
    amount: number
    percentage: number
  } | null
  savingsRate: number
}

export function FinancialInsights({
  totalIncome,
  totalExpense,
  topExpenseCategory,
  savingsRate,
}: FinancialInsightsProps) {
  const balance = totalIncome - totalExpense
  const isPositive = balance > 0

  const getInsights = () => {
    const insights = []

    // Balance insight
    if (isPositive) {
      insights.push({
        type: "positive",
        icon: CheckCircle,
        title: "Keuangan Sehat",
        description: `Anda memiliki surplus sebesar Rp ${balance.toLocaleString("id-ID")} bulan ini.`,
      })
    } else {
      insights.push({
        type: "negative",
        icon: AlertTriangle,
        title: "Perhatian Diperlukan",
        description: `Pengeluaran melebihi pemasukan sebesar Rp ${Math.abs(balance).toLocaleString("id-ID")}.`,
      })
    }

    // Savings rate insight
    if (savingsRate >= 20) {
      insights.push({
        type: "positive",
        icon: TrendingUp,
        title: "Tingkat Tabungan Baik",
        description: `Tingkat tabungan Anda ${savingsRate.toFixed(1)}% sangat baik. Pertahankan!`,
      })
    } else if (savingsRate >= 10) {
      insights.push({
        type: "warning",
        icon: TrendingUp,
        title: "Tingkat Tabungan Cukup",
        description: `Tingkat tabungan Anda ${savingsRate.toFixed(1)}%. Coba tingkatkan ke 20%.`,
      })
    } else {
      insights.push({
        type: "negative",
        icon: TrendingDown,
        title: "Tingkat Tabungan Rendah",
        description: `Tingkat tabungan hanya ${savingsRate.toFixed(1)}%. Kurangi pengeluaran tidak penting.`,
      })
    }

    // Top expense category insight
    if (topExpenseCategory) {
      insights.push({
        type: "info",
        icon: AlertTriangle,
        title: "Kategori Pengeluaran Terbesar",
        description: `${topExpenseCategory.name} menyumbang ${topExpenseCategory.percentage.toFixed(1)}% dari total pengeluaran.`,
      })
    }

    return insights
  }

  const insights = getInsights()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wawasan Keuangan</CardTitle>
        <CardDescription>Analisis dan rekomendasi berdasarkan pola keuangan Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    insight.type === "positive"
                      ? "bg-green-100 text-green-600"
                      : insight.type === "negative"
                        ? "bg-red-100 text-red-600"
                        : insight.type === "warning"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge
                      variant={
                        insight.type === "positive"
                          ? "default"
                          : insight.type === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {insight.type === "positive"
                        ? "Baik"
                        : insight.type === "negative"
                          ? "Perlu Perhatian"
                          : insight.type === "warning"
                            ? "Peringatan"
                            : "Info"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
