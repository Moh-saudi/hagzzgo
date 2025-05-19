'use client';

import React, { useState, useEffect } from 'react';

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

// Success Message Component
const SuccessMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-x-0 top-0 z-50 p-4">
    <div className="w-full max-w-md p-4 mx-auto bg-green-100 rounded-lg shadow-lg">
      <div className="flex items-center">
        <Check className="w-5 h-5 mr-2 text-green-500" />
        <p className="text-green-700">{message}</p>
      </div>
    </div>
  </div>
);
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Check, Upload, Plus, Trash, X } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

// Supabase Client
import { createClient } from '@supabase/supabase-js';

// Types
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

interface PlayerState {
  full_name: string;
  birth_date: string | null;
  nationality: string;
  city: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  brief: string;
  education_level: string;
  graduation_year: string;
  english_level: string;
  arabic_level: string;
  spanish_level: string;
  blood_type: string;
  height: string;
  weight: string;
  chronic_details: string;
  injuries: string;
  allergies: string;
  medical_notes: string;
  primary_position: string;
  secondary_position: string;
  preferred_foot: string;
  previous_clubs: string;
  experience_years: string;
  sports_notes: string;
  technical_skills: Record<string, unknown>;
  physical_skills: Record<string, unknown>;
  social_skills: Record<string, unknown>;
  objectives: Record<string, unknown>;
  profile_image: null | { url: string };
  additional_images: Array<{ url: string }>;
  videos: Array<string>;
  training_courses: Array<string>;
  created_at?: Date;
  updated_at?: Date;
}

interface FormErrors {
  fetch?: string;
  submit?: string;
  profileImage?: string;
  additionalImage?: string;
  video?: string;
  general?: string;
  [key: string]: string | undefined;
}

interface PlayerFormData extends Omit<PlayerState, 'birth_date'> {
  birth_date: string | null;
  updated_at?: Date;
}

// Constants
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

// Helper function to combine classes
const classNames = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Supabase Setup with Type Safety
const initSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
};

const supabase = initSupabase();

