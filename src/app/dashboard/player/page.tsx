'use client';

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { 
  AlertCircle, 
  Award, 
  Badge, 
  BookOpen,
  Eye, 
  Mail, 
  Heart, 
  UserCheck, 
  BarChart,
  User, 
  Activity, 
  MessageSquare, 
  FileText,
  Zap, 
  Brain, 
  Target, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Video
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase/config';
import { getDoc, doc } from 'firebase/firestore';

// مكون رسالة الترحيب
function WelcomePopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Close the popup after 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl animate-fade-in">
        <Image src="/hagzz-logo.png" alt="HAGZZ GO" width={80} height={80} className="h-20 mx-auto mb-6" />
        <h2 className="mb-4 text-2xl font-bold">🎉 مرحبًا بك في HAGZZ GO</h2>
        <p className="mb-8 leading-relaxed text-gray-600">
          لنبدأ رحلتك نحو الاحتراف. قم بتخصيص ملفك الشخصي الآن واحصل على أفضل الفرص في عالم كرة القدم!
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
        >
          ابدأ الآن 🚀
        </button>
      </div>
    </div>
  );
}

export default function PlayerDashboard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
            console.log('بيانات المستخدم:', userDoc.data());
          }
        }
      } catch (error) {
        console.error('خطأ في جلب بيانات المستخدم:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  // بيانات اللاعب الوهمية
  const mockData = {
    stats: [
      { 
        icon: Eye, 
        title: "المشاهدات", 
        value: "1,234", 
        subText: "مشاهدات الملف",
        change: "+12%", 
        color: "bg-blue-500",
        viewers: {
          clubs: 450,
          agents: 320,
          trainers: 280,
          marketers: 184
        }
      },
      { 
        icon: Mail, 
        title: "الرسائل", 
        value: "48", 
        subText: "رسالة جديدة",
        change: "+8%", 
        color: "bg-violet-500",
        distribution: {
          clubs: 20,
          agents: 15,
          trainers: 13
        }
      },
      { 
        icon: Heart, 
        title: "الإعجابات", 
        value: "2.1K", 
        subText: "إعجاب",
        change: "+5%", 
        color: "bg-pink-500" 
      },
      { 
        icon: UserCheck, 
        title: "المتابعون", 
        value: "856", 
        subText: "متابع",
        change: "+12%", 
        color: "bg-green-500" 
      }
    ],
    skills: {
      technical: [
        { name: "التحكم بالكرة", value: 85, color: "bg-blue-600" },
        { name: "التمرير", value: 78, color: "bg-blue-600" },
        { name: "التسديد", value: 90, color: "bg-blue-600" },
        { name: "المراوغة", value: 82, color: "bg-blue-600" }
      ],
      physical: [
        { name: "السرعة", value: 88, color: "bg-green-600" },
        { name: "القوة", value: 75, color: "bg-green-600" },
        { name: "التحمل", value: 85, color: "bg-green-600" }
      ],
      social: [
        { name: "العمل الجماعي", value: 90, color: "bg-purple-600" },
        { name: "التواصل", value: 85, color: "bg-purple-600" },
        { name: "الانضباط", value: 95, color: "bg-purple-600" },
        { name: "الثقة بالنفس", value: 88, color: "bg-purple-600" },
        { name: "تحمل الضغط", value: 82, color: "bg-purple-600" }
      ],
      medical: {
        bloodType: "A+",
        height: 180,
        weight: 75,
        bmi: 23.1,
        conditions: [],
        lastCheckup: "2024-01-15"
      }
    },
    messages: [
      {
        id: 1,
        sender: "نادي الهلال",
        type: "club",
        content: "دعوة لتجربة أداء",
        time: "منذ ساعتين",
        avatar: "/club-avatar.png",
        unread: true,
        priority: "high"
      },
      {
        id: 2,
        sender: "وكيل معتمد",
        type: "agent",
        content: "عرض احتراف جديد",
        time: "منذ 3 ساعات",
        avatar: "/agent-avatar.png",
        unread: true,
        priority: "medium"
      }
    ],
    media: {
      images: [
        { url: "/player-1.jpg", title: "تدريب", date: "2024-01-20" },
        { url: "/player-2.jpg", title: "مباراة", date: "2024-01-15" }
      ],
      videos: [
        { 
          url: "/video-1.mp4", 
          thumbnail: "/thumb-1.jpg",
          title: "أهداف المباراة",
          duration: "2:30"
        }
      ]
    },
    personalProgress: {
      total: 85,
      sections: {
        personal: 100,
        sports: 90,
        medical: 70,
        media: 80
      }
    }
  };

  // مكونات الواجهة
  interface Stat {
    icon: React.ComponentType;
    title: string;
    value: string;
    subText: string;
    change: string;
    color: string;
  }

  function StatsCard({ stat }: { stat: Stat }) {
    return (
      <div className="relative p-6 transition-all duration-300 bg-white shadow-sm rounded-2xl hover:shadow-lg group">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-20 flex items-center justify-center`}>
            {React.createElement(stat.icon as React.ComponentType<any>, { className: `w-6 h-6 ${stat.color.replace('bg-', 'text-')}` })}
          </div>
          <span className="px-2 py-1 text-sm bg-gray-100 rounded-full">{stat.change}</span>
        </div>
        <div className="mt-4">
          <h3 className="text-sm text-gray-600">{stat.title}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{stat.value}</p>
            <span className="text-sm text-gray-500">{stat.subText}</span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 transition-opacity opacity-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:opacity-100"></div>
      </div>
    );
  }

  interface Skill {
    name: string;
    value: number;
    color: string;
  }

  function SkillBar({ skill }: { skill: Skill }) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{skill.name}</span>
          <span>{skill.value}%</span>
        </div>
        <div className="h-2 overflow-hidden bg-gray-100 rounded-full">
          <div 
            className={`h-full ${skill.color} rounded-full transition-transform duration-1000`}
            style={{ width: `${skill.value}%`, transform: 'translateX(0)' }}
          />
        </div>
      </div>
    );
  }

  function ProgressCircle({ value, label, size = 180 }: { value: number; label: string; size?: number }) {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (100 - value) / 100 * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform rotate-90 rtl:-rotate-90" width={size} height={size}>
          <circle
            className="text-gray-100"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-blue-600 transition-all duration-1000"
            strokeWidth="10"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: progress
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-blue-600">{value}%</span>
          <span className="mt-2 text-sm text-gray-500">{label}</span>
        </div>
      </div>
    );
  }

  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-cairo">
      {showWelcome && <WelcomePopup onClose={handleCloseWelcome} />}

      {/* القائمة الجانبية */}
      <aside className="fixed right-0 z-20 h-screen bg-white shadow-lg w-80">
        <div className="p-6 text-white bg-gradient-to-bl from-blue-600 to-blue-800">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image
              src="/player-avatar.jpg"
              alt="صورة اللاعب"
              width={128}
              height={128}
              className="object-cover w-full h-full border-4 border-white rounded-full shadow-lg"
            />
            <span className="absolute bottom-0 left-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <h2 className="text-xl font-bold text-center">أحمد محمد</h2>
          <p className="text-center text-blue-200">مهاجم</p>
        </div>

        <nav className="p-4 space-y-2">
        {[
          { icon: BarChart, label: 'النظرة العامة', value: 'overview', link: '/dashboard/player' },
          { icon: User, label: 'الملف الشخصي', value: 'profile', link: '/dashboard/player/profile' },
          { icon: Activity, label: 'الإحصائيات', value: 'stats', link: '/dashboard/player/stats' },
          { icon: MessageSquare, label: 'الرسائل', value: 'messages', link: '/dashboard/player/messages' },
          { icon: FileText, label: 'التقارير', value: 'reports', link: '/dashboard/player/reports' },
          { icon: Zap, label: 'المهام', value: 'tasks', link: '/dashboard/player/tasks' },
          { icon: Brain, label: 'التحليلات', value: 'analytics', link: '/dashboard/player/analytics' },
          { icon: Target, label: 'الأهداف', value: 'objectives', link: '/dashboard/player/objectives' },
          { icon: Settings, label: 'الإعدادات', value: 'settings', link: '/dashboard/player/settings' },
          { icon: LogOut, label: 'تسجيل الخروج', value: 'logout', link: '/logout' },
        ].map((item) => (
          <Link
              key={item.value}
              href={item.link}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition-colors
                ${selectedTab === item.value 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="p-8 mt-16 mr-80">
        {/* الهيدر */}
        <header className="p-6 mb-8 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-blue-800">
                طريقك نحو العالمية! 🌟
              </h1>
              <p className="mt-1 text-gray-600">اصنع مستقبلك في عالم كرة القدم</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-64 py-2 pl-4 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" />
              </div>
              <div className="flex gap-4">
                <button className="relative p-2 rounded-lg hover:bg-gray-100">
                  <Bell className="w-6 h-6" />
                  <span className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1"></span>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Mail className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {mockData.stats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* المهارات والتقدم */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="mb-6 text-xl font-bold">المهارات الفنية</h3>
            <div className="space-y-6">
              {mockData.skills.technical.map((skill, index) => (
                <SkillBar key={index} skill={skill} />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-6 text-xl font-bold">المهارات البدنية</h3>
            <div className="space-y-6">
              {mockData.skills.physical.map((skill, index) => (
                <SkillBar key={index} skill={skill} />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-6 text-xl font-bold">المهارات النفسية</h3>
            <div className="space-y-6">
              {mockData.skills.social.map((skill, index) => (
                <SkillBar key={index} skill={skill} />
              ))}
            </div>
          </Card>
        </div>

        {/* الرسائل والتقدم */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">آخر الرسائل</h3>
              <Link href="/messages" className="text-blue-600 hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {mockData.messages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center p-4 space-x-4 space-x-reverse transition-colors bg-white rounded-lg hover:bg-gray-50"
                >
                  <div className="relative">
                    <Image
                      src={message.avatar}
                      alt={message.sender}
                      width={48}
                      height={48}
                      className="w-12 h-12 border border-gray-200 rounded-full"
                    />
                    {message.priority === 'high' && (
                      <span className="absolute w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-1 -right-1"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{message.sender}</h4>
                      <span className="text-sm text-gray-500">{message.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-6 text-xl font-bold">تقدم الملف الشخصي</h3>
            <div className="flex flex-col items-center">
              <ProgressCircle 
                value={mockData.personalProgress.total} 
                label="اكتمال الملف"
              />
              <div className="w-full mt-6 space-y-4">
                {Object.entries(mockData.personalProgress.sections).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-600">{key}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-100 rounded-full">
                      <div
                        className="h-full transition-transform duration-1000 bg-blue-600 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 mt-6 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                تحديث الملف
              </button>
            </div>
          </Card>
        </div>

        {/* معرض الوسائط */}
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">معرض الوسائط</h3>
              <button className="text-blue-600 hover:underline">إضافة وسائط</button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {mockData.media.images.map((image, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg group aspect-video">
                  <Image
                    src={image.url}
                    alt={image.title}
                    width={400}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100">
                    <div className="absolute bottom-3 left-3">
                      <h4 className="font-medium text-white">{image.title}</h4>
                      <p className="text-sm text-gray-300">{image.date}</p>
                    </div>
                  </div>
                </div>
              ))}
              {mockData.media.videos.map((video, index) => (
                <div key={`video-${index}`} className="relative overflow-hidden rounded-lg group aspect-video">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={400}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100">
                    <div className="absolute bottom-3 left-3">
                      <h4 className="font-medium text-white">{video.title}</h4>
                      <p className="text-sm text-gray-300">{video.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* الفوتر */}
      <footer className="fixed bottom-0 left-0 z-30 bg-white border-t right-80">
        <div className="container px-8 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image 
                src="/hagzz-logo.png" 
                alt="HAGZZ GO" 
                width={32}
                height={32}
                className="h-8" 
              />
              <p className="text-sm text-gray-600">
                © 2024 HAGZZ GO جميع الحقوق محفوظة
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">عن المنصة</a>
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">الشروط والأحكام</a>
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">سياسة الخصوصية</a>
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">اتصل بنا</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}