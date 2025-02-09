'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Firebase Imports
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';


// UI Components & Icons
import { ChevronRight, ChevronLeft, Check, Upload, Plus, Trash, X } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

// Recharts Components
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";


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

const PlayerRegistrationForm = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth); // ✅ ضعه هنا
  const [currentStep, setCurrentStep] = useState(STEPS.PERSONAL);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
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
      return;
    }

    try {
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
      </div>
    </div>
  );

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
          )}
        </div>

        <div>
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
        </div>
      </div>

      {/* Language Skills */}
      <div className="space-y-4">
        <h3 className="pr-4 text-lg font-medium border-r-4 border-gray-300">المهارات اللغوية</h3>
        
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
          </div>
        </div>
      </div>

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
      </div>
    </div>
  );

  // Render Medical Record Section
  const renderMedicalRecord = () => (
    <div className="space-y-6">
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
      </div>
    </div>
  );

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

      {/* Technical Skills */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium">المهارات الفنية</h3>
          <div className="space-y-4">
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
              </div>
            ))}
          </div>
        </div>
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
              </div>
            ))}
          </div>
        </div>
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
      </footer>
    </div>
  );
};

export default PlayerRegistrationForm;