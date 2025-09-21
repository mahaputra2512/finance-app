"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, Edit, AlertTriangle, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface BudgetCardProps {
  budget: {
    id: string
    name: string
    amount: number
    period: string
    start_date: string
    end_date: string
    categories?: {
      name: string
      color: string
    } | null
  }
  spent: number
}

export function BudgetCard({ budget, spent }: BudgetCardProps) {
  const router = useRouter()
  const percentage = (spent / budget.amount) * 100
  const remaining = budget.amount - spent
  const isOverBudget = spent > budget.amount

  const handleDelete = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("budgets").delete().eq("id", budget.id)

    if (!error) {
      router.refresh()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPeriod = (period: string) => {
    switch (period) {
      case "weekly":
        return "Mingguan"
      case "monthly":
        return "Bulanan"
      case "yearly":
        return "Tahunan"
      default:
        return period
    }
  }

  const getStatusColor = () => {
    if (isOverBudget) return "text-red-600"
    if (percentage > 80) return "text-yellow-600"
    return "text-green-600"
  }

  const getStatusIcon = () => {
    if (isOverBudget) return AlertTriangle
    if (percentage > 80) return AlertTriangle
    return CheckCircle
  }

  const StatusIcon = getStatusIcon()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{budget.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Badge variant="outline">{formatPeriod(budget.period)}</Badge>
            {budget.categories && (
              <Badge variant="secondary" style={{ backgroundColor: budget.categories.color + "20" }}>
                {budget.categories.name}
              </Badge>
            )}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Terpakai</span>
            <span className={getStatusColor()}>{formatCurrency(spent)}</span>
          </div>
          <Progress value={Math.min(percentage, 100)} className="h-2" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{percentage.toFixed(1)}% dari budget</span>
            <span>Sisa: {formatCurrency(Math.max(remaining, 0))}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <StatusIcon className={`h-4 w-4 ${getStatusColor()}`} />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {isOverBudget
              ? `Melebihi budget ${formatCurrency(Math.abs(remaining))}`
              : percentage > 80
                ? "Mendekati batas budget"
                : "Budget terkendali"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
