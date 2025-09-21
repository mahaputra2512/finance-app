import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Suspense } from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <Suspense fallback={<div className="w-64 bg-sidebar border-r border-sidebar-border" />}>
        <DashboardSidebar />
      </Suspense>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
