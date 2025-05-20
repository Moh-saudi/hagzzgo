// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// تنفيذ نمط العازل (singleton) للتأكد من إنشاء عميل واحد فقط
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  // إذا كان العميل موجودًا بالفعل، أعد استخدامه
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // إذا كانت المتغيرات غير موجودة، أرجع null بدلاً من رمي استثناء
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables are missing. Storage features will be unavailable.');
    return null;
  }
  
  // إنشاء العميل فقط إذا كانت المتغيرات موجودة
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
}

// دالة مساعدة للتحقق من توفر Supabase
export function isSupabaseAvailable() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  PLAYER_IMAGES: 'player-images',
  DOCUMENTS: 'documents'
} as const;

// وظائف مساعدة للتعامل مع التخزين
// Define interfaces for better type safety
interface UploadResponse {
  path: string;
}

interface PublicUrlResponse {
  publicUrl: string;
}

export async function uploadFile(
  file: File | Blob,
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl((data as UploadResponse).path);
      
    return (urlData as PublicUrlResponse).publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}