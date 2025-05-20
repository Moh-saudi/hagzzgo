'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';


export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (userSnap.exists() && userData) {
          switch (userData.accountType) {
            case 'admin':
              router.push('/dashboard/admin');
              break;
            case 'player':
              router.push('/dashboard/player');
              break;
            case 'marketer':
              router.push('/dashboard/marketer');
              break;
            default:
              console.warn('Unknown account type:', userData.accountType);
              router.push('/auth/login');
          }
        } else {
          console.warn('No user data found for:', currentUser.uid);
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}
