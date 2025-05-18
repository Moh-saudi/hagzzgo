'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/src/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // استخدام Listener للتحقق من حالة المستخدم
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login'); // إعادة التوجيه إذا لم يكن المستخدم مسجل دخول
        return;
      }

      try {
        // جلب بيانات المستخدم من Firestore
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          // التوجيه بناءً على نوع الحساب
          switch (userData.accountType) {
            case 'player':
              router.push('/dashboard/player');
              break;
            case 'admin':
              router.push('/dashboard/admin');
              break;
            case 'club':
              router.push('/dashboard/club');
              break;
            case 'marketer':
              router.push('/dashboard/marketer');
              break;
            default:
              router.push('/auth/login'); // توجيه المستخدمين غير المعتمدين
          }
        } else {
          router.push('/auth/login'); // إذا لم تكن هناك بيانات للمستخدم
        }
      } catch (err) {
        console.error('Error during redirection:', err);
        router.push('/auth/login'); // في حال وجود خطأ
      }
    });

    // تنظيف المستمع عند إلغاء تثبيت المكون
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="text-center">
        <p className="text-xl font-semibold">جاري التوجيه إلى لوحة التحكم الخاصة بك...</p>
        <p className="mt-2 text-gray-300">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  );
}
