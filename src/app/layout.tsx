import './globals.css';
import { Inter } from 'next/font/google';
import { FirebaseAuthProvider } from "@/lib/firebase/auth-provider";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

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
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} font-sans bg-background text-foreground`}>
        <FirebaseAuthProvider>
          {children}
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}