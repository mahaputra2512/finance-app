"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface ExpenseChartProps {
  data: Array<{
    category: string
    amount: number
    color: string
  }>
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0)

  const chartConfig = data.reduce(
    (config, item, index) => ({
      ...config,
      [item.category]: {
        label: item.category,
        color: item.color,
      },
    }),
    {},
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengeluaran per Kategori</CardTitle>
        <CardDescription>Distribusi pengeluaran Anda berdasarkan kategori</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Belum ada data pengeluaran</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        const percentage = ((data.amount / total) * 100).toFixed(1)
                        return (
                          <ChartTooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">{data.category}</p>
                              <p className="text-sm">
                                Rp {data.amount.toLocaleString("id-ID")} ({percentage}%)
                              </p>
                            </div>
                          </ChartTooltipContent>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="space-y-2">
              {data.map((item) => {
                const percentage = ((item.amount / total) * 100).toFixed(1)
                return (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.category}</span>
                    </div>
                    <div className="text-sm font-medium">
                      Rp {item.amount.toLocaleString("id-ID")} ({percentage}%)
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
