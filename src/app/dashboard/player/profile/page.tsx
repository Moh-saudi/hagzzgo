'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Check, Upload, Plus, Trash, X, User, GraduationCap, Heart, Trophy, Target, Image as ImageIcon, Settings, LogOut, Edit } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

// Supabase Client
import { createClient } from '@supabase/supabase-js';

// Add import for DashboardLayout
import DashboardLayout from '@/components/layout/DashboardLayout';

// Add better error handling for Supabase initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configuration is missing');
}

// Initialize Supabase client with proper configuration
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Constants & Reference Data
const STEPS = {
  PERSONAL: 1,
  EDUCATION: 2,
  MEDICAL: 3,
  SPORTS: 4,
  SKILLS: 5,
  OBJECTIVES: 6,
  MEDIA: 7
};

const STEP_TITLES = {
  [STEPS.PERSONAL]: 'البيانات الشخصية',
  [STEPS.EDUCATION]: 'المعلومات التعليمية',
  [STEPS.MEDICAL]: 'السجل الطبي',
  [STEPS.SPORTS]: 'المعلومات الرياضية',
  [STEPS.SKILLS]: 'المهارات والقدرات',
  [STEPS.OBJECTIVES]: 'الأهداف والطموحات',
  [STEPS.MEDIA]: 'الصور والفيديوهات'
};

const REFERENCE_DATA = {
  educationLevels: ['ابتدائي', 'متوسط', 'ثانوي', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه'],
  languageLevels: ['مبتدئ', 'متوسط', 'متقدم', 'محترف'],
  bloodTypes: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  positions: [
    'حارس مرمى',
    'مدافع أيمن',
    'مدافع أيسر',
    'قلب دفاع',
    'وسط دفاعي',
    'وسط',
    'جناح أيمن',
    'جناح أيسر',
    'مهاجم صريح',
    'مهاجم ثاني'
  ],
  footPreferences: ['اليمنى', 'اليسرى', 'كلتاهما']
};

// Default player fields
const defaultPlayerFields = {
  full_name: '',
  birth_date: '',
  nationality: '',
  city: '',
  country: '',
  phone: '',
  whatsapp: '',
  email: '',
  brief: '',
  education_level: '',
  graduation_year: '',
  english_level: '',
  arabic_level: '',
  spanish_level: '',
  blood_type: '',
  height: '',
  weight: '',
  chronic_details: '',
  primary_position: '',
  secondary_position: '',
  preferred_foot: '',
  technical_skills: {},
  physical_skills: {},
  social_skills: {},
  objectives: {},
  profile_image: null,
  additional_images: [],
  videos: [],
  training_courses: [],
};

// Loading Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
    <p>{message}</p>
  </div>
);

// Success Message Component
const SuccessMessage = ({ message }: { message: string }) => (
  <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
    <p>{message}</p>
  </div>
);

// Progress Steps Component
interface ProgressStepsProps {
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps = Object.entries(STEP_TITLES).map(([step, title]) => ({
    number: Number(step),
    title
  }));

