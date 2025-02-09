// src/lib/utils/file.ts
import { uploadFileToAzure } from '../azure/config';

export const allowedFileTypes = {
  images: ['image/jpeg', 'image/png', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  videos: ['video/mp4', 'video/webm']
};

export const maxFileSize = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024 // 100MB
};

export const validateFile = (file: File, type: 'images' | 'documents' | 'videos'): boolean => {
  if (!file) return false;

  // Check file type
  if (!allowedFileTypes[type].includes(file.type)) {
    console.error('❌ نوع الملف غير مسموح به');
    return false;
  }

  // Check file size
  const maxSize = type === 'images' ? maxFileSize.image : 
                 type === 'documents' ? maxFileSize.document : 
                 maxFileSize.video;

  if (file.size > maxSize) {
    console.error('❌ حجم الملف كبير جداً');
    return false;
  }

  return true;
};

export const handleFileUpload = async (
  file: File,
  type: 'images' | 'documents' | 'videos'
): Promise<string | null> => {
  if (!validateFile(file, type)) return null;

  try {
    const url = await uploadFileToAzure(file);
    return url;
  } catch (error) {
    console.error('❌ خطأ في رفع الملف:', error);
    return null;
  }
};