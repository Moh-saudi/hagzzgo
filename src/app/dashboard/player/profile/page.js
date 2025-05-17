'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import Link from 'next/link';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Tab } from '@headlessui/react';
import { 
  User, GraduationCap, HeartPulse, Dumbbell, Star, Target, 
  Image as ImageIcon, ChevronRight, ChevronLeft, Check, Upload, 
  Plus, Trash, X, Home, CreditCard, LogOut, Mail, Flag 
} from 'lucide-react';

// UI Components
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
=======

// Firebase Imports
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';


// UI Components & Icons
import { ChevronRight, ChevronLeft, Check, Upload, Plus, Trash, X } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6

// Recharts Components
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

<<<<<<< HEAD
// Supabase Client
import { createClient } from '@supabase/supabase-js';

// Lightbox para Imágenes
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import ReactPlayer from 'react-player';

// Initialize Supabase
const supabaseUrl = 'https://ekyerljzfokqimbabzxm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVreWVybGp6Zm9rcWltYmFienhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTcyODMsImV4cCI6MjA2MjIzMzI4M30.Xd6Cg8QUISHyCG-qbgo9HtWUZz6tvqAqG6KKXzuetBY';
const supabase = createClient(supabaseUrl, supabaseKey);
=======

// Azure Configuration
const AZURE_CONFIG = {
  accountName: process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME,
  sasToken: process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN,
  containerName: process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME
};

// Azure Upload Function
async function uploadFileToAzure(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('فشل في رفع الملف');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('خطأ في رفع الملف:', error);
    throw error;
  }
}





export function AuthProvider({ children }) {
  // ... AuthProvider code
}


>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6

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

