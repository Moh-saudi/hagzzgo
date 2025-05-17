'use client';

import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import Link from 'next/link';
import Image from 'next/image';
import { 
  Check, CreditCard, Bell, Mail, Search, 
  User, Activity, MessageSquare, 
  FileText, Zap, Brain, Target, Settings, LogOut,
  Receipt, Calendar, X, Upload
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "@/lib/firebase/config";

// إعدادات Supabase
const supabaseUrl = 'https://ekyerljzfokqimbabzxm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVreWVybGp6Zm9rcWltYmFienhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTcyODMsImV4cCI6MjA2MjIzMzI4M30.Xd6Cg8QUISHyCG-qbgo9HtWUZz6tvqAqG6KKXzuetBY';

// التحقق من إعدادات Supabase
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase configuration is missing');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default function SimplePaymentPage() {
  const [user, authLoading, authError] = useAuthState(auth);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('3months');
  const [activeTab, setActiveTab] = useState('packages');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [invoices, setInvoices] = useState<DisplayInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await supabase.auth.signInWithIdToken({
          provider: 'firebase',
          token,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // تعريف الأنواع
  type PackageType = '3months' | '6months' | 'yearly';

  interface Package {
    title: string;
    price: string;
    originalPrice: string;
    period: string;
    discount: string;
    features: string[];
  }

  interface Subscription {
    plan_name: PackageType;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'cancelled';
    user_id: string;
    created_at: string;
    updated_at: string;
    auto_renew: boolean;
    payment_method: string;
    amount: number;
    currency: string;
  }

  interface CurrentSubscription {
    package: string;
    startDate: string;
    expiryDate: string;
    daysLeft: number;
    status: string;
    autoRenew: boolean;
  }

  interface Invoice {
    id: string;
    created_at: string;
    amount: number;
    status: string;
    plan_name: PackageType;
    due_date: string;
  }

  interface DisplayInvoice {
    id: string;
    date: string;
    amount: string;
    status: string;
    package: string;
    expiryDate: string;
  }

  // تعريف الباقات
  const packages: Record<PackageType, Package> = {
=======
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






const PaymentVerification = () => {
  const [selectedPackage, setSelectedPackage] = useState<'3months' | '6months' | 'yearly'>('3months');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(true);

  
  const packages = {
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
    '3months': {
      title: 'باقة النجم الصاعد ⭐',
      price: '60 جنيه مصري',
      originalPrice: '80 جنيه مصري',
      period: '3 شهور',
      discount: '25%',
      features: [
        'إنشاء ملف شخصي احترافي كامل',
        'إضافة صور وفيديوهات غير محدودة',
        'الظهور في نتائج البحث',
        'التواصل مع 5 أفراد شهرياً',
        'حضور تجارب الأداء',
        'الدعم الفني علي مدار الساعة',
        'تحديثات مجانية للمميزات الجديدة'
      ]
    },
    '6months': {
      title: 'باقة المحترف المتألق 🏆',
      price: '110 جنيه مصري',
      originalPrice: '150 جنيه مصري',
      period: '6 شهور',
      discount: '27%',
      features: [
        'جميع مميزات باقة النجم الصاعد',
        'التواصل مع 15 نادي شهرياً',
        'إشارة لمدير مميز',
        'إحصائيات متقدمة للملف الشخصي',
        'تقارير شهرية عن أداء حسابك',
        'أولوية في الظهور بنتائج البحث',
        'دعوات حصرية لمعسكرات تدريبية'
      ]
    },
    'yearly': {
      title: 'باقة النخبة الذهبية 👑',
      price: '150 جنيه مصري',
      originalPrice: '220 جنيه مصري',
      period: 'سنة كاملة',
      discount: '32%',
      features: [
        'جميع مميزات باقة المحترف المتألق',
        'تواصل غير محدود مع الأندية',
        'إشارة لاعب محترف',
        'أعلى أولوية في الظهور',
        'تحليل شهري من مدربين محترفين',
        'جلسات استشارية مع خبراء رياضيين',
        'عضوية VIP وخصومات خاصة'
      ]
    }
  };

<<<<<<< HEAD
  const phoneNumbers = {
    'فودافون كاش': '01017799580',
    'اتصالات كاش': '01017799580',
    'بنك الأهلي': '01017799580',
    'انستا باي': '01017799580'
  };

  const TabButton = ({ value, label, active, onClick }: { value: string, label: string, active: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium ${active ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
    >
      {label}
    </button>
  );

  // دالة لإنشاء اشتراك جديد
  const createSubscription = async (userId: string, planName: PackageType, paymentMethod: string) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      
      // حساب تاريخ الانتهاء بناءً على نوع الباقة
      switch (planName) {
        case '3months':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case '6months':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      const subscriptionData: Subscription = {
        plan_name: planName,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        auto_renew: false,
        payment_method: paymentMethod,
        amount: parseInt(packages[planName].price),
        currency: 'EGP'
      };

      // حفظ الاشتراك في Firestore
      const subscriptionRef = doc(db, 'subscriptions', userId);
      await setDoc(subscriptionRef, subscriptionData);

      // إنشاء فاتورة جديدة
      const invoiceRef = doc(collection(db, 'users', userId, 'invoices'));
      await setDoc(invoiceRef, {
        subscription_id: userId,
        amount: subscriptionData.amount,
        status: 'paid',
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
        due_date: endDate.toISOString(),
        plan_name: planName
      });

      return subscriptionData;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  // دالة لرفع صورة الإيصال
  const handleReceiptUpload = async (file: File) => {
    try {
      if (!user) {
        setError('يجب تسجيل الدخول أولاً');
        return;
      }

      setUploadingReceipt(true);
      setError(null);

      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        throw new Error('يرجى رفع ملف صورة فقط');
      }

      // التحقق من حجم الملف (5MB كحد أقصى)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('حجم الملف يجب أن لا يتجاوز 5 ميجابايت');
      }

      // إنشاء اسم فريد للملف
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${user.uid}/${timestamp}.${fileExtension}`;

      console.log('بدء رفع الملف:', fileName);

      // التحقق من اتصال Supabase
      if (!supabase) {
        throw new Error('فشل الاتصال بـ Supabase');
      }

      try {
        // التحقق من وجود bucket
        const { data: buckets, error: bucketsError } = await supabase
          .storage
          .listBuckets();

        if (bucketsError) {
          console.error('خطأ في التحقق من الـ buckets:', bucketsError);
          throw new Error('فشل التحقق من وجود مجلد التخزين');
        }

        const walletBucket = buckets?.find((b: { name: string }) => b.name === 'wallet');
        if (!walletBucket) {
          throw new Error('مجلد التخزين غير موجود');
        }

        // التحقق من صلاحيات المستخدم
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('خطأ في التحقق من المستخدم:', userError);
          throw new Error('فشل التحقق من هوية المستخدم');
        }

        if (!userData?.user) {
          throw new Error('لم يتم العثور على بيانات المستخدم');
        }

        // رفع الملف إلى Supabase مع إضافة metadata
        const { data, error: uploadError } = await supabase.storage
          .from('wallet')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type,
            metadata: {
              userId: user.uid,
              uploadedAt: new Date().toISOString(),
              fileName: file.name
            }
          });

        if (uploadError) {
          console.error('خطأ في رفع الملف:', uploadError);
          // تحليل نوع الخطأ
          if (uploadError.message.includes('duplicate')) {
            throw new Error('تم رفع هذا الملف مسبقاً');
          } else if (uploadError.message.includes('permission') || uploadError.message.includes('security policy')) {
            throw new Error('ليس لديك صلاحية لرفع الملفات. يرجى التأكد من تسجيل الدخول');
          } else if (uploadError.message.includes('network')) {
            throw new Error('فشل الاتصال بالإنترنت');
          } else {
            throw new Error(`فشل رفع الملف: ${uploadError.message}`);
          }
        }

        if (!data) {
          throw new Error('فشل رفع الملف: لم يتم استلام تأكيد من الخادم');
        }

        console.log('تم رفع الملف بنجاح:', data);

        // الحصول على رابط التحميل
        const { data: urlData } = supabase.storage
          .from('wallet')
          .getPublicUrl(fileName);

        if (!urlData?.publicUrl) {
          throw new Error('لم يتم إنشاء رابط للملف');
        }

        const publicUrl = urlData.publicUrl;
        console.log('رابط الصورة:', publicUrl);

        setReceiptUrl(publicUrl);
        
        // تحديث بيانات الاشتراك برابط الإيصال
        const subscriptionRef = doc(db, 'subscriptions', user.uid);
        await setDoc(subscriptionRef, {
          receipt_url: publicUrl,
          receipt_uploaded_at: new Date().toISOString(),
          receipt_file_name: fileName,
          receipt_metadata: {
            userId: user.uid,
            uploadedAt: new Date().toISOString(),
            fileName: file.name
          }
        }, { merge: true });

        return publicUrl;
      } catch (err) {
        console.error('Error in Supabase operations:', err);
        if (err instanceof Error) {
          if (err.message.includes('network') || err.message.includes('connection')) {
            throw new Error('فشل الاتصال بالإنترنت. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى');
          } else if (err.message.includes('timeout')) {
            throw new Error('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى');
          } else if (err.message.includes('permission')) {
            throw new Error('ليس لديك صلاحية للقيام بهذه العملية. يرجى التأكد من تسجيل الدخول');
          } else if (err.message.includes('bucket')) {
            throw new Error('مجلد التخزين غير موجود. يرجى التواصل مع الدعم الفني');
          } else {
            throw new Error(`فشل الاتصال بالخادم: ${err.message}`);
          }
        }
        throw new Error('فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى');
      }
    } catch (err) {
      console.error('Error uploading receipt:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الإيصال';
      setError(errorMessage);
      throw err;
    } finally {
      setUploadingReceipt(false);
    }
  };

  // تحديث دالة saveSubscription لتشمل معالجة أفضل للأخطاء
  const saveSubscription = async () => {
    try {
      if (!user) {
        setError('يجب تسجيل الدخول أولاً');
        return;
      }

      if (paymentMethod === 'bank-transfer' && !receiptFile) {
        setError('يرجى رفع صورة الإيصال');
        return;
      }

      let receiptUrl = null;
      if (receiptFile) {
        try {
          receiptUrl = await handleReceiptUpload(receiptFile);
        } catch (uploadError) {
          console.error('فشل رفع الإيصال:', uploadError);
          setError('فشل رفع الإيصال. يرجى المحاولة مرة أخرى');
          return;
        }
      }

      const subscription = await createSubscription(
        user.uid,
        selectedPackage,
        paymentMethod === 'credit-card' ? 'credit_card' : 'bank_transfer'
      );

      // تحديث البيانات
      await fetchCurrentSubscription();
      await fetchInvoices();
      
      setShowVerification(true);
    } catch (err) {
      console.error('Error saving subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الاشتراك';
      setError(errorMessage);
    }
  };

  // دالة لجلب بيانات الاشتراك الحالي
  const fetchCurrentSubscription = async () => {
    try {
      if (authLoading) {
        console.log('Waiting for auth state...');
        return;
      }

      if (!user) {
        console.log('No user found');
        setError('يجب تسجيل الدخول أولاً');
        return;
      }

      console.log('Fetching subscription for user:', user.uid);

      const subscriptionRef = doc(db, 'subscriptions', user.uid);
      const subscriptionDoc = await getDoc(subscriptionRef);

      if (subscriptionDoc.exists()) {
        const data = subscriptionDoc.data() as Subscription;
        console.log('Subscription data:', data);

        // التحقق من حالة الاشتراك
        const now = new Date();
        const endDate = new Date(data.end_date);
        const isExpired = endDate < now;

        if (isExpired && data.status === 'active') {
          // تحديث حالة الاشتراك إذا انتهت صلاحيته
          await setDoc(subscriptionRef, {
            ...data,
            status: 'expired',
            updated_at: new Date().toISOString()
          });
          data.status = 'expired';
        }

        setCurrentSubscription({
          package: packages[data.plan_name].title,
          startDate: new Date(data.start_date).toLocaleDateString('ar-EG'),
          expiryDate: new Date(data.end_date).toLocaleDateString('ar-EG'),
          daysLeft: Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          status: data.status,
          autoRenew: data.auto_renew
        });
      } else {
        console.log('No active subscription found');
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('حدث خطأ أثناء جلب بيانات الاشتراك');
    }
  };

  // دالة لجلب سجل الفواتير
  const fetchInvoices = async () => {
    try {
      if (!user) {
        setError('يجب تسجيل الدخول أولاً');
        return;
      }

      // استخدام Firestore لجلب سجل الفواتير
      const invoicesRef = collection(db, 'users', user.uid, 'invoices');
      const invoicesSnapshot = await getDocs(invoicesRef);

      if (!invoicesSnapshot.empty) {
        const invoicesData = invoicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Invoice[];

        setInvoices(invoicesData.map(invoice => ({
          id: invoice.id,
          date: new Date(invoice.created_at).toLocaleDateString('ar-EG'),
          amount: `${invoice.amount} جنيه مصري`,
          status: invoice.status === 'paid' ? 'مدفوع' : 'منتهي',
          package: packages[invoice.plan_name].title,
          expiryDate: new Date(invoice.due_date).toLocaleDateString('ar-EG')
        })));
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('حدث خطأ أثناء جلب سجل الفواتير');
    }
  };

  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (authLoading) {
          console.log('Waiting for auth state...');
          return;
        }

        if (!user) {
          console.log('No user found');
          setError('يجب تسجيل الدخول أولاً');
          return;
        }

        await fetchCurrentSubscription();
        await fetchInvoices();
      } catch (err) {
        console.error('Error loading data:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading]);

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* حالة التحميل */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      )}

      {/* حالة الخطأ */}
      {error && !loading && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <X className="w-5 h-5 ml-2 text-red-500" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* محتوى الصفحة */}
      {!loading && !error && (
        <>
          {/* هيدر الصفحة */}
          <header className="p-6 mb-8 bg-white shadow-sm rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-blue-600">
                  الفوترة والاشتراكات 💳
                </h1>
                <p className="mt-1 text-gray-600">إدارة اشتراكك والفواتير الخاصة بك</p>
              </div>
            </div>
          </header>

          {/* تنبيه انتهاء صلاحية الاشتراك */}
          {currentSubscription && currentSubscription.daysLeft <= 30 && (
            <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800">
                  باقتك ستنتهي خلال {currentSubscription.daysLeft} يوم. قم بتجديد اشتراكك لتجنب انقطاع الخدمة.
                </span>
                <button 
                  className="px-4 py-2 text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-100"
                  onClick={() => setActiveTab('packages')}
                >
                  تجديد الآن
                </button>
              </div>
            </div>
          )}

          {/* علامات التبويب */}
          <div className="mb-6 space-x-2 space-x-reverse">
            <TabButton 
              value="subscription" 
              label="الاشتراك الحالي" 
              active={activeTab === 'subscription'} 
              onClick={() => setActiveTab('subscription')} 
            />
            <TabButton 
              value="packages" 
              label="باقات الاشتراك" 
              active={activeTab === 'packages'} 
              onClick={() => setActiveTab('packages')} 
            />
            <TabButton 
              value="invoices" 
              label="الفواتير" 
              active={activeTab === 'invoices'} 
              onClick={() => setActiveTab('invoices')} 
            />
          </div>

          {/* محتوى التبويب */}
          <div className="bg-white rounded-lg shadow-sm">
            {activeTab === 'subscription' && (
              <div className="p-6">
                <h3 className="mb-4 text-xl font-bold">الاشتراك الحالي</h3>
                {currentSubscription ? (
                  <div className="p-6 border border-blue-100 rounded-lg bg-blue-50">
                    <h3 className="mb-4 text-xl font-bold text-blue-600">{currentSubscription.package}</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-gray-500">تاريخ البدء</p>
                        <p className="flex items-center mt-1 font-semibold text-gray-700">
                          <Calendar className="w-4 h-4 ml-2 text-blue-500" />
                          {currentSubscription.startDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">تاريخ الانتهاء</p>
                        <p className="flex items-center mt-1 font-semibold text-gray-700">
                          <Calendar className="w-4 h-4 ml-2 text-blue-500" />
                          {currentSubscription.expiryDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الحالة</p>
                        <p className="flex items-center p-1 mt-1 font-semibold text-green-700 bg-green-100 rounded-full w-fit">
                          <span className="w-2 h-2 ml-1 bg-green-500 rounded-full"></span>
                          {currentSubscription.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="autoRenew" 
                            checked={currentSubscription.autoRenew} 
                            readOnly
                            className="w-4 h-4 ml-2 text-blue-600 border-gray-300 rounded" 
                          />
                          <label htmlFor="autoRenew" className="text-gray-700">تجديد تلقائي</label>
                        </div>
                        <button className="px-4 py-2 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50">
                          إلغاء الاشتراك
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    لا يوجد اشتراك نشط حالياً
                  </div>
                )}
              </div>
            )}

            {activeTab === 'packages' && (
              <div className="p-6">
                <h3 className="mb-6 text-xl font-bold">اختر الباقة المناسبة لك</h3>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {(['3months', '6months', 'yearly'] as const).map((key) => (
                    <div 
                      key={key} 
                      className={`p-6 border rounded-lg transition-shadow hover:shadow-md cursor-pointer ${
                        selectedPackage === key 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => setSelectedPackage(key)}
                    >
                      <div className="relative">
                        <h3 className="mb-2 text-xl font-bold">
                          {packages[key].title}
                        </h3>
                        {packages[key].discount && (
                          <span className="absolute top-0 left-0 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
                            خصم {packages[key].discount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline mt-4 mb-6 space-x-2 space-x-reverse">
                        <span className="text-2xl font-bold">{packages[key].price}</span>
                        {packages[key].originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{packages[key].originalPrice}</span>
                        )}
                        <span className="text-sm text-gray-500">/ {packages[key].period}</span>
                      </div>
                      <ul className="mb-6 space-y-2">
                        {packages[key].features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 ml-2 text-green-500 shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        className={`w-full py-2 text-white rounded-lg transition-colors ${
                          selectedPackage === key 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPackage(key);
                          document.getElementById('payment-methods')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {selectedPackage === key ? 'اختيار طريقة الدفع' : 'اختيار هذه الباقة'}
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* طرق الدفع */}
                <div id="payment-methods" className="p-6 mt-12 bg-white rounded-lg shadow-sm">
                  <h3 className="mb-6 text-xl font-bold">اختر طريقة الدفع</h3>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer ${
                        paymentMethod === 'bank-transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => {
                        setPaymentMethod('bank-transfer');
                        setShowCreditCard(false);
                      }}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 text-white bg-blue-500 rounded-full">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">التحويل البنكي / فودافون كاش</h4>
                          <p className="text-sm text-gray-500">حول المبلغ ثم أرسل صورة الإيصال</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer ${
                        paymentMethod === 'credit-card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => {
                        setPaymentMethod('credit-card');
                        setShowCreditCard(true);
                      }}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 text-white bg-blue-500 rounded-full">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">بطاقة ائتمان</h4>
                          <p className="text-sm text-gray-500">الدفع الآمن عبر PayMob أو Paytabs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* تفاصيل التحويل البنكي */}
                  {paymentMethod === 'bank-transfer' && (
                    <div className="p-6 mt-6 border border-gray-200 rounded-lg">
                      <h4 className="mb-4 text-lg font-medium">تفاصيل الحسابات البنكية</h4>
                      
                      {/* عرض رسالة الخطأ */}
                      {error && (
                        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">
                          <div className="flex items-center">
                            <X className="w-5 h-5 ml-2 text-red-500" />
                            <p>{error}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {Object.entries(phoneNumbers).map(([provider, number]) => (
                          <div key={provider} className="p-4 border border-gray-200 rounded-lg">
                            <h5 className="font-medium">{provider}</h5>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-lg font-bold">{number}</p>
                              <button 
                                className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
                                onClick={() => {
                                  navigator.clipboard.writeText(number);
                                }}
                              >
                                نسخ
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="mb-4 text-lg font-medium">إرفاق صورة الإيصال</h4>
                        <div 
                          className={`p-6 text-center border-2 border-gray-300 border-dashed rounded-lg ${
                            uploadingReceipt ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'
                          }`}
                          onClick={() => !uploadingReceipt && document.getElementById('receipt-upload')?.click()}
                        >
                          {receiptUrl ? (
                            <div className="space-y-2">
                              <Image
                                src={receiptUrl}
                                alt="صورة الإيصال"
                                width={200}
                                height={200}
                                className="mx-auto rounded-lg"
                              />
                              <p className="text-sm text-green-600">تم رفع الإيصال بنجاح</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 mx-auto text-gray-400" />
                              <p className="mt-2 text-sm text-gray-600">
                                {uploadingReceipt ? 'جاري الرفع...' : 'اسحب وأفلت الصورة هنا أو انقر للتصفح'}
                              </p>
                            </>
                          )}
                          <input
                            id="receipt-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setReceiptFile(file);
                                handleReceiptUpload(file).catch(console.error);
                              }
                            }}
                            disabled={uploadingReceipt}
                          />
                        </div>
                      </div>
                      
                      <button
                        className={`w-full py-3 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${
                          uploadingReceipt ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={saveSubscription}
                        disabled={uploadingReceipt}
                      >
                        {uploadingReceipt ? 'جاري الرفع...' : 'إرسال وتأكيد الدفع'}
                      </button>
                    </div>
                  )}
                  
                  {/* نموذج بطاقة الائتمان */}
                  {showCreditCard && (
                    <div className="p-6 mt-6 border border-gray-200 rounded-lg">
                      <h4 className="mb-4 text-lg font-medium">معلومات بطاقة الائتمان</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium">رقم البطاقة</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-lg" 
                            placeholder="xxxx xxxx xxxx xxxx" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1 text-sm font-medium">تاريخ الانتهاء</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border border-gray-300 rounded-lg" 
                              placeholder="MM/YY" 
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium">رمز الأمان (CVV)</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border border-gray-300 rounded-lg" 
                              placeholder="123" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium">الاسم على البطاقة</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-lg" 
                            placeholder="الاسم الكامل" 
                          />
                        </div>
                      </div>
                      
                      <button
                        className="w-full py-3 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={saveSubscription}
                      >
                        إتمام الدفع ({packages[selectedPackage].price})
                      </button>
                      
                      <div className="flex items-center justify-center mt-4 space-x-2 space-x-reverse">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <p className="text-xs text-gray-500">جميع معاملات الدفع آمنة ومشفرة</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="p-6">
                <h3 className="mb-6 text-xl font-bold">سجل الفواتير</h3>
                
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                          رقم الفاتورة
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                          التاريخ
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                          المبلغ
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                          الباقة
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                          تاريخ الانتهاء
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                          الحالة
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {invoice.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {invoice.date}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {invoice.amount}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {invoice.package}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {invoice.expiryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              invoice.status === 'مدفوع'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right">
                            <a href="#" className="text-blue-600 hover:text-blue-900">
                              عرض
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          {/* نافذة تأكيد الدفع */}
          {showVerification && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <div className="w-full max-w-lg p-6 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">تأكيد الدفع</h3>
                  <button 
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowVerification(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4 mb-4 border border-green-100 rounded-lg bg-green-50">
                  <div className="flex items-center mb-4 space-x-2 space-x-reverse">
                    <div className="p-1 bg-green-500 rounded-full">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-green-800">تم استلام الدفع بنجاح!</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    شكراً لك. تم تفعيل الاشتراك في {packages[selectedPackage].title} وستنتهي صلاحيته بعد {packages[selectedPackage].period}.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="mb-3 font-medium">تفاصيل الفاتورة</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الباقة:</span>
                      <span>{packages[selectedPackage].title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المدة:</span>
                      <span>{packages[selectedPackage].period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">طريقة الدفع:</span>
                      <span>{paymentMethod === 'credit-card' ? 'بطاقة ائتمان' : 'تحويل بنكي'}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>المبلغ الإجمالي:</span>
                      <span>{packages[selectedPackage].price}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6 space-x-3 space-x-reverse">
                  <button
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    onClick={() => setShowVerification(false)}
                  >
                    إغلاق
                  </button>
                  <button
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      setShowVerification(false);
                      setActiveTab('subscription');
                    }}
                  >
                    عرض الاشتراك
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

=======
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setFile(file);
    } else {
      alert('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
    }
  };

  const phoneNumbers: { [key: string]: string } = {
    'فودافون كاش': '01017795500',
    'اتصالات كاش': '01517795500',
    'بنك الأهلي': '01217795500'
  };

  const CreditCardForm = () => (
    <div className="space-y-4">
      <Input placeholder="رقم البطاقة" className="w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="MM/YY" />
        <Input placeholder="CVV" type="password" maxLength={3} />
      </div>
      <Input placeholder="الاسم على البطاقة" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="px-6 py-4 mb-8 bg-white shadow-sm">
        <div className="container flex items-center justify-between mx-auto">
          <h1 className="text-2xl font-bold text-blue-600">Hagzz-Go</h1>
          <nav className="space-x-4">
            <Button variant="ghost">الرئيسية</Button>
            <Button variant="ghost">الملف الشخصي</Button>
            <Button variant="ghost">تواصل معنا</Button>
          </nav>
        </div>
      </header>

      <div className="container max-w-6xl p-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">اختر باقة الاشتراك المناسبة</h2>
          <p className="text-gray-600">ابدأ رحلتك الاحترافية مع أفضل الباقات المصممة خصيصاً لك</p>
        </div>
        
        {/* Packages Section */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {Object.entries(packages).map(([key, pack]) => (
            <Card 
              key={key}
              className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedPackage === key ? 'border-blue-500 border-2 shadow-lg' : ''
              }`}
              onClick={() => setSelectedPackage(key as '3months' | '6months' | 'yearly')}
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="text-xl text-center">{pack.title}</CardTitle>
                <div className="text-center">
                  <span className="text-sm text-gray-500 line-through">{pack.originalPrice}</span>
                  <div className="text-3xl font-bold text-blue-600">{pack.price}</div>
                  <div className="font-semibold text-green-500">خصم {pack.discount}</div>
                  <div className="text-gray-500">{pack.period}</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pack.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="flex-shrink-0 w-5 h-5 ml-2 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => setSelectedPackage(key as '3months' | '6months' | 'yearly')}
                >
                  اختر هذه الباقة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

       {/* Payment Methods */}
<Card className="mb-8">
  <CardHeader>
    <CardTitle>اختر طريقة الدفع</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <TooltipProvider>
        {Object.keys(phoneNumbers).concat(['بطاقة ائتمان']).map(method => (
          <Tooltip key={method}>
            <TooltipTrigger asChild>
              <div> {/* استخدام div كحاوية */}
                <Button
                  variant={paymentMethod === method ? 'default' : 'outline'}
                  className="w-full h-20 text-lg"
                  onClick={() => {
                    setPaymentMethod(method);
                    setShowVerification(true);
                    setShowCreditCard(method === 'بطاقة ائتمان');
                  }}
                >
                  {method}
                  {method === 'بطاقة ائتمان' ? <CreditCard className="mr-2" /> : null}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {method === 'بطاقة ائتمان' 
                ? 'الدفع الآمن ببطاقة الائتمان'
                : `رقم المحفظة: ${phoneNumbers[method as keyof typeof phoneNumbers]}`
              }
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  </CardContent>
</Card>

       {/* Verification Section */}
{showVerification && (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>تأكيد الدفع</CardTitle>
    </CardHeader>
    <CardContent>
      {showCreditCard ? (
        <CreditCardForm />
      ) : (
        <>
          {/* Alert Section */}
          <div className="mb-6">
            <Alert open={showAlert} onOpenChange={setShowAlert}>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  برجاء تحويل مبلغ {packages[selectedPackage].price} إلى رقم {phoneNumbers[paymentMethod]}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-2 ml-2"
                  onClick={() => setShowAlert(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDescription>
            </Alert>
          </div>
          
          {/* Transfer Number Input */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                رقم عملية التحويل
              </label>
              <Input
                type="text"
                placeholder="أدخل رقم العملية من إيصال التحويل"
                className="w-full"
              />
            </div>
            
            {/* Receipt Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                صورة إيصال الدفع
              </label>
              <div className="p-4 text-center border-2 border-dashed rounded-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="receipt-upload"
                />
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  <Button variant="outline" className="w-full h-24">
                    <Upload className="ml-2" />
                    {file ? file.name : 'اضغط هنا لرفع صورة الإيصال'}
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button 
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Check className="ml-2" />
          تأكيد وإتمام الاشتراك
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
        >
          حفظ كمسودة
        </Button>
      </div>
    </CardContent>
  </Card>
)}

      {/* Footer */}
      </div>
      <footer className="py-8 mt-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 font-bold">تواصل معنا</h3>
              <p>البريد الإلكتروني: support@hagzz-go.com</p>
              <p>الهاتف: 19123</p>
            </div>
            <div>
              <h3 className="mb-4 font-bold">روابط سريعة</h3>
              <ul className="space-y-2">
                <li><Button variant="link">الأسئلة الشائعة</Button></li>
                <li><Button variant="link">سياسة الخصوصية</Button></li>
                <li><Button variant="link">الشروط والأحكام</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold">تابعنا</h3>
              <div className="flex space-x-4">
                <Button variant="ghost">فيسبوك</Button>
                <Button variant="ghost">تويتر</Button>
                <Button variant="ghost">انستغرام</Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentVerification;
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
