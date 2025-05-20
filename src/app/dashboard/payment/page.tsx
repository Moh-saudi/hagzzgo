'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Upload, CreditCard, Star, Trophy, Crown, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from 'lucide-react';


// أنواع البيانات
interface PackageType {
  title: string;
  price: number;
  originalPrice: number;
  period: string;
  discount: string;
  features: string[];
}

interface PaymentInfo {
  transactionNumber: string;
  packageType: string;
  amount: number;
  receiptUrl?: string;
  status: 'pending' | 'completed' | 'failed';
}

// تكوين الباقات
const PACKAGES: Record<string, PackageType> = {
  '3months': {
    title: 'باقة النجم الصاعد ⭐',
    price: 60,
    originalPrice: 80,
    period: '3 شهور',
    discount: '25%',
    features: [
      'إنشاء ملف شخصي احترافي كامل',
      'إضافة صور وفيديوهات غير محدودة',
      // ...existing features
    ]
  },
  // ...other packages
};

export default function PaymentPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const supabase = createClientComponentClient();
  const [selectedPackage, setSelectedPackage] = useState<string>('3months');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [transactionNumber, setTransactionNumber] = useState<string>('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // معالجة رفع الإيصال
  const handleReceiptUpload = async (file: File): Promise<string> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}-${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('payment-receipts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading receipt:', error);
      throw new Error('فشل في رفع الإيصال');
    }
  };

  // معالجة تقديم الدفع
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !receipt || !transactionNumber) {
      setError('يرجى إكمال جميع البيانات المطلوبة');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // رفع الإيصال
      const receiptUrl = await handleReceiptUpload(receipt);

      // حفظ معلومات الدفع
      const paymentInfo: PaymentInfo = {
        transactionNumber,
        packageType: selectedPackage,
        amount: PACKAGES[selectedPackage].price,
        receiptUrl,
        status: 'pending'
      };

      // حفظ في Firestore
      await setDoc(doc(db, 'payments', `${user.uid}-${Date.now()}`), {
        ...paymentInfo,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);

    } catch (error) {
      console.error('Error submitting payment:', error);
      setError('حدث خطأ أثناء معالجة الدفع');
    } finally {
      setSubmitting(false);
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* رسالة الخطأ */}
      {error && (
        <div className="mb-4 border-red-500">
          <Alert open={Boolean(error)} onOpenChange={() => setError('')}>
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* رسالة النجاح */}
      {success && (
        <Alert open={success} onOpenChange={() => setSuccess(false)}>
          <AlertDescription className="text-green-600">
            تم استلام طلب الدفع بنجاح! جاري تحويلك...
          </AlertDescription>
        </Alert>
      )}

      {/* ...existing JSX for packages and payment form... */}
    </div>
  );
}