export default function PlayerProfile() {
  console.log('PlayerProfile: component start');
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  console.log('PlayerProfile: auth state', { user, loading, error });

  const [currentStep, setCurrentStep] = useState(STEPS.PERSONAL);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [playerData, setPlayerData] = useState<PlayerState | null>(null);
  const [formData, setFormData] = useState<PlayerFormData>({
      full_name: '',
      birth_date: null,
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
      injuries: '',
      allergies: '',
      medical_notes: '',
      primary_position: '',
      secondary_position: '',
      preferred_foot: '',
      previous_clubs: '',
      experience_years: '',
      sports_notes: '',
      technical_skills: {},
      physical_skills: {},
      social_skills: {},
      objectives: {},
      profile_image: null,
      additional_images: [],
      videos: [],
      training_courses: [],
    });
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<PlayerFormData>({
    full_name: '',
    birth_date: null,
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
    injuries: '',
    allergies: '',
    medical_notes: '',
    primary_position: '',
    secondary_position: '',
    preferred_foot: '',
    previous_clubs: '',
    experience_years: '',
    sports_notes: '',
    technical_skills: {},
    physical_skills: {},
    social_skills: {},
    objectives: {},
    profile_image: null,
    additional_images: [],
    videos: [],
    training_courses: [],
  });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadingAdditionalImages, setUploadingAdditionalImages] = useState<Record<string, boolean>>({});

  console.log('PlayerProfile: state initialized', { isLoading, playerData, formData });

  // Get player data on component mount
  useEffect(() => {
    console.log('PlayerProfile: useEffect triggered', { user, loading });
    if (!loading && user) {
      console.log("User loaded, fetching player data");
      fetchPlayerData();
    } else if (!loading && !user) {
      console.log("No user found, redirecting to login");
      router.push('/auth/login');
    }
  }, [user, loading]);

  // Initialize edit form data when player data is loaded
  useEffect(() => {
    console.log('PlayerProfile: playerData changed', { playerData });
    if (playerData) {
      setEditFormData({ ...defaultPlayerFields, ...playerData });
    }
  }, [playerData]);

  console.log('PlayerProfile: before render', { loading, isLoading, error, playerData });

  if (loading || isLoading) {
    console.log('PlayerProfile: Rendering loading state');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error || (formErrors && 'fetch' in formErrors)) {
    console.log('PlayerProfile: Rendering error state', error, formErrors.fetch);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-red-600">حدث خطأ</h2>
          <p className="mb-6 text-gray-600">{error?.message || formErrors.fetch}</p>
          <Button onClick={() => router.push('/auth/login')} className="text-white bg-blue-600 hover:bg-blue-700">
            العودة إلى صفحة تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('PlayerProfile: No user found, redirecting to login');
    router.push('/auth/login');
    return null;
  }

  console.log('PlayerProfile: Rendering main form');
  // =========== Supabase Storage Functions ===========
  
  /**
   * رفع صورة البروفايل إلى bucket للصور الشخصية
   * @param {File} file - ملف الصورة
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<string>} - رابط الصورة
   */
  const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
    try {
      // تحديد امتداد الملف
      const fileExt = file.name.split('.').pop();
      // إنشاء مسار فريد للملف
      const filePath = `${userId}/profile.${fileExt}`;
      
      // رفع الملف إلى bucket avatars
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) {
        console.error('خطأ أثناء رفع صورة البروفايل:', uploadError.message);
        throw uploadError;
      }
      
      // الحصول على الرابط العام للصورة
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // تأكد من أن الرابط يبدأ بـ http
      let url = data.publicUrl;
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

  /**
   * رفع صورة إضافية إلى bucket للصور الإضافية
   * @param {File} file - ملف الصورة
   * @param {string} userId - معرف المستخدم
   * @param {number} idx - فهرس الصورة (اختياري)
   * @returns {Promise<string>} - رابط الصورة
   */
  const uploadAdditionalImage = async (file: File, userId: string, idx: number = Date.now()): Promise<string> => {
    try {
      // تحديد امتداد الملف
      const fileExt = file.name.split('.').pop();
      // إنشاء مسار فريد للملف باستخدام الطابع الزمني
      const filePath = `${userId}/additional_${Date.now()}_${idx}.${fileExt}`;
      
      // رفع الملف إلى bucket player-images
      const { error: uploadError } = await supabase.storage
        .from('player-images')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) {
        console.error('خطأ أثناء رفع صورة إضافية:', uploadError.message);
        throw uploadError;
      }
      
      // الحصول على الرابط العام للصورة
      const { data } = await supabase.storage
        .from('player-images')
        .getPublicUrl(filePath);
      
      // تأكد من أن الرابط يبدأ بـ http
      let url = data.publicUrl;
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

  // =========== Firestore Data Functions ===========

  /**
   * استرجاع بيانات اللاعب من Firestore و Supabase
   */
  const fetchPlayerData = async () => {
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
        
        // معالجة الصور والروابط
        let profileImageUrl = data.profile_image_url || '';
        let additionalImagesUrls = data.additional_image_urls || [];
        
        // دمج البيانات
        interface MergedData extends PlayerState {
          birth_date: string;
          profile_image: { url: string } | null;
          additional_images: Array<{ url: string }>;
        }

        interface FirestoreData extends Omit<PlayerState, 'birth_date' | 'profile_image' | 'additional_images'> {
          birth_date: { toDate(): Date };
          profile_image_url?: string;
          additional_image_urls?: string[];
        }

        interface MergedData extends PlayerState {
          birth_date: string;
          profile_image: { url: string } | null;
          additional_images: Array<{ url: string }>;
        }

        interface FirestoreData extends Omit<PlayerState, 'birth_date' | 'profile_image' | 'additional_images'> {
          birth_date: { toDate(): Date };
          profile_image_url?: string;
          additional_image_urls?: string[];
        }

        interface BasePlayerData {
          // Base fields from defaultPlayerFields
          full_name: string;
          nationality: string;
          city: string;
          country: string;
          phone: string;
          whatsapp: string;
          email: string;
          brief: string;
          education_level: string;
          graduation_year: string;
          english_level: string;
          arabic_level: string;
          spanish_level: string;
          blood_type: string;
          height: string;
          weight: string;
          chronic_details: string;
          primary_position: string;
          secondary_position: string;
          preferred_foot: string;
          technical_skills: Record<string, unknown>;
          physical_skills: Record<string, unknown>;
          social_skills: Record<string, unknown>;
          objectives: Record<string, unknown>;
        }

        interface ImageData {
          url: string;
        }

        interface FirestoreData extends BasePlayerData {
          birth_date: { toDate(): Date };
          profile_image_url?: string;
          additional_image_urls?: string[];
        }

        interface MergedData extends BasePlayerData {
          birth_date: string;
          profile_image: ImageData | null;
          additional_images: ImageData[];
        }

        const mergedData: MergedData = {
          ...defaultPlayerFields,
          ...(data as FirestoreData),
          birth_date: data.birth_date ? new Date(data.birth_date.toDate()).toISOString().split('T')[0] : '',
          profile_image: profileImageUrl ? { url: profileImageUrl } : null,
          additional_images: additionalImagesUrls.map((url: string) => ({ url })),
        };
        
        console.log("Merged player data:", mergedData);
        
        setPlayerData(mergedData);
        setFormData(mergedData);
      } else {
        console.log("No player data found in Firestore");
        // إذا لم يتم العثور على بيانات، قم بإنشاء وثيقة جديدة
        const newPlayerData: PlayerState = {
          ...defaultPlayerFields,
          injuries: '',
          allergies: '',
          medical_notes: '',
          previous_clubs: '',
          experience_years: '',
          sports_notes: '',
          birth_date: null,
          created_at: new Date(),
          updated_at: new Date(),
        };
        
        try {
          await setDoc(playerRef, newPlayerData);
          console.log("Created new player document");
          setPlayerData(newPlayerData);
          setFormData(newPlayerData);
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
  };

  // =========== Form Handling Functions ===========

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Save Button
  const handleSave = async () => {
    setEditLoading(true);
    setEditError('');
    
    try {
      console.log("بيانات النموذج قبل الحفظ:", editFormData);
      
      // استخراج المسارات النسبية للصور
      const profileImageUrl = editFormData.profile_image?.url || '';
      const additionalImageUrls = editFormData.additional_images?.map(img => img.url) || [];
      
      // تهيئة الكائن الذي سيتم حفظه في Firestore
      const playerDataToSave: Partial<typeof editFormData> = {
        ...editFormData,
        profile_image: profileImageUrl ? { url: profileImageUrl } : null,
        additional_images: additionalImageUrls.map(url => ({ url })),
        
        // تحويل التاريخ إلى كائن تاريخ لـ Firestore إذا كان موجودًا
        birth_date: editFormData.birth_date ? editFormData.birth_date : null,
        
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
      setEditLoading(false);
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
  const handleAddImage = (url: string) => {
    setEditFormData(prev => ({
      ...prev,
      additional_images: [...(prev.additional_images || []), { url }],
    }));
  };
  
  const handleRemoveImage = (idx: number) => {
    setEditFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== idx),
    }));
  };
  
  const handleAddVideo = (video: string) => {
    setEditFormData(prev => ({
      ...prev,
      videos: [...(prev.videos || []), video],
    }));
  };
  
  const handleRemoveVideo = (idx: number) => {
    setEditFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== idx),
    }));
  };
  
  // File upload handler for profile image
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingProfileImage(true);
    try {
      const path = `profiles/${user.uid}/${Date.now()}_${file.name}`;
      const url = await handleImageUpload(file, 'player-images', path);
      
      setEditFormData(prev => ({
        ...prev,
        profile_image: { url }
      }));
    } catch (error) {
      console.error('فشل في رفع صورة البروفايل:', error);
      setFormErrors(prev => ({
        ...prev,
        profileImage: 'فشل في رفع الصورة الشخصية'
      }));
    } finally {
      setUploadingProfileImage(false);
    }
  };
  
  // File upload handler for additional images
  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingAdditionalImages(prev => ({ ...prev, new: true }));
    try {
      const path = `additional/${user.uid}/${Date.now()}_${file.name}`;
      const url = await handleImageUpload(file, 'player-images', path);
      
      setEditFormData(prev => ({
        ...prev,
        additional_images: [...(prev.additional_images || []), { url }]
      }));
    } catch (error) {
      console.error('فشل في رفع الصورة الإضافية:', error);
      setFormErrors(prev => ({
        ...prev,
        additionalImage: 'فشل في رفع الصورة الإضافية'
      }));
    } finally {
      setUploadingAdditionalImages(prev => {
        const updated = { ...prev };
        delete updated.new;
        return updated;
      });
    }
  };
  
  /**
   * معالج رفع الصور إلى Supabase
   */
  const handleImageUpload = async (file: File, bucket: string, path: string) => {
    try {
      // التحقق من الملف
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('يجب أن يكون الملف صورة');
      }

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // =========== Field Rendering Helpers ===========

  // Render input or value based on edit mode
  const renderField = (name: keyof PlayerState, type: string = 'text') =>
    isEditing ? (
      <input
        type={type}
        name={name}
        value={typeof editFormData[name] === 'string' ? editFormData[name] as string : ''}
        onChange={handleInputChange}
        className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
      />
    ) : (
      <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
        {typeof formData[name] === 'string' ? formData[name] as string : 
         typeof formData[name] === 'object' ? JSON.stringify(formData[name]) : 'غير محدد'}
      </div>
    );

  // Render textarea based on edit mode
  const renderTextarea = (name: keyof PlayerState) =>
    isEditing ? (
      <textarea
        name={name}
        value={typeof editFormData[name] === 'string' ? editFormData[name] as string : ''}
        onChange={handleInputChange}
        className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
      />
    ) : (
      <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
        {typeof formData[name] === 'string' ? formData[name] as string :
         typeof formData[name] === 'object' ? JSON.stringify(formData[name]) :
         'غير محدد'}
      </div>
    );

  // Helper to check if a video URL is embeddable
  const getVideoEmbed = (url: string) => {
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
 const renderSkills = () => (
   <div className="space-y-8">
     <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">المهارات والقدرات</h2>
     <div>skills placeholder</div>
   </div>
 );

 // Render Objectives Section
 const renderObjectives = () => (
   <div className="space-y-6">
     <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">الأهداف والطموحات</h2>
     <div>objectives placeholder</div>
   </div>
 );

 // Render Media Section
 const renderMedia = () => (
   <div className="space-y-6">
     <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">الصور والفيديوهات</h2>
     <div>media placeholder</div>
   </div>
 );
 
 
 // Main Component Return
 console.log('PlayerProfile: Rendering main form');
 return (
   <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
     {/* Loading Overlay */}
     {submitting && <LoadingSpinner />}

     {/* Success Message */}
     {successMessage && <SuccessMessage message={successMessage} />}

     <header className="py-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
       <div className="container px-4 mx-auto">
         <h1 className="text-3xl font-bold text-center">نموذج تسجيل لاعب كرة القدم</h1>
         {user && (
           <p className="mt-2 text-center text-blue-100">
             مرحباً {user.email}
           </p>
         )}
       </div>
     </header>

     <main className="container px-4 py-8 mx-auto">
       {formErrors.submit && <ErrorMessage message={formErrors.submit} />}

       <form className="p-6 bg-white rounded-lg shadow-lg">
         {/* Progress Steps */}
         <div className="mb-8">
           {/* Progress Steps Content */}
         </div>

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
           {/* Navigation Buttons Content */}
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
 );
}

// Phone icon component
interface PhoneIconProps extends React.SVGProps<SVGSVGElement> {
  // Extends built-in SVG props
}

const Phone = (props: React.SVGProps<SVGSVGElement>) => (
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


// FileText icon component
const FileText = (props: React.SVGProps<SVGSVGElement>) => (
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

// Error Message Component (missing from original)
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
 <div className="p-4 mb-4 bg-red-100 border border-red-400 rounded-md">
   <div className="flex items-center">
     <X className="w-5 h-5 mr-2 text-red-500" />
     <p className="text-red-700">{message}</p>
   </div>
 </div>
);
