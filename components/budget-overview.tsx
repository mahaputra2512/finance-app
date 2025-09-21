"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BudgetOverviewProps {
  totalBudget: number
  totalSpent: number
  budgetCount: number
}

export function BudgetOverview({ totalBudget, totalSpent, budgetCount }: BudgetOverviewProps) {
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const remaining = totalBudget - totalSpent

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringkasan Budget</CardTitle>
        <CardDescription>Overview semua budget Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Total Budget</p>
            <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Total Terpakai</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Sisa Budget</p>
            <p className={`text-2xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress Keseluruhan</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(percentage, 100)} className="h-3" />
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Anda memiliki {budgetCount} budget aktif
            {remaining < 0 && (
              <span className="block text-red-600 font-medium mt-1">
                Peringatan: Melebihi total budget sebesar {formatCurrency(Math.abs(remaining))}
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
