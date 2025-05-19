import './globals.css';
import { FirebaseAuthProvider } from "@/lib/firebase/auth-provider";

export const metadata = {
  title: 'HagzZGo - منصة اكتشاف المواهب الرياضية',
  description: 'منصة متكاملة تربط بين اللاعبين والأندية والمدربين',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  )
}