  return (
    <div className="flex justify-between mb-8">
      {steps.map(({ number, title }) => (
        <div
          key={number}
          className={`flex items-center ${
            number === currentStep ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              number === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {number}
          </div>
          <span className="mr-2">{title}</span>
          {number < steps.length && (
            <div className="w-16 h-0.5 bg-gray-200"></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Define interfaces for props
interface NavigationButtonsProps {
  currentStep: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  submitting: boolean;
}

// Update component with proper type annotations
const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  currentStep, 
  setCurrentStep, 
  submitting 
}) => {
  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 && (
        <Button
          type="button"
          onClick={() => setCurrentStep(prev => prev - 1)}
          className="flex items-center"
        >
          <ChevronRight className="ml-2" />
          السابق
        </Button>
      )}
      {currentStep < Object.keys(STEP_TITLES).length ? (
        <Button
          type="button"
          onClick={() => setCurrentStep(prev => prev + 1)}
          className="flex items-center"
        >
          التالي
          <ChevronLeft className="mr-2" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={submitting}
          className="flex items-center"
        >
          {submitting ? 'جاري الحفظ...' : 'حفظ البيانات'}
          <Check className="mr-2" />
        </Button>
      )}
    </div>
  );
};

// Helper function to combine classes
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Add bucket constants
const BUCKETS = {
  AVATARS: 'avatars',
  PLAYER_IMAGES: 'player-images',
  WALLET: 'wallet'
};

export default function PlayerProfile() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [currentStep, setCurrentStep] = useState(STEPS.PERSONAL);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [playerData, setPlayerData] = useState(null);
  const [formData, setFormData] = useState({ ...defaultPlayerFields });
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadingAdditionalImages, setUploadingAdditionalImages] = useState({});

  // Debug logging for auth state
  useEffect(() => {
    console.log('Auth State:', { user, loading, error });
  }, [user, loading, error]);

  // Handle auth errors
  useEffect(() => {
    if (error) {
      console.error('Auth error:', error);
      setFormErrors(prev => ({
        ...prev,
        auth: 'حدث خطأ في المصادقة'
      }));
    }
  }, [error]);

  // Handle user authentication
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
      } else {
        console.log('User authenticated:', user.uid);
      }
    }
  }, [loading, user, router]);

  // Fetch player data
  const fetchPlayerData = useCallback(async () => {
    if (!user) {
      console.log("No user found");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Fetching player data for user:", user.uid);
      
      // استرجاع وثيقة اللاعب من Firestore
      const playerRef = doc(db, 'players', user.uid);
      const playerDoc = await getDoc(playerRef);
      
      console.log("Firestore response:", playerDoc.exists() ? "Document exists" : "No document found");
      
      if (playerDoc.exists()) {
        const data = playerDoc.data();
        console.log("Player data from Firestore:", data);
        
        // Helper function to format date
        const formatDate = (dateValue) => {
          if (!dateValue) return '';
          try {
            if (dateValue && typeof dateValue.toDate === 'function') {
              return dateValue.toDate().toISOString().split('T')[0];
            }
            if (typeof dateValue === 'string') {
              return new Date(dateValue).toISOString().split('T')[0];
            }
            if (dateValue instanceof Date) {
              return dateValue.toISOString().split('T')[0];
            }
            return '';
          } catch (error) {
            console.error('Error formatting date:', error);
            return '';
          }
        };
        
        // معالجة الصور والروابط
        let profileImageUrl = data.profile_image_url || '';
        let additionalImagesUrls = data.additional_image_urls || [];
        
        // دمج البيانات
        const mergedData = {
          ...defaultPlayerFields,
          ...data,
          birth_date: formatDate(data.birth_date),
          profile_image: profileImageUrl ? { url: profileImageUrl } : null,
          additional_images: additionalImagesUrls.map(url => ({ url })),
        };
        
        console.log("Merged player data:", mergedData);
        
        setPlayerData(mergedData);
        setFormData(mergedData);
        setEditFormData(mergedData);
      } else {
        console.log("No player data found in Firestore");
        // إذا لم يتم العثور على بيانات، قم بإنشاء وثيقة جديدة
        const newPlayerData = {
          ...defaultPlayerFields,
          created_at: new Date(),
          updated_at: new Date(),
        };
        
        try {
          await setDoc(playerRef, newPlayerData);
          console.log("Created new player document");
          setPlayerData(newPlayerData);
          setFormData(newPlayerData);
          setEditFormData(newPlayerData);
        } catch (error) {
          console.error("Error creating new player document:", error);
          setFormErrors(prev => ({
            ...prev,
            create: 'حدث خطأ أثناء إنشاء الملف الشخصي'
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
      setFormErrors(prev => ({
        ...prev,
        fetch: 'حدث خطأ أثناء جلب البيانات'
      }));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user && !loading) {
      fetchPlayerData();
    }
  }, [user, loading, fetchPlayerData]);

  // Loading states
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="حدث خطأ في تحميل الصفحة" />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="mb-4 text-2xl font-bold">يرجى تسجيل الدخول</h1>
        <Button onClick={() => router.push('/login')}>
          تسجيل الدخول
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // =========== Supabase Storage Functions ===========
  
  // Update uploadProfileImage function
  const uploadProfileImage = async (file, userId) => {
    try {
      // Check authentication first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // تحديد امتداد الملف
      const fileExt = file.name.split('.').pop();
      // إنشاء مسار فريد للملف
      const filePath = `${userId}/profile.${fileExt}`;
      
      console.log('Uploading profile image to:', filePath);
      
      // التحقق من حجم الملف (أقل من 5 ميجابايت)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
      }
      
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        throw new Error('يجب أن يكون الملف صورة');
      }
      
      // رفع الملف إلى bucket avatars
      const { error: uploadError, data } = await supabase.storage
        .from(BUCKETS.AVATARS)
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        });
      
      if (uploadError) {
        console.error('خطأ أثناء رفع صورة البروفايل:', uploadError);
        throw new Error(`فشل في رفع الصورة: ${uploadError.message}`);
      }
      
      // الحصول على الرابط العام للصورة
      const { data: urlData } = await supabase.storage
        .from(BUCKETS.AVATARS)
        .getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) {
        throw new Error('فشل في الحصول على رابط الصورة');
      }
      
      // تأكد من أن الرابط يبدأ بـ http
      let url = urlData.publicUrl;
      if (url && !url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      console.log('تم رفع صورة البروفايل بنجاح:', url);
      return url;
    } catch (error) {
      console.error('فشل في رفع صورة البروفايل:', error);
      throw error;
    }
  };

  // Update uploadAdditionalImage function
  const uploadAdditionalImage = async (file, userId, idx = Date.now()) => {
    try {
      // تحديد امتداد الملف
      const fileExt = file.name.split('.').pop();
      // إنشاء مسار فريد للملف باستخدام الطابع الزمني
      const filePath = `${userId}/additional_${Date.now()}_${idx}.${fileExt}`;
      
      console.log('Uploading additional image to:', filePath);
      
      // التحقق من حجم الملف (أقل من 5 ميجابايت)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
      }
      
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        throw new Error('يجب أن يكون الملف صورة');
      }
      
      // رفع الملف إلى bucket player-images
      const { error: uploadError, data } = await supabase.storage
        .from(BUCKETS.PLAYER_IMAGES)
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        });
      
      if (uploadError) {
        console.error('خطأ أثناء رفع صورة إضافية:', uploadError);
        throw new Error(`فشل في رفع الصورة: ${uploadError.message}`);
      }
      
      // الحصول على الرابط العام للصورة
      const { data: urlData } = await supabase.storage
        .from(BUCKETS.PLAYER_IMAGES)
        .getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) {
        throw new Error('فشل في الحصول على رابط الصورة');
      }
      
      // تأكد من أن الرابط يبدأ بـ http
      let url = urlData.publicUrl;
      if (url && !url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      console.log('تم رفع صورة إضافية بنجاح:', url);
      return url;
    } catch (error) {
      console.error('فشل في رفع صورة إضافية:', error);
      throw error;
    }
  };

  // Update uploadWalletDocument function
  const uploadWalletDocument = async (file, userId, documentType) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing');
    }

    try {
      // Check authentication first
      await checkSupabaseAuth();

      // تحديد امتداد الملف
      const fileExt = file.name.split('.').pop();
      // إنشاء مسار فريد للملف
      const filePath = `${userId}/${documentType}_${Date.now()}.${fileExt}`;
      
      console.log('Uploading wallet document to:', filePath);
      
      // رفع الملف إلى bucket wallet
      const { error: uploadError, data } = await supabase.storage
        .from(BUCKETS.WALLET)
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error('خطأ أثناء رفع وثيقة المحفظة:', uploadError);
        throw new Error(`فشل في رفع الوثيقة: ${uploadError.message}`);
      }
      
      // الحصول على الرابط العام للوثيقة
      const { data: urlData } = await supabase.storage
        .from(BUCKETS.WALLET)
        .getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) {
        throw new Error('فشل في الحصول على رابط الوثيقة');
      }
      
      // تأكد من أن الرابط يبدأ بـ http
      let url = urlData.publicUrl;
      if (url && !url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      console.log('تم رفع وثيقة المحفظة بنجاح:', url);
      return url;
    } catch (error) {
      console.error('فشل في رفع وثيقة المحفظة:', error);
      throw error;
    }
  };

  // =========== Form Handling Functions ===========

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Save Button
  const handleSave = async () => {
    setSubmitting(true);
    setEditError('');
    
    try {
      console.log("بيانات النموذج قبل الحفظ:", editFormData);
      
      // استخراج المسارات النسبية للصور
      const profileImageUrl = editFormData.profile_image?.url || '';
      const additionalImageUrls = editFormData.additional_images?.map(img => img.url) || [];
      
      // تهيئة الكائن الذي سيتم حفظه في Firestore
      const playerDataToSave = {
        ...editFormData,
        profile_image_url: profileImageUrl,
        additional_image_urls: additionalImageUrls,
        
        // تحويل التاريخ إلى كائن تاريخ لـ Firestore إذا كان موجودًا
        birth_date: editFormData.birth_date ? new Date(editFormData.birth_date) : null,
        
        // إضافة طابع زمني للتحديث
        updated_at: new Date(),
      };
      
      // إزالة الحقول التي لا نريد حفظها في Firestore
      delete playerDataToSave.profile_image;
      delete playerDataToSave.additional_images;
      
      console.log("جاري حفظ البيانات في Firestore:", playerDataToSave);
      
      // حفظ البيانات في Firestore
      await setDoc(doc(db, 'players', user.uid), playerDataToSave, { merge: true });
      
      console.log("تم حفظ البيانات بنجاح");
      
      // تحديث بيانات النموذج المحلية
      setFormData({ ...editFormData });
      setIsEditing(false);
      setSuccessMessage('تم حفظ البيانات بنجاح');
      
      // إخفاء رسالة النجاح بعد 3 ثوانٍ
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      console.error("خطأ أثناء حفظ البيانات:", err);
      setEditError('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Cancel button
  const handleCancel = () => {
    setEditFormData({ ...formData });
    setIsEditing(false);
    setEditError('');
  };

  // =========== Media Handling Functions ===========

  // Add/remove images and videos
  const handleAddImage = (url) => {
    setEditFormData(prev => ({
      ...prev,
      additional_images: [...(prev.additional_images || []), { url }],
    }));
  };
  
  const handleRemoveImage = (idx) => {
    setEditFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== idx),
    }));
  };
  
  const handleAddVideo = (video) => {
    setEditFormData(prev => ({
      ...prev,
      videos: [...(prev.videos || []), video],
    }));
  };
  
  const handleRemoveVideo = (idx) => {
    setEditFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== idx),
    }));
  };
  
  // File upload handler for profile image
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingProfileImage(true);
    setFormErrors(prev => ({ ...prev, profileImage: '' }));
    
    try {
      const uploadedUrl = await uploadProfileImage(file, user.uid);
      setEditFormData(prev => ({ 
        ...prev, 
        profile_image: { url: uploadedUrl } 
      }));
    } catch (error) {
      console.error("فشل في رفع صورة البروفايل:", error);
      setFormErrors(prev => ({
        ...prev,
        profileImage: 'فشل في رفع الصورة الشخصية'
      }));
    } finally {
      setUploadingProfileImage(false);
    }
  };
  
  // File upload handler for additional images
  const handleAdditionalImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingAdditionalImages(prev => ({ ...prev, [idx]: true }));
    try {
      const uploadedUrl = await uploadAdditionalImage(file, user.uid, idx);
      
      // تحديث المصفوفة بالعنصر الجديد
      const updatedImages = [...editFormData.additional_images];
      updatedImages[idx] = { url: uploadedUrl };
      
      setEditFormData(prev => ({ 
        ...prev, 
        additional_images: updatedImages
      }));
    } catch (error) {
      console.error("فشل في رفع الصورة الإضافية:", error);
      setFormErrors(prev => ({
        ...prev,
        additionalImage: 'فشل في رفع الصورة الإضافية'
      }));
    } finally {
      setUploadingAdditionalImages(prev => {
        const updated = { ...prev };
        delete updated[idx];
        return updated;
      });
    }
  };
  
  // =========== Field Rendering Helpers ===========

  // Render input or value based on edit mode
  const renderField = (name, type = 'text') =>
    isEditing ? (
      <input
        type={type}
        name={name}
        value={editFormData[name] || ''}
        onChange={handleInputChange}
        className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
      />
    ) : (
      <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
        {formData[name] || 'غير محدد'}
      </div>
    );

  // Render textarea based on edit mode
  const renderTextarea = (name) =>
    isEditing ? (
      <textarea
        name={name}
        value={editFormData[name] || ''}
        onChange={handleInputChange}
        className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
      />
    ) : (
      <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
        {formData[name] || 'غير محدد'}
      </div>
    );

  // Helper to check if a video URL is embeddable
  const getVideoEmbed = (url) => {
    if (!url) return null;
    
    // YouTube
    const ytMatch = url.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})/);
    if (ytMatch) {
      return (
        <div className="flex items-center justify-center w-64 h-40 mx-auto overflow-hidden bg-black rounded-lg md:w-80 md:h-48">
          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytMatch[1]}`} frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
        </div>
      );
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo.com\/(\d+)/);
    if (vimeoMatch) {
      return (
        <div className="flex items-center justify-center w-64 h-40 mx-auto overflow-hidden bg-black rounded-lg md:w-80 md:h-48">
          <iframe src={`https://player.vimeo.com/video/${vimeoMatch[1]}`} width="100%" height="100%" frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
        </div>
      );
    }
    
    // mp4
    if (url.endsWith('.mp4')) {
      return (
        <div className="flex items-center justify-center w-64 h-40 mx-auto overflow-hidden bg-black rounded-lg md:w-80 md:h-48">
          <video src={url} controls className="object-cover w-full h-full rounded-lg" />
        </div>
      );
    }
    
    return null;
  };

  // =========== Section Renderers ===========

  // Render Personal Info Section
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">البيانات الشخصية</h2>
      
      {/* Profile Image */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">الصورة الشخصية</label>
        {isEditing ? (
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="flex-1"
            />
            {uploadingProfileImage && <span className="text-blue-600">جاري الرفع...</span>}
            {editFormData.profile_image?.url && (
              <img src={editFormData.profile_image.url} alt="Profile" className="object-cover w-24 h-24 rounded-full" />
            )}
          </div>
        ) : (
          formData.profile_image?.url ? (
            <img src={formData.profile_image.url} alt="Profile" className="object-cover w-24 h-24 rounded-full" />
          ) : (
            <span className="text-gray-400">لا توجد صورة شخصية</span>
          )
        )}
      </div>
      
      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
          {renderField('full_name')}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">تاريخ الميلاد</label>
          {renderField('birth_date', 'date')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">الجنسية</label>
          {renderField('nationality')}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">المدينة</label>
          {renderField('city')}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">الدولة</label>
          {renderField('country')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
          {renderField('phone')}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">رقم الواتساب</label>
          {renderField('whatsapp')}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
          {renderField('email')}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">نبذة عن اللاعب</label>
        {renderTextarea('brief')}
      </div>
    </div>
  );
  // Render Education Section
  const renderEducation = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">المعلومات التعليمية</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">المؤهل الدراسي</label>
          {isEditing ? (
            <select
              name="education_level"
              value={editFormData.education_level || ''}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
            >
              <option value="">اختر</option>
              {REFERENCE_DATA.educationLevels.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
              {formData.education_level || 'غير محدد'}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">سنة التخرج</label>
          {renderField('graduation_year')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">مستوى اللغة الإنجليزية</label>
          {isEditing ? (
            <select
              name="english_level"
              value={editFormData.english_level || ''}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
            >
              <option value="">اختر</option>
              {REFERENCE_DATA.languageLevels.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
              {formData.english_level || 'غير محدد'}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">مستوى اللغة العربية</label>
          {isEditing ? (
            <select
              name="arabic_level"
              value={editFormData.arabic_level || ''}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
            >
              <option value="">اختر</option>
              {REFERENCE_DATA.languageLevels.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
              {formData.arabic_level || 'غير محدد'}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">مستوى اللغة الإسبانية</label>
          {isEditing ? (
            <select
              name="spanish_level"
              value={editFormData.spanish_level || ''}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
            >
              <option value="">اختر</option>
              {REFERENCE_DATA.languageLevels.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
              {formData.spanish_level || 'غير محدد'}
            </div>
          )}
        </div>
      </div>
      
      {/* Training Courses */}
      <div>
        <label className="block text-sm font-medium text-gray-700">الدورات التدريبية</label>
        {isEditing ? (
          <div>
            {(editFormData.training_courses || []).map((course, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={course}
                  onChange={e => {
                    const updated = [...editFormData.training_courses];
                    updated[idx] = e.target.value;
                    setEditFormData({ ...editFormData, training_courses: updated });
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <button 
                  type="button" 
                  onClick={() => {
                    const updated = [...editFormData.training_courses];
                    updated.splice(idx, 1);
                    setEditFormData({ ...editFormData, training_courses: updated });
                  }} 
                  className="p-1 text-red-500 rounded bg-red-50 hover:bg-red-100"
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => setEditFormData({ 
                ...editFormData, 
                training_courses: [...(editFormData.training_courses || []), ''] 
              })} 
              className="flex items-center mt-2 text-blue-600 hover:text-blue-700"
            >
              <Plus size={16} className="mr-1" /> إضافة دورة
            </button>
          </div>
        ) : (
          <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
            {(formData.training_courses || []).length === 0 ? 
              'لا توجد دورات' : 
              formData.training_courses.map((course, idx) => (
                <div key={idx} className="py-1">
                  {idx + 1}. {course}
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );

  // Render Medical Record Section
  const renderMedicalRecord = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">السجل الطبي</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">فصيلة الدم</label>
          {isEditing ? (
            <select
              name="blood_type"
              value={editFormData.blood_type || ''}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
            >
              <option value="">اختر</option>
              {REFERENCE_DATA.bloodTypes.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
              {formData.blood_type || 'غير محدد'}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">الطول (سم)</label>
          {renderField('height', 'number')}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">الوزن (كجم)</label>
          {renderField('weight', 'number')}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">الأمراض المزمنة</label>
        {renderTextarea('chronic_details')}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">الإصابات السابقة</label>
        {renderTextarea('injuries')}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">الحساسية</label>
        {renderTextarea('allergies')}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">ملاحظات طبية أخرى</label>
        {renderTextarea('medical_notes')}
      </div>
    </div>
  );

  // Render Sports Info Section
  const renderSportsInfo = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">المعلومات الرياضية</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">المركز الأساسي</label>
          {isEditing ? (
            <select
              name="primary_position"
              value={editFormData.primary_position || ''}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
            >
              <option value="">اختر</option>
              {REFERENCE_DATA.positions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
              {formData.primary_position || 'غير محدد'}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">المركز الثانوي</label>
          {isEditing ? (
            <select
              name="secondary_position"
              value={editFormData.secondary_position || ''}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
            >
              <option value="">اختر</option>
              {REFERENCE_DATA.positions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
              {formData.secondary_position || 'غير محدد'}
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">القدم المفضلة</label>
        {isEditing ? (
          <select
            name="preferred_foot"
            value={editFormData.preferred_foot || ''}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
          >
            <option value="">اختر</option>
            {REFERENCE_DATA.footPreferences.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
            {formData.preferred_foot || 'غير محدد'}
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">الأندية السابقة</label>
        {renderTextarea('previous_clubs')}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">عدد سنوات الخبرة</label>
        {renderField('experience_years', 'number')}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">ملاحظات رياضية أخرى</label>
        {renderTextarea('sports_notes')}
      </div>
    </div>
  );
  // Render Skills Section
  const renderSkills = () => {
    return (
      <div className="space-y-8">
        <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">المهارات والقدرات</h2>
        
        {/* Technical Skills */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            { key: 'ball_control', label: 'التحكم بالكرة' },
            { key: 'passing', label: 'التمرير' },
            { key: 'shooting', label: 'التسديد' },
            { key: 'dribbling', label: 'المراوغة' }
          ].map(skill => (
            <div key={skill.key}>
              <div className="flex justify-between mb-1 text-sm text-gray-600">
                <span>{skill.label}</span>
                <span>
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editFormData.technical_skills?.[skill.key] || ''}
                      onChange={e => {
                        setEditFormData(prev => ({
                          ...prev,
                          technical_skills: {
                            ...prev.technical_skills,
                            [skill.key]: e.target.value
                          }
                        }));
                      }}
                      className="w-16 p-1 border rounded"
                    />
                  ) : (
                    (formData.technical_skills?.[skill.key] || 'غير محدد') + '/5'
                  )}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-lg">
                <div
                  className="h-full bg-blue-600 rounded-lg"
                  style={{ 
                    width: `${((isEditing 
                      ? editFormData.technical_skills?.[skill.key] 
                      : formData.technical_skills?.[skill.key]) || 0) * 20}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Physical Skills */}
        <div>
          <h3 className="mb-4 text-lg font-medium">المهارات البدنية</h3>
          <div className="space-y-4">
            {[
              { key: 'speed', label: 'السرعة' },
              { key: 'strength', label: 'القوة البدنية' },
              { key: 'stamina', label: 'التحمل' },
              { key: 'agility', label: 'الرشاقة' },
              { key: 'balance', label: 'التوازن' },
              { key: 'flexibility', label: 'المرونة' }
            ].map(skill => (
              <div key={skill.key}>
                <div className="flex justify-between mb-1 text-sm text-gray-600">
                  <span>{skill.label}</span>
                  <span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={editFormData.physical_skills?.[skill.key] || ''}
                        onChange={e => {
                          setEditFormData(prev => ({
                            ...prev,
                            physical_skills: {
                              ...prev.physical_skills,
                              [skill.key]: e.target.value
                            }
                          }));
                        }}
                        className="w-16 p-1 border rounded"
                      />
                    ) : (
                      (formData.physical_skills?.[skill.key] || 'غير محدد') + '/5'
                    )}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-lg">
                  <div
                    className="h-full bg-green-600 rounded-lg"
                    style={{ 
                      width: `${((isEditing 
                        ? editFormData.physical_skills?.[skill.key] 
                        : formData.physical_skills?.[skill.key]) || 0) * 20}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Social Skills */}
        <div>
          <h3 className="mb-4 text-lg font-medium">المهارات الاجتماعية</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { key: 'teamwork', label: 'العمل الجماعي' },
              { key: 'communication', label: 'التواصل' },
              { key: 'discipline', label: 'الانضباط' },
              { key: 'self_confidence', label: 'الثقة بالنفس' },
              { key: 'pressure_handling', label: 'تحمل الضغط' },
              { key: 'punctuality', label: 'الالتزام بالمواعيد' }
            ].map(skill => (
              <div key={skill.key}>
                <div className="flex justify-between mb-1 text-sm text-gray-600">
                  <span>{skill.label}</span>
                  <span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={editFormData.social_skills?.[skill.key] || ''}
                        onChange={e => {
                          setEditFormData(prev => ({
                            ...prev,
                            social_skills: {
                              ...prev.social_skills,
                              [skill.key]: e.target.value
                            }
                          }));
                        }}
                        className="w-16 p-1 border rounded"
                      />
                    ) : (
                      (formData.social_skills?.[skill.key] || 'غير محدد') + '/5'
                    )}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-lg">
                  <div
                    className="h-full bg-purple-600 rounded-lg"
                    style={{ 
                      width: `${((isEditing 
                        ? editFormData.social_skills?.[skill.key] 
                        : formData.social_skills?.[skill.key]) || 0) * 20}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Skill Radar Chart */}
        {!isEditing && (
          <div className="p-4 mt-8 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-medium text-center">مخطط المهارات</h3>
            <div className="h-80">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                width={500}
                height={300}
                data={[
                  { subject: 'التحكم بالكرة', A: formData.technical_skills?.ball_control || 0 },
                  { subject: 'التمرير', A: formData.technical_skills?.passing || 0 },
                  { subject: 'التسديد', A: formData.technical_skills?.shooting || 0 },
                  { subject: 'المراوغة', A: formData.technical_skills?.dribbling || 0 },
                  { subject: 'السرعة', A: formData.physical_skills?.speed || 0 },
                  { subject: 'القوة', A: formData.physical_skills?.strength || 0 },
                  { subject: 'التحمل', A: formData.physical_skills?.stamina || 0 }
                ]}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar name="المهارات" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Objectives Section
  const renderObjectives = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">الأهداف والطموحات</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">الأهداف المهنية</h3>
          
          <div className="space-y-2">
            {Object.entries({
              professional: 'الاحتراف الكامل',
              trials: 'معايشات احترافية',
              local_leagues: 'المشاركة في دوريات محلية',
              arab_leagues: 'المشاركة في دوريات عربية',
              european_leagues: 'المشاركة في دوريات أوروبية',
              training: 'تدريبات احترافية'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.objectives[key]}
                  onChange={(e) => setFormData({
                    ...formData,
                    objectives: {
                      ...formData.objectives,
                      [key]: e.target.checked
                    }
                  })}
                  className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={submitting}
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Other Objectives */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            أهداف أخرى
          </label>
          <textarea
            value={formData.objectives.other}
            onChange={(e) => setFormData({
              ...formData,
              objectives: {
                ...formData.objectives,
                other: e.target.value
              }
            })}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            rows={4}
            placeholder="اكتب هنا أي أهداف أو طموحات إضافية..."
            disabled={submitting}
          />
          <p className="mt-2 text-sm text-gray-500">
            يمكنك كتابة أي أهداف أخرى لم يتم ذكرها أعلاه
          </p>
        </div>
      </div>
    </div>
  );

  // Render Media Section
  const renderMedia = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">
        الصور والفيديوهات
      </h2>

      {/* Additional Images */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          صور إضافية (حتى 5 صور)
        </label>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {formData.additional_images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={typeof image === 'string' ? image : image.url}
                alt={`Additional ${index + 1}`}
                className="object-cover w-full h-32 rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  const newImages = formData.additional_images.filter((_, i) => i !== index);
                  setFormData({...formData, additional_images: newImages});
                }}
                className="absolute p-1 text-white bg-red-500 rounded-full top-1 left-1 hover:bg-red-600"
                disabled={submitting}
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
          {formData.additional_images.length < 5 && (
            <div className="p-4 border-2 border-gray-300 border-dashed rounded-lg">
              <input
                type="file"
                id="additional_images"
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files[0]) {
                    try {
                      const uploadedUrl = await uploadAdditionalImage(e.target.files[0], user.uid);
                      setFormData({
                        ...formData,
                        additional_images: [...formData.additional_images, { url: uploadedUrl }]
                      });
                    } catch (error) {
                      console.error("Error uploading image:", error);
                      setFormErrors(prev => ({
                        ...prev,
                        additionalImage: 'فشل في رفع الصورة'
                      }));
                    }
                  }
                }}
                disabled={submitting}
              />
              <label
                htmlFor="additional_images"
                className="flex flex-col items-center justify-center h-full cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">إضافة صورة</span>
              </label>
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          يمكنك إضافة حتى 5 صور إضافية لإظهار مهاراتك ولحظاتك المميزة
        </p>
      </div>

      {/* Videos */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          روابط الفيديو (حتى 5 روابط)
        </label>
        <div className="space-y-2">
          {formData.videos.map((video, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={video.url}
                onChange={(e) => {
                  const newVideos = [...formData.videos];
                  newVideos[index] = { ...video, url: e.target.value };
                  setFormData({ ...formData, videos: newVideos });
                }}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="رابط الفيديو (YouTube أو مشابه)"
                disabled={submitting}
              />
              <input
                type="text"
                value={video.description}
                onChange={(e) => {
                  const newVideos = [...formData.videos];
                  newVideos[index] = { ...video, description: e.target.value };
                  setFormData({ ...formData, videos: newVideos });
                }}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="وصف الفيديو"
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => {
                  const newVideos = formData.videos.filter((_, i) => i !== index);
                  setFormData({ ...formData, videos: newVideos });
                }}
                className="p-2 text-red-500 hover:text-red-700"
                disabled={submitting}
              >
                <Trash size={20} />
              </button>
            </div>
          ))}
          {formData.videos.length < 5 && (
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                videos: [...formData.videos, { url: '', description: '' }]
              })}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              disabled={submitting}
            >
              <Plus size={20} />
              <span>إضافة رابط فيديو</span>
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          أضف روابط لفيديوهات تظهر مهاراتك في الملعب أو لقطات من المباريات
        </p>
      </div>
    </div>
  );
  
  
  // Main Component Return
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
        {/* Loading Overlay */}
        {submitting && <LoadingSpinner />}

        {/* Success Message */}
        {successMessage && <SuccessMessage message={successMessage} />}

        {/* Error Message */}
        {Object.keys(formErrors).length > 0 && (
          <ErrorMessage message={Object.values(formErrors)[0]} />
        )}

        <header className="py-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">نموذج تسجيل لاعب كرة القدم</h1>
              {user && (
                <div className="flex items-center gap-4">
                  <p className="text-blue-100">مرحباً {user.email}</p>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50"
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4" />
                        إلغاء التعديل
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        تعديل البيانات
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="container px-4 py-8 mx-auto">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }} className="p-6 bg-white rounded-lg shadow-lg">
            {/* Progress Steps */}
            <ProgressSteps currentStep={currentStep} />

            {/* Form Sections */}
            {currentStep === STEPS.PERSONAL && renderPersonalInfo()}
            {currentStep === STEPS.EDUCATION && renderEducation()}
            {currentStep === STEPS.MEDICAL && renderMedicalRecord()}
            {currentStep === STEPS.SPORTS && renderSportsInfo()}
            {currentStep === STEPS.SKILLS && renderSkills()}
            {currentStep === STEPS.OBJECTIVES && renderObjectives()}
            {currentStep === STEPS.MEDIA && renderMedia()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex items-center"
                >
                  <ChevronRight className="ml-2" />
                  السابق
                </Button>
              )}
              {currentStep < Object.keys(STEP_TITLES).length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex items-center"
                >
                  التالي
                  <ChevronLeft className="mr-2" />
                </Button>
              ) : (
                <div className="flex gap-4">
                  {isEditing && (
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center"
                    >
                      <X className="mr-2" />
                      إلغاء
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center"
                  >
                    {submitting ? 'جاري الحفظ...' : 'حفظ البيانات'}
                    <Check className="mr-2" />
                  </Button>
                </div>
              )}
            </div>
          </form>
        </main>

        {/* Footer */}
        <footer className="py-8 mt-12 text-white bg-gray-800">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <h3 className="mb-4 text-lg font-semibold">روابط مهمة</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-blue-400">الشروط والأحكام</a></li>
                  <li><a href="#" className="hover:text-blue-400">سياسة الخصوصية</a></li>
                  <li><a href="#" className="hover:text-blue-400">الأسئلة الشائعة</a></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold">تواصل معنا</h3>
                <ul className="space-y-2">
                  <li>البريد الإلكتروني: support@example.com</li>
                  <li>الهاتف: +966 55 555 5555</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold">تابعنا</h3>
                <div className="flex space-x-4">
                  {/* Add social media icons/links here */}
                </div>
              </div>
            </div>
            <div className="pt-8 mt-8 text-center border-t border-gray-700">
              <p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة</p>
            </div>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
};

// Phone icon component as it was not imported at the top
const Phone = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

// FileText icon component as it was not imported at the top
const FileText = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
