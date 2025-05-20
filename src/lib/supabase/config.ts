import { createClient } from '@supabase/supabase-js';

// استخدام سلاسل فارغة كقيم افتراضية
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// تسجيل تحذير بدلاً من رمي استثناء
if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables - storage features will be limited');
}

// إنشاء العميل بغض النظر عن توفر المتغيرات
export const supabase = createClient(supabaseUrl, supabaseKey);

// إضافة دالة مساعدة للتحقق من توفر التكوين
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey);
};

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  PLAYER_IMAGES: 'player-images',
  DOCUMENTS: 'documents'
} as const;