import './globals.css';
import { Inter } from 'next/font/google';
import DashboardLayout from '@/components/layout/DashboardLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GoClint - منصة اكتشاف المواهب الرياضية',
  description: 'منصة متكاملة تربط بين اللاعبين والأندية والمدربين',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}