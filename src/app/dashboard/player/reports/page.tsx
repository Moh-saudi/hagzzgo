'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import {
  AlertCircle, Award, Badge, BookOpen, Bot, Droplet, Flag, 
  Footprints, HeartPulse, ImageIcon, Layout, ShieldCheck, Star, 
  Stethoscope, Syringe, Target, User, Users, Video, Trophy,
  Download, Printer, Share2, Edit, ChevronLeft, Home, GraduationCap, Dumbbell
} from 'lucide-react';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { createClient } from '@supabase/supabase-js';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import ReactPlayer from 'react-player/lazy';
import html2canvas from 'html2canvas';


// Make sure this import is at the end of your imports
import '../../../globals.css';
import jsPDF from 'jspdf';

// تهيئة Supabase
const supabaseUrl = 'https://ekyerljzfokqimbabzxm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVreWVybGp6Zm9rcWltYmFienhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTcyODMsImV4cCI6MjA2MjIzMzI4M30.Xd6Cg8QUISHyCG-qbgo9HtWUZz6tvqAqG6KKXzuetBY';
const supabase = createClient(supabaseUrl, supabaseKey);

// تعيين اللغة العربية لمكتبة dayjs
dayjs.locale('ar');

interface Player {
  full_name: string;
  birth_date: string;
  profile_image_url: string;
  additional_image_urls: string[];
  videos: { url: string; description: string }[];
  progress: {
    total: number;
    sections: {
      education: number;
      objectives: number;
      media: number;
    };
  };
  updated_at: string;
  subscription_end: string;
  preferred_foot: string;
  english_level: string;
  spanish_level: string;
  objectives: {
    professional: boolean;
    trials: boolean;
    local_leagues: boolean;
    arab_leagues: boolean;
    european_leagues: boolean;
    training: boolean;
    other: string;
  };
  technical_skills?: Record<string, number>;
  physical_skills?: Record<string, number>;
  social_skills?: Record<string, number>;
  brief?: string;
  nationality?: string;
  primary_position?: string;
  height?: number;
  weight?: number;
  city?: string;
  country?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  education_level?: string;
  graduation_year?: string;
  arabic_level?: string;
  blood_type?: string;
  chronic_details?: string;
  secondary_position?: string;
  training_courses?: Array<{
    name: string;
    date: string;
    certificate_url?: string;
  }>;
  achievements?: Array<{
    title: string;
    date: string;
    description?: string;
  }>;
  medical_history?: {
    blood_type: string;
    chronic_conditions?: string[];
    allergies?: string[];
    injuries?: Array<{
      type: string;
      date: string;
      recovery_status: string;
    }>;
    last_checkup?: string;
  };
  current_club?: string;
  previous_clubs?: string[];
  documents?: Array<{
    type: string;
    url: string;
    name: string;
  }>;
}

