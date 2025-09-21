import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Pengaturan"
        user={{
          full_name: profile?.full_name || "User",
          email: data.user.email,
        }}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6 max-w-2xl">
          <div>
            <h2 className="text-2xl font-bold">Pengaturan Akun</h2>
            <p className="text-muted-foreground">Kelola informasi akun dan preferensi Anda.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>Update informasi dasar profil Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input id="fullName" defaultValue={profile?.full_name || ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={data.user.email || ""} disabled />
                <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
              </div>
              <Button>Simpan Perubahan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keamanan</CardTitle>
              <CardDescription>Kelola keamanan akun Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Ubah Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data & Privasi</CardTitle>
              <CardDescription>Kelola data dan pengaturan privasi Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Export Data</Button>
              <Button variant="destructive">Hapus Akun</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
