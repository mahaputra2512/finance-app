"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Menu } from "lucide-react"
import { useState } from "react"

interface DashboardHeaderProps {
  title: string
  user?: {
    full_name?: string
    email?: string
  }
}

export function DashboardHeader({ title, user }: DashboardHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user?.full_name)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
