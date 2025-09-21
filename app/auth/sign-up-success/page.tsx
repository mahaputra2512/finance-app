import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">KeuanganKu</h1>
            </div>
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Terima kasih telah mendaftar!</CardTitle>
              <CardDescription>Periksa email Anda untuk konfirmasi</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Anda telah berhasil mendaftar. Silakan periksa email Anda untuk mengkonfirmasi akun sebelum masuk.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
