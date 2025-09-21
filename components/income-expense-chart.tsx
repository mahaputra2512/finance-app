"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface IncomeExpenseChartProps {
  data: Array<{
    month: string
    income: number
    expense: number
  }>
}

const chartConfig = {
  income: {
    label: "Pemasukan",
    color: "#10b981",
  },
  expense: {
    label: "Pengeluaran",
    color: "#ef4444",
  },
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Pemasukan vs Pengeluaran</CardTitle>
        <CardDescription>Perbandingan pemasukan dan pengeluaran bulanan</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Belum ada data transaksi</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: Rp {Number(entry.value).toLocaleString("id-ID")}
                              </p>
                            ))}
                          </div>
                        </ChartTooltipContent>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="income" fill={chartConfig.income.color} name="Pemasukan" />
                <Bar dataKey="expense" fill={chartConfig.expense.color} name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