<<<<<<< HEAD
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
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const PlayerProfile = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
=======
const PlayerRegistrationForm = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth); // ✅ ضعه هنا
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
  const [currentStep, setCurrentStep] = useState(STEPS.PERSONAL);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(true);
  const [playerData, setPlayerData] = useState(null);
  const [formData, setFormData] = useState({ ...defaultPlayerFields });
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadingAdditionalImages, setUploadingAdditionalImages] = useState({});

  // =========== Supabase Storage Functions ===========
  
  /**
   * رفع صورة البروفايل إلى bucket للصور الشخصية
   * @param {File} file - ملف الصورة
   * @param {string} userId - معرف المستخدم
   * @returns {Promise<string>} - رابط الصورة
   */
  const uploadProfileImage = async (file, userId) => {
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
  const uploadAdditionalImage = async (file, userId, idx = Date.now()) => {
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
=======
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  

 


  // Initial Form State
  const [formData, setFormData] = useState({
    // Personal Information
    profile_image: null,
    full_name: '',
    birth_date: '',
    nationality: '',
    city: '',
    country: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    brief: '',

    // Education
    education_level: '',
    graduation_year: '',
    degree: '',
    english_level: '',
    spanish_level: '',
    arabic_level: '',
    courses: [],

    // Medical Record
    blood_type: '',
    chronic_conditions: false,
    chronic_details: '',
    injuries: [],
    surgeries: [],
    height: '',
    weight: '',

    // Sports Information
    primary_position: '',
    secondary_position: '',
    preferred_foot: '',
    club_history: [],

    // Technical Skills
    technical_skills: {
      ball_control: 3,
      passing: 3,
      shooting: 3,
      dribbling: 3
    },
    
    // Physical Skills
    physical_skills: {
      speed: 3,
      strength: 3,
      stamina: 3,
      agility: 3,
      balance: 3,
      flexibility: 3
    },
    
    // Social Skills
    social_skills: {
      teamwork: 3,
      communication: 3,
      discipline: 3,
      self_confidence: 3,
      pressure_handling: 3,
      punctuality: 3
    },

    // Objectives
    objectives: {
      professional: false,
      trials: false,
      local_leagues: false,
      arab_leagues: false,
      european_leagues: false,
      training: false,
      other: ''
    },

    // Media
    additional_images: [],
    videos: []
  });

  // Authentication Check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

   // Loading State
   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin">
        </div>
      </div>
    );
  }
  
  

  // Form Validation
  const validateStep = (step) => {
    const errors = {};

    
    
    if (!user) {
      return <p>يجب تسجيل الدخول للوصول إلى هذه الصفحة.</p>; // عرض رسالة إذا لم يكن هناك مستخدم
    }
    
    
    switch(step) {
      case STEPS.PERSONAL: {
        if (!formData.full_name) errors.full_name = 'الاسم الكامل مطلوب';
        if (!formData.birth_date) errors.birth_date = 'تاريخ الميلاد مطلوب';
        if (!formData.nationality) errors.nationality = 'الجنسية مطلوبة';
        if (!formData.phone) errors.phone = 'رقم الهاتف مطلوب';
        if (!formData.brief) errors.brief = 'النبذة التعريفية مطلوبة';
        break;
      }

      case STEPS.EDUCATION: {
        if (!formData.education_level) errors.education_level = 'المؤهل الدراسي مطلوب';
        if (!formData.english_level) errors.english_level = 'مستوى اللغة الإنجليزية مطلوب';
        break;
      }

      case STEPS.MEDICAL: {
        if (formData.chronic_conditions && !formData.chronic_details) {
          errors.chronic_details = 'يرجى تحديد تفاصيل الأمراض المزمنة';
        }
        if (!formData.height) errors.height = 'الطول مطلوب';
        if (!formData.weight) errors.weight = 'الوزن مطلوب';
        break;
      }

      case STEPS.SPORTS: {
        if (!formData.primary_position) errors.primary_position = 'المركز الأساسي مطلوب';
        if (!formData.preferred_foot) errors.preferred_foot = 'القدم المفضلة مطلوبة';
        break;
      }

      case STEPS.MEDIA: {
        if (!formData.profile_image) {
          errors.profile_image = 'الصورة الشخصية مطلوبة';
        }
        formData.videos.forEach((video, index) => {
          if (video.url && !isValidVideoUrl(video.url)) {
            errors[`video_${index}`] = 'رابط الفيديو غير صالح';
          }
        });
        break;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper Functions
  const isValidVideoUrl = (url) => {
    const videoPatterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/
    ];
    return videoPatterns.some(pattern => pattern.test(url));
  };

  // Navigation Handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  
  // Image Upload Function
  
  // دالة uploadFileToAzure قبل تعريف المكون
async function uploadFileToAzure(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('فشل في رفع الملف');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('خطأ في رفع الملف:', error);
    throw error;
  }
}
  
  const uploadImage = async (file) => {
    if (!file) {
      console.error("❌ لا يوجد ملف للرفع!");
      return null;
    }
  
    try {
      console.log("🔵 جاري رفع الصورة إلى Azure...");
  
      // استخدام دالة الرفع من utils/upload.js
      const imageUrl = await uploadFileToAzure(file);
  
      if (!imageUrl) {
        throw new Error("❌ فشل في رفع الصورة!");
      }
  
      console.log("✅ تم رفع الصورة بنجاح:", imageUrl);
      return imageUrl; // إرجاع رابط الصورة لاستخدامه لاحقًا
    } catch (error) {
      console.error("❌ خطأ أثناء رفع الصورة:", error);
      return null;
    }
  };
  

  
  const testAzureConnection = async () => {
    try {
      const { accountName, sasToken, containerName } = AZURE_CONFIG;
  
      if (!accountName || !sasToken || !containerName) {
        throw new Error("🚨 متغيرات Azure غير معرفة");
      }
  
      const response = await fetch(
        `https://${accountName}.blob.core.windows.net/${containerName}?restype=container&comp=list&${sasToken}`
      );
      
      if (!response.ok) {
        throw new Error("🚨 فشل الاتصال بـ Azure Storage");
      }
      
      console.log("✅ الاتصال بـ Azure ناجح!");
    } catch (error) {
      console.error("❌ خطأ في الاتصال بـ Azure:", error);
    }
  };
  

  

  // Validate File Function

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
    if (!allowedTypes.includes(file.type)) {
      setFormErrors(prev => ({
        ...prev,
        file: 'نوع الملف غير مدعوم. يرجى استخدام JPG أو PNG أو WebP'
      }));
      return false;
    }
  
    if (file.size > maxSize) {
      setFormErrors(prev => ({
        ...prev,
        file: 'حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت'
      }));
      return false;
    }
  
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      alert('"يرجى إكمال جميع الحقول المطلوبة."');
      return;
    }

    // التحقق من أن المستخدم مسجّل الدخول
    if (!user?.uid) {
      setFormErrors(prev => ({
        ...prev,
        submit: 'يجب تسجيل الدخول قبل متابعة العملية.'
      }));
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
      return;
    }

    try {
<<<<<<< HEAD
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
        const mergedData = {
          ...defaultPlayerFields,
          ...data,
          birth_date: data.birth_date ? new Date(data.birth_date.toDate()).toISOString().split('T')[0] : '',
          profile_image: profileImageUrl ? { url: profileImageUrl } : null,
          additional_images: additionalImagesUrls.map(url => ({ url })),
        };
        
        console.log("Merged player data:", mergedData);
        
        setPlayerData(mergedData);
        setFormData(mergedData);
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

  // Get player data on component mount
  useEffect(() => {
    if (!loading && user) {
      console.log("User loaded, fetching player data");
      fetchPlayerData();
    }
  }, [user, loading]);

  // Initialize edit form data when player data is loaded
  useEffect(() => {
    if (playerData) {
      setEditFormData({ ...defaultPlayerFields, ...playerData });
    }
  }, [playerData]);

  // =========== Form Handling Functions ===========

  // Handle input changes
  const handleInputChange = (e) => {
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
=======
      setSubmitting(true);
      console.log("🔵 المستخدم الحالي:", user?.uid);

      // رفع صورة الملف الشخصي
      let profileImageUrl = null;
      if (formData.profile_image) {
        profileImageUrl = await uploadImage(formData.profile_image);
        if (!profileImageUrl) throw new Error('فشل في رفع الصورة الشخصية');
      }
      console.log("✅ تم رفع الصورة:", profileImageUrl);

      // رفع الصور الإضافية
      console.log("🔵 رفع الصور الإضافية...");
      const additionalImageUrls = [];
      if (formData.additional_images?.length) {
        for (const image of formData.additional_images) {
          const imageUrl = await uploadImage(image);
          if (imageUrl) additionalImageUrls.push(imageUrl);
        }
      }
      console.log("✅ تم رفع جميع الصور الإضافية:", additionalImageUrls);

      // تجهيز البيانات للتخزين في Firestore
      const { profile_image, additional_images, ...restFormData } = formData;
      
      const playerData = {
        ...restFormData,
        profile_image_url: profileImageUrl,
        additional_image_urls: additionalImageUrls,
        user_id: user.uid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // حفظ في Firestore
      console.log("🔵 حفظ البيانات في Firestore...");
      await setDoc(doc(db, 'players', user.uid), playerData);

      // رسالة النجاح
      console.log("✅ تم حفظ البيانات في Firestore.");
      setSuccessMessage('تم تسجيل بياناتك بنجاح! جاري تحويلك لصفحة الاشتراك...');

      // التحويل إلى صفحة الاشتراك
      setTimeout(() => {
        router.push("/dashboard/payment");
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors(prev => ({
        ...prev,
        submit: 'حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.'
      }));
    } finally {
      console.log("🔴 إيقاف التحميل...");
      setSubmitting(false);
    }
  };

  // Helper Components
  const LoadingSpinner = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 text-center bg-white rounded-lg">
        <div className="w-16 h-16 mx-auto border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <p className="mt-4 text-gray-600">جاري حفظ البيانات...</p>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
      </div>
    </div>
  );

<<<<<<< HEAD
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
=======
  const SuccessMessage = ({ message }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-md p-8 text-center bg-white rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-green-800">تم تسجيل بياناتك بنجاح!</h3>
        <p className="mb-4 text-gray-600">
          جاري تحويلك إلى صفحة الاشتراك للاستفادة من جميع المميزات...
        </p>
        <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
          <div className="h-full bg-green-500 animate-progress"></div>
        </div>
      </div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="p-4 border border-red-200 rounded-md bg-red-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <X className="w-5 h-5 text-red-400" />
        </div>
        <div className="mr-3">
          <p className="text-sm text-red-800">{message}</p>
        </div>
      </div>
    </div>
  );

  // Progress Steps Component
  const ProgressSteps = () => (
    <div className="mb-8">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-medium text-gray-800">
          {STEP_TITLES[currentStep]}
        </h3>
      </div>
      <div className="flex items-center justify-between">
        {Object.values(STEPS).map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === currentStep
                ? 'bg-blue-600 text-white'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? <Check size={16} /> : step}
          </div>
        ))}
      </div>
    </div>
  );

  // Navigation Buttons
  const NavigationButtons = () => (
    <div className="flex justify-between mt-8">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={handlePrevious}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          disabled={submitting}
        >
          <ChevronRight className="ml-2" />
          السابق
        </button>
      )}
      
      <button
        type={currentStep === Object.keys(STEPS).length ? "submit" : "button"}
        onClick={currentStep === Object.keys(STEPS).length ? undefined : handleNext}
        className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        disabled={submitting}
      >
        {currentStep === Object.keys(STEPS).length ? 'إرسال' : 'التالي'}
        <ChevronLeft className="mr-2" />
      </button>
    </div>
  );
  // Render Personal Information Section
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">
        البيانات الشخصية
      </h2>

      {/* Profile Image Upload */}
      <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
        <input
          type="file"
          id="profile_image"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              setFormData({ ...formData, profile_image: e.target.files[0] });
            }
          }}
          disabled={submitting}
        />
        <label 
          htmlFor="profile_image" 
          className={`cursor-pointer block ${submitting ? 'opacity-50' : ''}`}
        >
          {formData.profile_image ? (
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={URL.createObjectURL(formData.profile_image)}
                alt="Profile"
                className="object-cover w-full h-full rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100">
                <span className="text-sm text-white">تغيير الصورة</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <span className="block mt-2 text-sm text-gray-600">اختر صورة شخصية</span>
            </div>
          )}
        </label>
        {formErrors.profile_image && (
          <p className="mt-2 text-sm text-red-600">{formErrors.profile_image}</p>
        )}
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            الاسم الكامل <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className={`mt-1 block w-full rounded-md border ${
              formErrors.full_name ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            placeholder="الاسم الكامل"
            disabled={submitting}
          />
          {formErrors.full_name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.full_name}</p>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
          )}
        </div>

        <div>
<<<<<<< HEAD
          <label className="block text-sm font-medium text-gray-700">سنة التخرج</label>
          {renderField('graduation_year')}
=======
          <label className="block text-sm font-medium text-gray-700">
            تاريخ الميلاد <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.birth_date}
            onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
            className={`mt-1 block w-full rounded-md border ${
              formErrors.birth_date ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            disabled={submitting}
          />
          {formErrors.birth_date && (
            <p className="mt-1 text-sm text-red-600">{formErrors.birth_date}</p>
          )}
        </div>
      </div>

      {/* Location Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            الجنسية <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => setFormData({...formData, nationality: e.target.value})}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            placeholder="الجنسية"
            disabled={submitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            المدينة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            placeholder="المدينة"
            disabled={submitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            الدولة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            placeholder="الدولة"
            disabled={submitting}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 text-gray-500 border border-l-0 border-gray-300 rounded-r-md bg-gray-50">
              +966
            </span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="flex-1 p-2 border border-gray-300 rounded-none rounded-l-md"
              placeholder="5XXXXXXXX"
              disabled={submitting}
            />
          </div>
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            رقم الواتساب
          </label>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 text-gray-500 border border-l-0 border-gray-300 rounded-r-md bg-gray-50">
              +966
            </span>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              className="flex-1 p-2 border border-gray-300 rounded-none rounded-l-md"
              placeholder="5XXXXXXXX"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            placeholder="example@domain.com"
            disabled={submitting}
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700">العنوان</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
          rows={3}
          placeholder="العنوان التفصيلي"
          disabled={submitting}
        />
      </div>

      {/* Brief */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          نبذة عن اللاعب <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.brief}
          onChange={(e) => setFormData({...formData, brief: e.target.value})}
          className={`mt-1 block w-full rounded-md border ${
            formErrors.brief ? 'border-red-500' : 'border-gray-300'
          } p-2`}
          rows={4}
          placeholder="اكتب نبذة مختصرة عن نفسك، مهاراتك، وطموحاتك في كرة القدم..."
          disabled={submitting}
        />
        {formErrors.brief && (
          <p className="mt-1 text-sm text-red-600">{formErrors.brief}</p>
        )}
      </div>
    </div>
  );
  // Render Education Section
  const renderEducation = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">
        المعلومات التعليمية
      </h2>

      {/* Education Level & Year */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            المؤهل الدراسي <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.education_level}
            onChange={(e) => setFormData({...formData, education_level: e.target.value})}
            className={`mt-1 block w-full rounded-md border ${
              formErrors.education_level ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            disabled={submitting}
          >
            <option value="">اختر المؤهل</option>
            {REFERENCE_DATA.educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {formErrors.education_level && (
            <p className="mt-1 text-sm text-red-600">{formErrors.education_level}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            سنة التخرج
          </label>
          <input
            type="number"
            value={formData.graduation_year}
            onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            min={1990}
            max={new Date().getFullYear()}
            disabled={submitting}
          />
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
        </div>
      </div>

      {/* Language Skills */}
      <div className="space-y-4">
        <h3 className="pr-4 text-lg font-medium border-r-4 border-gray-300">المهارات اللغوية</h3>
<<<<<<< HEAD
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">اللغة الإنجليزية</label>
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
            <label className="block text-sm font-medium text-gray-700">اللغة العربية</label>
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
=======
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* English */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              اللغة الإنجليزية <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.english_level}
              onChange={(e) => setFormData({...formData, english_level: e.target.value})}
              className={`mt-1 block w-full rounded-md border ${
                formErrors.english_level ? 'border-red-500' : 'border-gray-300'
              } p-2`}
              disabled={submitting}
            >
              <option value="">اختر المستوى</option>
              {REFERENCE_DATA.languageLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {formErrors.english_level && (
              <p className="mt-1 text-sm text-red-600">{formErrors.english_level}</p>
            )}
          </div>

          {/* Arabic */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              اللغة العربية
            </label>
            <select
              value={formData.arabic_level}
              onChange={(e) => setFormData({...formData, arabic_level: e.target.value})}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              disabled={submitting}
            >
              <option value="">اختر المستوى</option>
              {REFERENCE_DATA.languageLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Spanish */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              اللغة الإسبانية
            </label>
            <select
              value={formData.spanish_level}
              onChange={(e) => setFormData({...formData, spanish_level: e.target.value})}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              disabled={submitting}
            >
              <option value="">اختر المستوى</option>
              {REFERENCE_DATA.languageLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
          </div>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {/* Courses & Training */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          الدورات التدريبية
        </label>
        <div className="space-y-2">
          {formData.courses.map((course, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={course}
                onChange={(e) => {
                  const newCourses = [...formData.courses];
                  newCourses[index] = e.target.value;
                  setFormData({...formData, courses: newCourses});
                }}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="اسم الدورة"
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => {
                  const newCourses = formData.courses.filter((_, i) => i !== index);
                  setFormData({...formData, courses: newCourses});
                }}
                className="p-2 text-red-500 hover:text-red-700"
                disabled={submitting}
              >
                <Trash size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({
              ...formData,
              courses: [...formData.courses, '']
            })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            disabled={submitting}
          >
            <Plus size={20} />
            <span>إضافة دورة</span>
          </button>
        </div>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
      </div>
    </div>
  );

  // Render Medical Record Section
  const renderMedicalRecord = () => (
    <div className="space-y-6">
<<<<<<< HEAD
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
=======
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">
        السجل الطبي
      </h2>

      {/* Basic Medical Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            فصيلة الدم
          </label>
          <select
            value={formData.blood_type}
            onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            disabled={submitting}
          >
            <option value="">اختر فصيلة الدم</option>
            {REFERENCE_DATA.bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            الطول (سم) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => setFormData({...formData, height: e.target.value})}
            className={`mt-1 block w-full rounded-md border ${
              formErrors.height ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            placeholder="170"
            disabled={submitting}
          />
          {formErrors.height && (
            <p className="mt-1 text-sm text-red-600">{formErrors.height}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            الوزن (كجم) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
            className={`mt-1 block w-full rounded-md border ${
              formErrors.weight ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            placeholder="70"
            disabled={submitting}
          />
          {formErrors.weight && (
            <p className="mt-1 text-sm text-red-600">{formErrors.weight}</p>
          )}
        </div>
      </div>

      {/* Chronic Conditions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="chronic_conditions"
            checked={formData.chronic_conditions}
            onChange={(e) => setFormData({
              ...formData,
              chronic_conditions: e.target.checked,
              chronic_details: e.target.checked ? formData.chronic_details : ''
            })}
            className="border-gray-300 rounded"
            disabled={submitting}
          />
          <label htmlFor="chronic_conditions" className="text-sm font-medium text-gray-700">
            هل لديك أمراض مزمنة؟
          </label>
        </div>

        {formData.chronic_conditions && (
          <div className="mr-7">
            <textarea
              value={formData.chronic_details}
              onChange={(e) => setFormData({...formData, chronic_details: e.target.value})}
              className={`mt-2 block w-full rounded-md border ${
                formErrors.chronic_details ? 'border-red-500' : 'border-gray-300'
              } p-2`}
              rows={3}
              placeholder="تفاصيل الأمراض المزمنة..."
              disabled={submitting}
            />
            {formErrors.chronic_details && (
              <p className="mt-1 text-sm text-red-600">{formErrors.chronic_details}</p>
            )}
          </div>
        )}
      </div>

      {/* Previous Injuries */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          الإصابات السابقة
        </label>
        <div className="space-y-2">
          {formData.injuries.map((injury, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <input
                type="text"
                value={injury.type}
                onChange={(e) => {
                  const newInjuries = [...formData.injuries];
                  newInjuries[index] = { ...injury, type: e.target.value };
                  setFormData({...formData, injuries: newInjuries});
                }}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="نوع الإصابة"
                disabled={submitting}
              />
              <input
                type="date"
                value={injury.date}
                onChange={(e) => {
                  const newInjuries = [...formData.injuries];
                  newInjuries[index] = { ...injury, date: e.target.value };
                  setFormData({...formData, injuries: newInjuries});
                }}
                className="p-2 border border-gray-300 rounded-md"
                disabled={submitting}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={injury.recovery_status}
                  onChange={(e) => {
                    const newInjuries = [...formData.injuries];
                    newInjuries[index] = { ...injury, recovery_status: e.target.value };
                    setFormData({...formData, injuries: newInjuries});
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder="حالة التعافي"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newInjuries = formData.injuries.filter((_, i) => i !== index);
                    setFormData({...formData, injuries: newInjuries});
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                  disabled={submitting}
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({
              ...formData,
              injuries: [...formData.injuries, { type: '', date: '', recovery_status: '' }]
            })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            disabled={submitting}
          >
            <Plus size={20} />
            <span>إضافة إصابة</span>
          </button>
        </div>
      </div>

      {/* Surgeries */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          العمليات الجراحية
        </label>
        <div className="space-y-2">
          {formData.surgeries.map((surgery, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <input
                type="text"
                value={surgery.type}
                onChange={(e) => {
                  const newSurgeries = [...formData.surgeries];
                  newSurgeries[index] = { ...surgery, type: e.target.value };
                  setFormData({...formData, surgeries: newSurgeries});
                }}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="نوع العملية"
                disabled={submitting}
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={surgery.date}
                  onChange={(e) => {
                    const newSurgeries = [...formData.surgeries];
                    newSurgeries[index] = { ...surgery, date: e.target.value };
                    setFormData({...formData, surgeries: newSurgeries});
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSurgeries = formData.surgeries.filter((_, i) => i !== index);
                    setFormData({...formData, surgeries: newSurgeries});
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                  disabled={submitting}
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({
              ...formData,
              surgeries: [...formData.surgeries, { type: '', date: '' }]
            })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            disabled={submitting}
          >
            <Plus size={20} />
            <span>إضافة عملية</span>
          </button>
        </div>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
      </div>
    </div>
  );

<<<<<<< HEAD
  // Render Skills Section
  const renderSkills = () => (
    <div className="space-y-8">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">المهارات والقدرات</h2>
      
=======
  // Render Sports Information Section
  const renderSportsInfo = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">
        المعلومات الرياضية
      </h2>

      {/* Basic Sports Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            المركز الأساسي <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.primary_position}
            onChange={(e) => setFormData({...formData, primary_position: e.target.value})}
            className={`mt-1 block w-full rounded-md border ${
              formErrors.primary_position ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            disabled={submitting}
          >
            <option value="">اختر المركز</option>
            {REFERENCE_DATA.positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
          {formErrors.primary_position && (
            <p className="mt-1 text-sm text-red-600">{formErrors.primary_position}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            المركز الثانوي
          </label>
          <select
            value={formData.secondary_position}
            onChange={(e) => setFormData({...formData, secondary_position: e.target.value})}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            disabled={submitting}
          >
            <option value="">اختر المركز</option>
            {REFERENCE_DATA.positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Preferred Foot */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          القدم المفضلة <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          {REFERENCE_DATA.footPreferences.map(foot => (
            <label key={foot} className="inline-flex items-center">
              <input
                type="radio"
                name="preferred_foot"
                value={foot}
                checked={formData.preferred_foot === foot}
                onChange={(e) => setFormData({...formData, preferred_foot: e.target.value})}
                className="w-4 h-4 text-blue-600 form-radio"
                disabled={submitting}
              />
              <span className="mr-2">{foot}</span>
            </label>
          ))}
        </div>
        {formErrors.preferred_foot && (
          <p className="mt-1 text-sm text-red-600">{formErrors.preferred_foot}</p>
        )}
      </div>

      {/* Club History */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          تاريخ الأندية
        </label>
        <div className="space-y-2">
          {formData.club_history.map((club, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <input
                type="text"
                value={club.name}
                onChange={(e) => {
                  const newHistory = [...formData.club_history];
                  newHistory[index] = { ...club, name: e.target.value };
                  setFormData({...formData, club_history: newHistory});
                }}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="اسم النادي"
                disabled={submitting}
              />
              <input
                type="date"
                value={club.join_date}
                onChange={(e) => {
                  const newHistory = [...formData.club_history];
                  newHistory[index] = { ...club, join_date: e.target.value };
                  setFormData({...formData, club_history: newHistory});
                }}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="تاريخ الانضمام"
                disabled={submitting}
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={club.leave_date}
                  onChange={(e) => {
                    const newHistory = [...formData.club_history];
                    newHistory[index] = { ...club, leave_date: e.target.value };
                    setFormData({...formData, club_history: newHistory});
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder="تاريخ المغادرة"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newHistory = formData.club_history.filter((_, i) => i !== index);
                    setFormData({...formData, club_history: newHistory});
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                  disabled={submitting}
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({
              ...formData,
              club_history: [...formData.club_history, { name: '', join_date: '', leave_date: '' }]
            })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            disabled={submitting}
          >
            <Plus size={20} />
            <span>إضافة نادي</span>
          </button>
        </div>
      </div>
    </div>
  );
  // Render Skills Section with Charts
  const renderSkills = () => (
    <div className="space-y-8">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">
        المهارات والقدرات
      </h2>

>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
      {/* Technical Skills */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium">المهارات الفنية</h3>
          <div className="space-y-4">
<<<<<<< HEAD
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
=======
            {Object.entries(formData.technical_skills).map(([skill, value]) => (
              <div key={skill}>
                <div className="flex justify-between mb-1 text-sm text-gray-600">
                  <span>
                    {skill === 'ball_control' && 'التحكم بالكرة'}
                    {skill === 'passing' && 'التمرير'}
                    {skill === 'shooting' && 'التسديد'}
                    {skill === 'dribbling' && 'المراوغة'}
                  </span>
                  <span>{value}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={value}
                  onChange={(e) => setFormData({
                    ...formData,
                    technical_skills: {
                      ...formData.technical_skills,
                      [skill]: parseInt(e.target.value)
                    }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={submitting}
                />
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              </div>
            ))}
          </div>
        </div>
<<<<<<< HEAD
        
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
=======
        <div className="h-64">
          <RadarChart 
            width={300} 
            height={250} 
            data={Object.entries(formData.technical_skills).map(([key, value]) => ({
              subject: key === 'ball_control' ? 'التحكم بالكرة' :
                       key === 'passing' ? 'التمرير' :
                       key === 'shooting' ? 'التسديد' :
                       'المراوغة',
              value: value
            }))}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <Radar 
              name="المهارات الفنية" 
              dataKey="value" 
              stroke="#2563eb" 
              fill="#2563eb" 
              fillOpacity={0.6} 
            />
          </RadarChart>
        </div>
      </div>

      {/* Physical Skills */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium">المهارات البدنية</h3>
          <div className="space-y-4">
            {Object.entries(formData.physical_skills).map(([skill, value]) => (
              <div key={skill}>
                <div className="flex justify-between mb-1 text-sm text-gray-600">
                  <span>
                    {skill === 'speed' && 'السرعة'}
                    {skill === 'strength' && 'القوة البدنية'}
                    {skill === 'stamina' && 'التحمل'}
                    {skill === 'agility' && 'الرشاقة'}
                    {skill === 'balance' && 'التوازن'}
                    {skill === 'flexibility' && 'المرونة'}
                  </span>
                  <span>{value}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={value}
                  onChange={(e) => setFormData({
                    ...formData,
                    physical_skills: {
                      ...formData.physical_skills,
                      [skill]: parseInt(e.target.value)
                    }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={submitting}
                />
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              </div>
            ))}
          </div>
        </div>
<<<<<<< HEAD
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

  // Render Objectives Section
  const renderObjectives = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">الأهداف والطموحات</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">الأهداف المهنية</h3>
=======
        <div className="h-64">
          <RadarChart 
            width={300} 
            height={250} 
            data={Object.entries(formData.physical_skills).map(([key, value]) => ({
              subject: key === 'speed' ? 'السرعة' :
                       key === 'strength' ? 'القوة البدنية' :
                       key === 'stamina' ? 'التحمل' :
                       key === 'agility' ? 'الرشاقة' :
                       key === 'balance' ? 'التوازن' :
                       'المرونة',
              value: value
            }))}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <Radar 
              name="المهارات البدنية" 
              dataKey="value" 
              stroke="#2563eb" 
              fill="#2563eb" 
              fillOpacity={0.6} 
            />
          </RadarChart>
        </div>
      </div>

      {/* Social Skills */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium">المهارات الاجتماعية</h3>
          <div className="space-y-4">
            {Object.entries(formData.social_skills).map(([skill, value]) => (
              <div key={skill}>
                <div className="flex justify-between mb-1 text-sm text-gray-600">
                  <span>
                    {skill === 'teamwork' && 'العمل الجماعي'}
                    {skill === 'communication' && 'التواصل'}
                    {skill === 'discipline' && 'الانضباط'}
                    {skill === 'self_confidence' && 'الثقة بالنفس'}
                    {skill === 'pressure_handling' && 'تحمل الضغط'}
                    {skill === 'punctuality' && 'الالتزام بالمواعيد'}
                  </span>
                  <span>{value}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={value}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_skills: {
                      ...formData.social_skills,
                      [skill]: parseInt(e.target.value)
                    }
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={submitting}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="h-64">
          <RadarChart 
            width={300} 
            height={250} 
            data={Object.entries(formData.social_skills).map(([key, value]) => ({
              subject: key === 'teamwork' ? 'العمل الجماعي' :
                       key === 'communication' ? 'التواصل' :
                       key === 'discipline' ? 'الانضباط' :
                       key === 'self_confidence' ? 'الثقة بالنفس' :
                       key === 'pressure_handling' ? 'تحمل الضغط' :
                       'الالتزام بالمواعيد',
              value: value
            }))}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <Radar 
              name="المهارات الاجتماعية" 
              dataKey="value" 
              stroke="#2563eb" 
              fill="#2563eb" 
              fillOpacity={0.6} 
            />
          </RadarChart>
        </div>
      </div>

      {/* Skills Tips */}
      <div className="p-4 rounded-lg bg-blue-50">
        <p className="text-sm text-blue-800">
          قم بتقييم مهاراتك بموضوعية. حيث أن 1 تعني مستوى مبتدئ و5 تعني مستوى محترف.
          سيتم عرض تقييمك على الأندية والمدربين.
        </p>
      </div>
    </div>
  );
  // Render Objectives Section
  const renderObjectives = () => (
    <div className="space-y-6">
      <h2 className="pr-4 text-2xl font-semibold border-r-4 border-blue-500">
        الأهداف والطموحات
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Professional Goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">الأهداف المهنية</h3>
          
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
          <div className="space-y-2">
            {Object.entries({
              professional: 'الاحتراف الكامل',
              trials: 'معايشات احترافية',
              local_leagues: 'المشاركة في دوريات محلية',
              arab_leagues: 'المشاركة في دوريات عربية',
              european_leagues: 'المشاركة في دوريات أوروبية',
              training: 'تدريبات احترافية'
            }).map(([key, label]) => (
<<<<<<< HEAD
              <div key={key} className="flex items-center gap-2 p-2 rounded-md bg-gray-50">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={!!editFormData.objectives?.[key]}
                    onChange={e => {
                      setEditFormData(prev => ({
                        ...prev,
                        objectives: {
                          ...prev.objectives,
                          [key]: e.target.checked
                        }
                      }));
                    }}
                  />
                ) : (
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
                    formData.objectives?.[key] 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200'
                  }`}>
                    {formData.objectives?.[key] && <Check className="w-3 h-3" />}
                  </div>
                )}
                <span className="text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">أهداف أخرى</label>
          {isEditing ? (
            <textarea
              value={editFormData.objectives?.other || ''}
              onChange={e => {
                setEditFormData(prev => ({
                  ...prev,
                  objectives: {
                    ...prev.objectives,
                    other: e.target.value
                  }
                }));
              }}
              className="w-full p-2 mt-1 text-gray-900 bg-white border rounded-md"
            />
          ) : (
            <div className="p-2 mt-1 text-gray-900 bg-gray-100 rounded-md">
              {formData.objectives?.other || 'غير محدد'}
            </div>
          )}
=======
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
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
        </div>
      </div>
    </div>
  );

<<<<<<< HEAD
  // Render Media Section (صور وفيديوهات)
  const renderMedia = () => (
    <div className="space-y-8">
      {/* الصورة الشخصية */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-800">الصورة الشخصية</h3>
        <div className="flex flex-col items-center gap-4">
          {isEditing ? (
            <div className="flex flex-col items-center w-full">
              <div className="relative w-40 h-40 overflow-hidden bg-gray-100 rounded-full">
                {editFormData.profile_image?.url ? (
                  <img 
                    src={editFormData.profile_image.url} 
                    alt="صورة شخصية" 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="absolute w-20 h-20 text-gray-300 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
                )}
              </div>
              <div className="mt-4">
                <label className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
                  <Upload className="inline w-4 h-4 mr-1" />
                  تغيير الصورة
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleProfileImageUpload}
                  />
                </label>
              </div>
              {uploadingProfileImage && (
                <div className="mt-2 text-sm text-blue-600">جاري الرفع...</div>
              )}
            </div>
          ) : (
            <div className="w-40 h-40 overflow-hidden bg-gray-100 rounded-full">
              {formData.profile_image?.url ? (
                <PhotoProvider>
                  <PhotoView src={formData.profile_image.url}>
                    <img 
                      src={formData.profile_image.url} 
                      alt="صورة شخصية" 
                      className="object-cover w-full h-full cursor-pointer"
                    />
                  </PhotoView>
                </PhotoProvider>
              ) : (
                <User className="w-full h-full p-8 text-gray-300" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* الصور الإضافية */}
      <div>
        <h3 className="mb-2 text-lg font-bold text-gray-800">الصور الإضافية</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {isEditing ? (
            <>
              {/* صور موجودة */}
              {(editFormData.additional_images || []).map((img, idx) => (
                <div key={idx} className="relative overflow-hidden border border-gray-200 rounded-xl group">
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={`صورة إضافية ${idx + 1}`}
                      className="object-cover w-full h-32 rounded-xl"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-32 bg-gray-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAdditionalImageUpload(e, idx)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center text-gray-400">
                        <Upload className="w-8 h-8 mb-1" />
                        <span>اختر صورة</span>
                      </div>
                    </div>
                  )}
                  
                  {/* زر حذف الصورة */}
                  {img.url && (
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full top-2 left-2 opacity-80 hover:opacity-100"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                  
                  {/* مؤشر التحميل */}
                  {uploadingAdditionalImages[idx] && (
                    <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
                      جاري الرفع...
                    </div>
                  )}
                </div>
              ))}
              
              {/* زر إضافة صورة جديدة */}
              <button
                onClick={() => setEditFormData(prev => ({
                  ...prev,
                  additional_images: [...(prev.additional_images || []), { url: '' }]
                }))}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-xl hover:bg-blue-50"
              >
                <Plus className="w-8 h-8 mb-1 text-blue-500" />
                <span className="text-blue-500">إضافة صورة جديدة</span>
              </button>
            </>
          ) : (
            <>
              {/* عرض الصور في وضع المشاهدة */}
              {(formData.additional_images || []).length === 0 ? (
                <span className="text-gray-400">لا توجد صور إضافية</span>
              ) : (
                <PhotoProvider>
                  {formData.additional_images.filter(img => img.url && img.url.trim() !== '').map((img, idx) => (
                    <PhotoView key={idx} src={img.url}>
                      <div className="relative cursor-pointer group">
                        <img
                          src={img.url}
                          alt={`صورة إضافية ${idx + 1}`}
                          className="object-cover w-full h-32 transition border border-gray-200 shadow-md rounded-xl group-hover:opacity-90"
                        />
                      </div>
                    </PhotoView>
                  ))}
                </PhotoProvider>
              )}
            </>
          )}
        </div>
      </div>

      {/* الفيديوهات */}
      <div>
        <h3 className="mb-2 text-lg font-bold text-gray-800">الفيديوهات</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {isEditing ? (
            <>
              {/* فيديوهات موجودة */}
              {(editFormData.videos || []).map((video, idx) => (
                <div key={idx} className="relative p-3 overflow-hidden bg-white border border-gray-100 rounded-lg shadow-md">
                  <div className="mb-3">
                    <label className="block mb-1 text-sm text-gray-700">رابط الفيديو</label>
                    <input
                      type="text"
                      value={video.url || ''}
                      onChange={e => {
                        const updated = [...editFormData.videos];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setEditFormData({ ...editFormData, videos: updated });
                      }}
                      className="w-full p-2 border rounded"
                      placeholder="رابط فيديو من يوتيوب أو فيميو"
                    />
                  </div>
                  
                  <div className="mb-2">
                    <label className="block mb-1 text-sm text-gray-700">وصف الفيديو</label>
                    <input
                      type="text"
                      value={video.description || ''}
                      onChange={e => {
                        const updated = [...editFormData.videos];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setEditFormData({ ...editFormData, videos: updated });
                      }}
                      className="w-full p-2 border rounded"
                      placeholder="وصف مختصر للفيديو"
                    />
                  </div>
                  
                  {/* معاينة الفيديو إذا كان الرابط صالحًا */}
                  {video.url && getVideoEmbed(video.url) && (
                    <div className="w-full h-32 my-2 overflow-hidden rounded-lg bg-gray-50">
                      {getVideoEmbed(video.url)}
                    </div>
                  )}
                  
                  {/* زر حذف الفيديو */}
                  <button
                    onClick={() => handleRemoveVideo(idx)}
                    className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full top-2 left-2 opacity-80 hover:opacity-100"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              
              {/* زر إضافة فيديو جديد */}
              <button
                onClick={() => setEditFormData(prev => ({
                  ...prev,
                  videos: [...(prev.videos || []), { url: '', description: '' }]
                }))}
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-300 border-dashed rounded-xl hover:bg-blue-50"
              >
                <Plus className="w-8 h-8 mb-1 text-blue-500" />
                <span className="text-blue-500">إضافة فيديو جديد</span>
              </button>
            </>
          ) : (
            <>
              {/* عرض الفيديوهات في وضع المشاهدة */}
              {(formData.videos || []).length === 0 ? (
                <span className="text-gray-400">لا توجد فيديوهات</span>
              ) : (
                formData.videos.map((video, idx) => (
                  <div key={idx} className="relative flex flex-col items-center p-2 bg-white border border-gray-100 shadow-md rounded-xl">
           <div className="flex items-center justify-center w-full h-32 mb-2 overflow-hidden bg-black rounded-lg">
                      <ReactPlayer 
                        url={video.url} 
                        controls 
                        width="100%" 
                        height="100%" 
                        style={{ maxWidth: '100%', maxHeight: '100%' }} 
                      />
                    </div>
                    <div className="w-full text-xs text-center text-gray-700 line-clamp-2">
                      {video.description || 'بدون وصف'}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // =========== Main Component UI ===========

  // Define tabs
  const TABS = [
    { name: 'البيانات الشخصية', icon: <User className="inline w-5 h-5 mr-2" />, render: renderPersonalInfo },
    { name: 'المعلومات التعليمية', icon: <GraduationCap className="inline w-5 h-5 mr-2" />, render: renderEducation },
    { name: 'السجل الطبي', icon: <HeartPulse className="inline w-5 h-5 mr-2" />, render: renderMedicalRecord },
    { name: 'المعلومات الرياضية', icon: <Dumbbell className="inline w-5 h-5 mr-2" />, render: renderSportsInfo },
    { name: 'المهارات', icon: <Star className="inline w-5 h-5 mr-2" />, render: renderSkills },
    { name: 'الأهداف والطموحات', icon: <Target className="inline w-5 h-5 mr-2" />, render: renderObjectives },
    { name: 'الصور والفيديوهات', icon: <ImageIcon className="inline w-5 h-5 mr-2" />, render: renderMedia },
  ];

  // Loading State
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-red-600">حدث خطأ</h2>
          <p className="mb-6 text-gray-600">{error.message}</p>
          <Button 
            onClick={() => router.push('/login')}
            className="text-white bg-blue-600 hover:bg-blue-700"
          >
            العودة إلى صفحة تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  // No Data State
  if (!playerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">مرحباً بك</h2>
          <p className="mb-4 text-gray-600">قم بإكمال بيانات ملفك الشخصي</p>
          <Button
            onClick={() => router.push('/dashboard/player/register')}
            className="text-white bg-blue-600 hover:bg-blue-700"
          >
            إنشاء ملف شخصي
          </Button>
        </div>
      </div>
    );
  }

  // Main Component Return
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col text-[15px]" dir="rtl">
      {/* زر تعديل البيانات + رسائل النظام */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 bg-white shadow">
        <div>
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600">
            <Home size={18} className="ml-1" />
            <span className="text-sm">الرئيسية</span>
          </Link>
        </div>
        <div className="flex-1 mx-4">
          {successMessage && (
            <Alert className="py-1 border-green-100 bg-green-50">
              <Check className="w-4 h-4 text-green-500" />
              <span className="mr-2 text-sm text-green-600">{successMessage}</span>
            </Alert>
          )}
          {editError && (
            <Alert className="py-1 border-red-100 bg-red-50">
              <X className="w-4 h-4 text-red-500" />
              <span className="mr-2 text-sm text-red-600">{editError}</span>
            </Alert>
          )}
        </div>
        <div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)} 
              className="px-3 py-1 text-sm text-white bg-yellow-500 hover:bg-yellow-600"
            >
              تعديل البيانات
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                disabled={editLoading} 
                className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                {editLoading ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
              <Button 
                onClick={handleCancel} 
                className="px-3 py-1 text-sm text-white bg-gray-400 hover:bg-gray-500"
              >
                إلغاء
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* رسالة الحقول المطلوبة */}
      {isEditing && (
        <div className="px-4 py-2 text-sm text-blue-600 border-b border-blue-100 bg-blue-50">
          * الحقول المطلوبة: الاسم الكامل، تاريخ الميلاد، الجنسية، رقم الهاتف، المركز الأساسي
        </div>
      )}

      {/* التبويبات في الأعلى */}
      <div className="w-full bg-white shadow-sm px-2 pt-2 pb-0 flex justify-center sticky top-[48px] z-10">
        <div className="flex p-1 mb-2 space-x-1 overflow-x-auto bg-gray-100 shadow-sm rounded-xl">
          {TABS.map((tab, idx) => (
            <button
              key={tab.name}
              onClick={() => setCurrentStep(idx + 1)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-150
                ${currentStep === idx + 1 ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-100 bg-white'}`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar بسيط للمعلومات السريعة */}
        <nav className="flex-col hidden w-64 min-h-full gap-2 px-3 py-4 bg-white border-l shadow-sm md:flex">
          <div className="flex flex-col items-center p-4 mb-4 text-center">
            <div className="relative w-24 h-24 mb-3 overflow-hidden rounded-full">
              <img 
                src={formData.profile_image?.url || '/default-avatar.png'} 
                alt="صورة اللاعب" 
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="mb-1 text-lg font-bold text-gray-800">{formData.full_name || 'اللاعب'}</h2>
            <p className="text-sm text-gray-500">
              {formData.primary_position || 'المركز غير محدد'}
            </p>
          </div>
          
          {/* معلومات سريعة */}
          <div className="p-3 mb-2 rounded-lg bg-gray-50">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">معلومات سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">العمر</span>
                <span className="font-medium">
                  {formData.birth_date ? (new Date().getFullYear() - new Date(formData.birth_date).getFullYear()) : '--'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">الجنسية</span>
                <span className="font-medium">{formData.nationality || '--'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">الطول</span>
                <span className="font-medium">{formData.height || '--'} سم</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">الوزن</span>
                <span className="font-medium">{formData.weight || '--'} كجم</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">القدم المفضلة</span>
                <span className="font-medium">{formData.preferred_foot || '--'}</span>
              </li>
            </ul>
          </div>
          
          {/* التواصل */}
          <div className="p-3 mb-2 rounded-lg bg-gray-50">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">بيانات التواصل</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{formData.email || '--'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{formData.phone || '--'}</span>
              </li>
            </ul>
          </div>
          
          {/* روابط سريعة */}
          <div className="mt-auto">
            <Link href="/reports" className="flex items-center justify-center w-full gap-2 px-4 py-2 mb-2 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
              <FileText className="w-4 h-4" /> عرض التقرير
            </Link>
          </div>
        </nav>

        {/* محتوى رئيسي */}
        <main className="flex-1 p-2 overflow-y-auto md:p-4">
          {/* كروت معلومات سريعة مصغرة للعرض المتجاوب */}
          <div className="grid grid-cols-2 gap-2 mb-4 md:hidden">
            <div className="flex flex-col items-center p-2 text-xs bg-white rounded-lg shadow">
              <User className="w-4 h-4 mb-1 text-blue-400" />
              <span className="text-gray-500">العمر</span>
              <span className="text-base font-bold text-blue-700">
                {formData.birth_date ? (new Date().getFullYear() - new Date(formData.birth_date).getFullYear()) : '--'}
              </span>
            </div>
            <div className="flex flex-col items-center p-2 text-xs bg-white rounded-lg shadow">
              <Flag className="w-4 h-4 mb-1 text-blue-400" />
              <span className="text-gray-500">الجنسية</span>
              <span className="text-base font-bold text-blue-700">{formData.nationality || '--'}</span>
            </div>
            <div className="flex flex-col items-center p-2 text-xs bg-white rounded-lg shadow">
              <Star className="w-4 h-4 mb-1 text-blue-400" />
              <span className="text-gray-500">المركز</span>
              <span className="text-base font-bold text-blue-700">{formData.primary_position || '--'}</span>
            </div>
            <div className="flex flex-col items-center p-2 text-xs bg-white rounded-lg shadow">
              <HeartPulse className="w-4 h-4 mb-1 text-blue-400" />
              <span className="text-gray-500">الطول</span>
              <span className="text-base font-bold text-blue-700">{formData.height || '--'} سم</span>
            </div>
          </div>

          {/* محتوى القسم النشط فقط */}
          <div className="p-3 bg-white shadow rounded-xl md:p-6">
            {/* إذا التبويب الأول (البيانات الشخصية) وفي وضع عرض الجوال فقط */}
            {currentStep === 1 && (
              <div className="flex flex-col items-center mb-6 md:hidden">
                <img
                  src={formData.profile_image?.url || '/default-avatar.png'}
                  alt="صورة اللاعب"
                  className="object-cover w-24 h-24 mb-2 border-2 border-blue-500 rounded-full shadow"
                />
                <h2 className="text-xl font-bold text-gray-800">{formData.full_name || 'اللاعب'}</h2>
                <p className="text-sm text-gray-500">{formData.primary_position || 'المركز غير محدد'}</p>
              </div>
            )}
            {TABS[currentStep - 1].render()}
          </div>
        </main>
      </div>

      {/* فوتر صغير */}
      <footer className="py-2 mt-4 text-xs text-center text-gray-400 bg-white border-t">
        جميع الحقوق محفوظة &copy; {new Date().getFullYear()}
=======
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
                src={URL.createObjectURL(image)}
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
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFormData({
                      ...formData,
                      additional_images: [...formData.additional_images, e.target.files[0]]
                    });
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

        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
          {/* Progress Steps */}
          <ProgressSteps />

          {/* Form Sections */}
          {currentStep === STEPS.PERSONAL && renderPersonalInfo()}
          {currentStep === STEPS.EDUCATION && renderEducation()}
          {currentStep === STEPS.MEDICAL && renderMedicalRecord()}
          {currentStep === STEPS.SPORTS && renderSportsInfo()}
          {currentStep === STEPS.SKILLS && renderSkills()}
          {currentStep === STEPS.OBJECTIVES && renderObjectives()}
          {currentStep === STEPS.MEDIA && renderMedia()}

          {/* Navigation Buttons */}
          <NavigationButtons />
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
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
      </footer>
    </div>
  );
};

<<<<<<< HEAD
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

export default PlayerProfile;
=======
export default PlayerRegistrationForm;
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