const PlayerReport = () => {
  const router = useRouter();
  const [user, loading, authError] = useAuthState(auth);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  
  // تحويل بيانات المهارات لمخططات الرادار
  const technicalSkillsData = player?.technical_skills
    ? Object.entries(player.technical_skills).map(([key, value]) => ({
        skill: key === 'ball_control' ? 'التحكم بالكرة'
              : key === 'passing' ? 'التمرير'
              : key === 'shooting' ? 'التسديد'
              : key === 'dribbling' ? 'المراوغة'
              : key,
        value: Number(value)
      }))
    : [];

  const physicalSkillsData = player?.physical_skills
    ? Object.entries(player.physical_skills).map(([key, value]) => ({
        skill: key === 'speed' ? 'السرعة'
              : key === 'strength' ? 'القوة'
              : key === 'stamina' ? 'التحمل'
              : key === 'agility' ? 'الرشاقة'
              : key === 'balance' ? 'التوازن'
              : key === 'flexibility' ? 'المرونة'
              : key,
        value: Number(value)
      }))
    : [];

  const socialSkillsData = player?.social_skills
    ? Object.entries(player.social_skills).map(([key, value]) => ({
        skill: key === 'teamwork' ? 'العمل الجماعي'
              : key === 'communication' ? 'التواصل'
              : key === 'discipline' ? 'الانضباط'
              : key === 'self_confidence' ? 'الثقة بالنفس'
              : key === 'pressure_handling' ? 'تحمل الضغط'
              : key === 'punctuality' ? 'الالتزام بالمواعيد'
              : key,
        value: Number(value)
      }))
    : [];

  // Render functions for each tab
  const renderPersonalInfo = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="p-4 rounded-lg bg-blue-50">
        <div className="mb-1 font-semibold text-blue-700">الاسم الكامل</div>
        <div className="text-lg font-bold text-blue-900">{player?.full_name || '--'}</div>
      </div>
      <div className="p-4 rounded-lg bg-green-50">
        <div className="mb-1 font-semibold text-green-700">تاريخ الميلاد</div>
        <div className="text-lg font-bold text-green-900">
          {player?.birth_date ? dayjs(player.birth_date).format('DD/MM/YYYY') : '--'}
        </div>
      </div>
      <div className="p-4 rounded-lg bg-purple-50">
        <div className="mb-1 font-semibold text-purple-700">الجنسية</div>
        <div className="text-lg font-bold text-purple-900">{player?.nationality || '--'}</div>
      </div>
      <div className="p-4 rounded-lg bg-yellow-50">
        <div className="mb-1 font-semibold text-yellow-700">المركز الأساسي</div>
        <div className="text-lg font-bold text-yellow-900">{player?.primary_position || '--'}</div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="p-4 rounded-lg bg-blue-50">
        <div className="mb-1 font-semibold text-blue-700">مستوى اللغة الإنجليزية</div>
        <div className="text-lg font-bold text-blue-900">{player?.english_level || '--'}</div>
      </div>
      <div className="p-4 rounded-lg bg-green-50">
        <div className="mb-1 font-semibold text-green-700">مستوى اللغة الإسبانية</div>
        <div className="text-lg font-bold text-green-900">{player?.spanish_level || '--'}</div>
      </div>
    </div>
  );

  const renderMedicalRecord = () => (
    <div className="p-4 text-center text-gray-600">
      <p>سيتم إضافة السجل الطبي قريباً</p>
    </div>
  );

  const renderSportsInfo = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="p-4 rounded-lg bg-blue-50">
        <div className="mb-1 font-semibold text-blue-700">القدم المفضلة</div>
        <div className="text-lg font-bold text-blue-900">{player?.preferred_foot || '--'}</div>
      </div>
      <div className="p-4 rounded-lg bg-green-50">
        <div className="mb-1 font-semibold text-green-700">الطول</div>
        <div className="text-lg font-bold text-green-900">{player?.height ? `${player.height} سم` : '--'}</div>
      </div>
      <div className="p-4 rounded-lg bg-purple-50">
        <div className="mb-1 font-semibold text-purple-700">الوزن</div>
        <div className="text-lg font-bold text-purple-900">{player?.weight ? `${player.weight} كجم` : '--'}</div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-8">
      {player?.technical_skills && (
        <div>
          <h3 className="mb-4 text-xl font-semibold">المهارات الفنية</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={technicalSkillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar name="المهارات" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {player?.physical_skills && (
        <div>
          <h3 className="mb-4 text-xl font-semibold">المهارات البدنية</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={physicalSkillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar name="المهارات" dataKey="value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {player?.social_skills && (
        <div>
          <h3 className="mb-4 text-xl font-semibold">المهارات الاجتماعية</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={socialSkillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar name="المهارات" dataKey="value" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );

  const renderObjectives = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {player?.objectives && Object.entries(player.objectives).map(([key, value]) => (
        <div key={key} className="p-4 rounded-lg bg-blue-50">
          <div className="mb-1 font-semibold text-blue-700">
            {key === 'professional' ? 'احتراف'
            : key === 'trials' ? 'تجارب'
            : key === 'local_leagues' ? 'دوريات محلية'
            : key === 'arab_leagues' ? 'دوريات عربية'
            : key === 'european_leagues' ? 'دوريات أوروبية'
            : key === 'training' ? 'تدريب'
            : 'أخرى'}
          </div>
          <div className="text-lg font-bold text-blue-900">
            {typeof value === 'boolean' ? (value ? 'نعم' : 'لا') : value || '--'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-8">
      {player?.additional_image_urls && player.additional_image_urls.length > 0 && (
        <div>
          <h3 className="mb-4 text-xl font-semibold">الصور</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {player.additional_image_urls.map((url, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg shadow-md aspect-square">
                <img
                  src={url}
                  alt={`صورة ${index + 1}`}
                  className="object-cover w-full h-full cursor-pointer hover:opacity-90"
                  onClick={() => {
                    setSelectedImage(url);
                    setSelectedImageIdx(index);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {player?.videos && player.videos.length > 0 && (
        <div>
          <h3 className="mb-4 text-xl font-semibold">الفيديوهات</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {player.videos.map((video, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md">
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="300px"
                  controls
                  light
                />
                <div className="p-4 bg-white">
                  <p className="text-gray-700">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const TABS = [
    { name: 'البيانات الشخصية', icon: <User className="w-5 h-5" />, render: renderPersonalInfo },
    { name: 'المعلومات التعليمية', icon: <GraduationCap className="w-5 h-5" />, render: renderEducation },
    { name: 'السجل الطبي', icon: <HeartPulse className="w-5 h-5" />, render: renderMedicalRecord },
    { name: 'المعلومات الرياضية', icon: <Dumbbell className="w-5 h-5" />, render: renderSportsInfo },
    { name: 'المهارات', icon: <Star className="w-5 h-5" />, render: renderSkills },
    { name: 'الأهداف والطموحات', icon: <Target className="w-5 h-5" />, render: renderObjectives },
    { name: 'الصور والفيديوهات', icon: <ImageIcon className="w-5 h-5" />, render: renderMedia },
  ];
  
  // دالة لحساب نسبة اكتمال الملف الشخصي
  const calculateProfileCompletion = (player: Player | null): number => {
    if (!player) return 0;

    const requiredFields = {
      basic: [
        'full_name',
        'birth_date',
        'nationality',
        'city',
        'country',
        'phone',
        'whatsapp',
        'email',
        'profile_image_url'
      ],
      physical: [
        'height',
        'weight',
        'blood_type',
        'chronic_details'
      ],
      football: [
        'primary_position',
        'secondary_position',
        'preferred_foot',
        'current_club'
      ],
      skills: [
        'technical_skills',
        'physical_skills',
        'social_skills'
      ],
      education: [
        'education_level',
        'graduation_year',
        'english_level',
        'spanish_level',
        'arabic_level'
      ],
      objectives: [
        'objectives'
      ],
      media: [
        'additional_image_urls',
        'videos'
      ]
    };

    let totalFields = 0;
    let completedFields = 0;

    // حساب الحقول الأساسية
    for (const field of requiredFields.basic) {
      totalFields++;
      if (player[field as keyof Player] && player[field as keyof Player] !== '') {
        completedFields++;
      }
    }

    // حساب الحقول البدنية
    for (const field of requiredFields.physical) {
      totalFields++;
      if (player[field as keyof Player] && player[field as keyof Player] !== '') {
        completedFields++;
      }
    }

    // حساب الحقول المتعلقة بكرة القدم
    for (const field of requiredFields.football) {
      totalFields++;
      if (player[field as keyof Player] && player[field as keyof Player] !== '') {
        completedFields++;
      }
    }

    // حساب المهارات
    for (const field of requiredFields.skills) {
      totalFields++;
      if (player[field as keyof Player] && Object.keys(player[field as keyof Player] || {}).length > 0) {
        completedFields++;
      }
    }

    // حساب الحقول التعليمية
    for (const field of requiredFields.education) {
      totalFields++;
      if (player[field as keyof Player] && player[field as keyof Player] !== '') {
        completedFields++;
      }
    }

    // حساب الأهداف
    totalFields++;
    if (player.objectives && Object.values(player.objectives).some(value => value === true)) {
      completedFields++;
    }

    // حساب الوسائط
    for (const field of requiredFields.media) {
      totalFields++;
      if (player[field as keyof Player] && Array.isArray(player[field as keyof Player]) && (player[field as keyof Player] as any[]).length > 0) {
        completedFields++;
      }
    }

    return Math.round((completedFields / totalFields) * 100);
  };
  
  // جلب بيانات اللاعب من Firebase والصور من Supabase
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log("جاري جلب بيانات اللاعب:", user.uid);
        
        const playerDoc = await getDoc(doc(db, 'players', user.uid));
        
        if (playerDoc.exists()) {
          const data = playerDoc.data();
          console.log("تم جلب بيانات اللاعب:", data);
          
          let profileImageUrl = data.profile_image_url || '';
          let additionalImagesUrls = data.additional_image_urls || [];
          
          const processedData: Player = {
            ...data,
            full_name: data.full_name || '',
            videos: data.videos || [],
            progress: {
              total: calculateProfileCompletion(data as Player),
              sections: {
                education: data.progress?.sections?.education || 0,
                objectives: data.progress?.sections?.objectives || 0,
                media: data.progress?.sections?.media || 0
              }
            },
            preferred_foot: data.preferred_foot || '',
            english_level: data.english_level || '',
            spanish_level: data.spanish_level || '',
            arabic_level: data.arabic_level || '',
            objectives: data.objectives || {
              professional: false,
              trials: false,
              local_leagues: false,
              arab_leagues: false,
              european_leagues: false,
              training: false,
              other: ''
            },
            updated_at: data.updated_at?.toDate() || new Date(),
            birth_date: data.birth_date?.toDate() || null,
            subscription_end: data.subscription_end?.toDate() || null,
            profile_image_url: profileImageUrl,
            additional_image_urls: additionalImagesUrls,
            city: data.city || '',
            country: data.country || '',
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            email: data.email || '',
            education_level: data.education_level || '',
            graduation_year: data.graduation_year || '',
            blood_type: data.blood_type || '',
            chronic_details: data.chronic_details || '',
            secondary_position: data.secondary_position || '',
            training_courses: data.training_courses || [],
            achievements: data.achievements || [],
            medical_history: {
              blood_type: data.medical_history?.blood_type || '',
              chronic_conditions: data.medical_history?.chronic_conditions || [],
              allergies: data.medical_history?.allergies || [],
              injuries: data.medical_history?.injuries || [],
              last_checkup: data.medical_history?.last_checkup || ''
            },
            current_club: data.current_club || '',
            previous_clubs: data.previous_clubs || [],
            documents: data.documents || []
          };
          
          setPlayer(processedData);
        } else {
          setError("لم يتم العثور على بيانات اللاعب");
        }
      } catch (err) {
        console.error("خطأ في جلب بيانات اللاعب:", err);
        setError("حدث خطأ أثناء جلب البيانات");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!loading && user) {
      fetchPlayerData();
    }
  }, [user, loading]);
  
  // إغلاق المودال عند الضغط خارج الصورة
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedImageIdx(null);
      setSelectedImage(null);
      setShowProfileModal(false);
    }
  };
  
  // التنقل بين الصور
  const handlePrev = () => {
    if (selectedImageIdx !== null && player?.additional_image_urls?.length) {
      const newIndex = (selectedImageIdx - 1 + player.additional_image_urls.length) % player.additional_image_urls.length;
      setSelectedImageIdx(newIndex);
      setSelectedImage(player.additional_image_urls[newIndex]);
    }
  };
  
  const handleNext = () => {
    if (selectedImageIdx !== null && player?.additional_image_urls?.length) {
      const newIndex = (selectedImageIdx + 1) % player.additional_image_urls.length;
      setSelectedImageIdx(newIndex);
      setSelectedImage(player.additional_image_urls[newIndex]);
    }
  };
  
  // حفظ التقرير كصورة PDF
  const handleExportPDF = async () => {
    if (!player) return;
    
    setGeneratingPDF(true);
    const reportElement = document.getElementById('player-report');
    
    if (!reportElement) {
      console.error("لم يتم العثور على عنصر التقرير");
      setGeneratingPDF(false);
      return;
    }
    
    try {
      // تعيين وضع الطباعة مؤقتًا لتحسين التصدير
      setIsPrintMode(true);
      
      // إنتظار تحديث DOM
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(reportElement as HTMLElement, {
        scale: 1.5, // جودة أعلى
        useCORS: true, // للسماح بتحميل الصور من مصادر خارجية
        logging: false,
        windowWidth: 1200, // عرض ثابت للحصول على نتيجة ثابتة
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // حساب نسبة العرض/الارتفاع للحفاظ على نسبة الصورة
      const imgWidth = 210; // عرض A4 بالملم
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const totalPages = Math.ceil(imgHeight / 297); // 297 هو ارتفاع A4 بالملم
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // إضافة كل صفحة
      let position = 0;
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        
        pdf.addImage(
          imgData,
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        
        position -= 297; // الانتقال للصفحة التالية
      }
      
      pdf.save(`تقرير اللاعب ${player.full_name || 'بدون اسم'}.pdf`);
    } catch (error) {
      console.error("خطأ في تصدير PDF:", error);
      alert("حدث خطأ أثناء تصدير التقرير، يرجى المحاولة مرة أخرى");
    } finally {
      setIsPrintMode(false);
      setGeneratingPDF(false);
    }
  };
  
  // طباعة التقرير
  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      // إعادة الوضع بعد الطباعة
      setTimeout(() => setIsPrintMode(false), 1000);
    }, 500);
  };
  
  // مشاركة التقرير
  const handleShare = async () => {
    if (!player) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `تقرير اللاعب ${player.full_name || 'بدون اسم'}`,
          text: 'شاهد تقرير اللاعب الخاص بي',
          url: window.location.href,
        });
      } catch (error) {
        console.error("خطأ في مشاركة التقرير:", error);
      }
    } else {
      // نسخ الرابط إلى الحافظة
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert("تم نسخ رابط التقرير إلى الحافظة"))
        .catch(() => alert("فشل نسخ الرابط، يرجى نسخه يدويًا"));
    }
  };
  
  // مكون لعرض الحقول المفقودة
  const MissingField = ({ text = '--' }) => (
    <span className="text-gray-400">
      <span title="لم يتم إدخال هذه البيانات بعد">{text}</span>
    </span>
  );
  
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
  if (error || authError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-red-600">حدث خطأ</h2>
          <p className="mb-6 text-gray-600">{error || authError?.message}</p>
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
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">لا توجد بيانات</h2>
          <p className="mb-4 text-gray-600">لم يتم العثور على بيانات اللاعب</p>
          <Button
            onClick={() => router.push('/dashboard/player/profile')}
            className="text-white bg-blue-600 hover:bg-blue-700"
          >
            العودة إلى الملف الشخصي
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${isPrintMode ? 'print-mode' : ''}`} dir="rtl">
      {!isPrintMode && (
        <div className="sticky top-0 z-20 flex items-center justify-between w-full px-4 py-2 bg-white shadow-md print:hidden">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="ghost"
              className="flex items-center gap-1 text-gray-600"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Button>
            <Button
              onClick={() => router.push('/dashboard/player/profile')}
              variant="ghost"
              className="flex items-center gap-1 text-gray-600"
            >
              <Edit className="w-4 h-4" />
              <span>تعديل الملف</span>
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExportPDF}
              disabled={generatingPDF}
              className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700"
            >
              <Download className="w-4 h-4" />
              <span>{generatingPDF ? 'جاري التصدير...' : 'تصدير PDF'}</span>
            </Button>
            
            <Button
              onClick={handlePrint}
              className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </Button>
            
            <Button
              onClick={handleShare}
              className="flex items-center gap-1 text-white bg-green-600 hover:bg-green-700"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة</span>
            </Button>
          </div>
        </div>
      )}

      <div 
        id="player-report" 
        className="container p-4 mx-auto bg-white rounded shadow md:p-8 print:p-0 print:shadow-none print:w-full print:max-w-none"
      >
        {/* محتوى التقرير */}
        <div className="flex justify-between mb-4 text-lg font-bold text-gray-600">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="شعار النادي" 
              className="h-10"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = "https://via.placeholder.com/40?text=Logo";
              }}
            />
            <span className="text-xl font-bold text-blue-700">تقرير اللاعب</span>
          </div>
          <div>
            آخر تحديث للبيانات: {player.updated_at ? dayjs(player.updated_at).format('D MMMM YYYY [الساعة] h:mm A') : '--'}
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold">تقرير اللاعب: {player.full_name}</h1>

        {/* نسبة اكتمال الملف */}
        {player?.progress && (
          <div className="p-3 mb-6 rounded-lg bg-gray-50">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-semibold">نسبة اكتمال الملف الشخصي:</span>
              <span className="text-lg font-bold text-blue-600">{player.progress.total}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div 
                className="h-3 transition-all bg-blue-500 rounded-full"
                style={{ width: `${player.progress.total}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* تقييم الذكاء الاصطناعي وتقييم الفريق */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div className="flex flex-col items-center p-8 border-2 border-purple-300 shadow-lg bg-purple-50 rounded-2xl">
            <Bot className="mb-4 text-purple-600 w-14 h-14" />
            <span className="mb-2 text-2xl font-bold text-purple-800 md:text-3xl">تقييم الذكاء الاصطناعي</span>
            <span className="mb-1 text-4xl font-extrabold text-purple-900">{player.progress.total}%</span>
            <span className="text-lg text-purple-700">
              {player.progress.total >= 90 ? 'ممتاز' : player.progress.total >= 75 ? 'جيد جدًا' : player.progress.total >= 60 ? 'جيد' : 'قابل للتحسين'}
            </span>
          </div>
          <div className="flex flex-col items-center p-8 border-2 shadow-lg bg-emerald-50 border-emerald-300 rounded-2xl">
            <ShieldCheck className="mb-4 w-14 h-14 text-emerald-600" />
            <span className="mb-2 text-2xl font-bold md:text-3xl text-emerald-800">تقييم فريقنا المعتمد</span>
            <span className="mb-1 text-4xl font-extrabold text-emerald-900">4.5 <Star className="inline w-6 h-6 mb-1 text-amber-400" /></span>
            <span className="text-lg text-emerald-700">جيد جدًا</span>
          </div>
        </div>

        {/* جملة حماسية بناءً على التقييم */}
        <div className="mb-10 text-center">
          <span className="inline-block px-6 py-3 text-xl font-bold text-white shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
            {player.progress.total >= 90 ? 'بناءً على هذا التقييم، معدل ظهورك وفرصتك في الاحتراف عالية جدًا!' : player.progress.total >= 75 ? 'تقييمك جيد جدًا، استمر في تطوير ملفك لزيادة فرصك!' : player.progress.total >= 60 ? 'تقييمك جيد، يمكنك تحسين فرصك في الاحتراف بمزيد من التطوير!' : 'ننصحك بإكمال بياناتك وتطوير مهاراتك لزيادة فرصك في الاحتراف.'}
          </span>
        </div>

        {/* صورة اللاعب الشخصية والنبذة */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <img
              src={player.profile_image_url || "/default-avatar.png"}
              alt={player.full_name}
              className="object-cover w-40 h-40 border-4 border-blue-400 rounded-full shadow-lg"
              onClick={() => setShowProfileModal(true)}
            />
            {showProfileModal && !isPrintMode && (
              <div
                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleModalClick(e)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
              >
                <div className="relative">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="absolute p-1 text-gray-700 bg-white rounded-full shadow -top-4 -left-4 hover:bg-gray-200"
                    aria-label="إغلاق"
                  >
                    ×
                  </button>
                  <img
                    src={player.profile_image_url || "/default-avatar.png"}
                    alt={player.full_name}
                    className="object-cover rounded-lg max-h-[80vh] max-w-[80vw]"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="max-w-2xl px-6 py-4 mb-6 text-center border border-blue-100 shadow bg-blue-50 rounded-xl">
            <h2 className="mb-2 text-xl font-bold text-blue-800">نبذة عن اللاعب</h2>
            <p className="text-lg font-medium leading-relaxed text-gray-700">{player.brief || "لا توجد نبذة متاحة عن اللاعب"}</p>
          </div>
        </div>

        {/* البيانات الشخصية */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">البيانات الشخصية</h2>
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex justify-center w-full mb-4 md:w-1/3 md:mb-0">
              <img
                src="/images/personal-info.svg"
                alt="صورة بيانات شخصية"
                className="w-40 h-40"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = "https://via.placeholder.com/160?text=Personal+Info";
                }}
              />
            </div>
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-blue-50">
                  <div className="mb-1 font-semibold text-blue-700">الاسم الكامل</div>
                  <div className="text-lg font-bold text-blue-900">{player.full_name ? player.full_name : <MissingField />}</div>
                </div>
                <div className="p-4 rounded-lg bg-green-50">
                  <div className="mb-1 font-semibold text-green-700">تاريخ الميلاد</div>
                  <div className="text-lg font-bold text-green-900">{player.birth_date ? dayjs(player.birth_date).format('DD/MM/YYYY') : <MissingField />}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-white shadow-sm px-2 pt-2 pb-0 flex justify-center sticky top-[48px] z-10">
          <div className="flex p-1 mb-2 space-x-1 overflow-x-auto bg-gray-100 shadow-sm rounded-xl">
            {TABS.map((tab, idx) => (
              <button
                key={tab.name}
                onClick={() => setCurrentTab(idx)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-150
                  ${currentTab === idx ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-100 bg-white'}`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white shadow rounded-xl">
          {TABS[currentTab].render()}
        </div>
      </div>
    </div>
  );
};

export default PlayerReport;
