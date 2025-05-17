'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

// Recharts Components
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

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

// Helper function to combine classes
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const PlayerProfile = () => {
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

      {/* Language Skills */}
      <div className="space-y-4">
        <h3 className="pr-4 text-lg font-medium border-r-4 border-gray-300">المهارات اللغوية</h3>
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
          </div>
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
      
      {/* Technical Skills */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-medium">المهارات الفنية</h3>
          <div className="space-y-4">
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
          <div className="space-y-2">
            {Object.entries({
              professional: 'الاحتراف الكامل',
              trials: 'معايشات احترافية',
              local_leagues: 'المشاركة في دوريات محلية',
              arab_leagues: 'المشاركة في دوريات عربية',
              european_leagues: 'المشاركة في دوريات أوروبية',
              training: 'تدريبات احترافية'
            }).map(([key, label]) => (
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
        </div>
      </div>
    </div>
  );

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
      </footer>
    </div>
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

export default PlayerProfile;
