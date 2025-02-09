'use client';

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { 
  Bell, Mail, Search, User, ChartBar, Eye, 
  MessageSquare, Heart, UserCheck, Video, 
  Activity, FileText, Zap, Brain, Target, Settings, LogOut
} from 'lucide-react';
import Link from 'next/link';

// مكون رسالة الترحيب
function WelcomePopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Close the popup after 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full animate-fade-in">
        <div className="text-center">
          <img src="/hagzz-logo.png" alt="HAGZZ GO" className="h-20 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">🎉 مرحبًا بك في HAGZZ GO</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            لنبدأ رحلتك نحو الاحتراف. قم بتخصيص ملفك الشخصي الآن واحصل على أفضل الفرص في عالم كرة القدم!
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
          >
            ابدأ الآن 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlayerDashboard() {
  const [showWelcome, setShowWelcome] = useState(true);

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
      <div className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-20 flex items-center justify-center`}>
            {React.createElement(stat.icon as React.ComponentType<any>, { className: `w-6 h-6 ${stat.color.replace('bg-', 'text-')}` })}
          </div>
          <span className="text-sm px-2 py-1 rounded-full bg-gray-100">{stat.change}</span>
        </div>
        <div className="mt-4">
          <h3 className="text-gray-600 text-sm">{stat.title}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{stat.value}</p>
            <span className="text-sm text-gray-500">{stat.subText}</span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
          <span className="text-sm text-gray-500 mt-2">{label}</span>
        </div>
      </div>
    );
  }

  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-cairo">
      {showWelcome && <WelcomePopup onClose={handleCloseWelcome} />}

      {/* القائمة الجانبية */}
      <aside className="fixed right-0 w-80 h-screen bg-white shadow-lg z-20">
        <div className="p-6 bg-gradient-to-bl from-blue-600 to-blue-800 text-white">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img
              src="/player-avatar.jpg"
              alt="صورة اللاعب"
              className="rounded-full border-4 border-white shadow-lg w-full h-full object-cover"
            />
            <span className="absolute bottom-0 left-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <h2 className="text-xl font-bold text-center">أحمد محمد</h2>
          <p className="text-blue-200 text-center">مهاجم</p>
        </div>

        <nav className="p-4 space-y-2">
        {[
          { icon: ChartBar, label: 'النظرة العامة', value: 'overview', link: '/dashboard/player' },
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
      <main className="mr-80 mt-16 p-8">
        {/* الهيدر */}
        <header className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-blue-600 to-blue-800">
                طريقك نحو العالمية! 🌟
              </h1>
              <p className="text-gray-600 mt-1">اصنع مستقبلك في عالم كرة القدم</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-64 pr-10 pl-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" />
              </div>
              <div className="flex gap-4">
                <button className="relative p-2 rounded-lg hover:bg-gray-100">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Mail className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockData.stats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* المهارات والتقدم */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">المهارات الفنية</h3>
            <div className="space-y-6">
              {mockData.skills.technical.map((skill, index) => (
                <SkillBar key={index} skill={skill} />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">المهارات البدنية</h3>
            <div className="space-y-6">
              {mockData.skills.physical.map((skill, index) => (
                <SkillBar key={index} skill={skill} />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">المهارات النفسية</h3>
            <div className="space-y-6">
              {mockData.skills.social.map((skill, index) => (
                <SkillBar key={index} skill={skill} />
              ))}
            </div>
          </Card>
        </div>

        {/* الرسائل والتقدم */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">آخر الرسائل</h3>
              <Link href="/messages" className="text-blue-600 hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {mockData.messages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center space-x-4 space-x-reverse p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={message.avatar}
                      alt={message.sender}
                      className="w-12 h-12 rounded-full border border-gray-200"
                    />
                    {message.priority === 'high' && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{message.sender}</h4>
                      <span className="text-sm text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">تقدم الملف الشخصي</h3>
            <div className="flex flex-col items-center">
              <ProgressCircle 
                value={mockData.personalProgress.total} 
                label="اكتمال الملف"
              />
              <div className="w-full mt-6 space-y-4">
                {Object.entries(mockData.personalProgress.sections).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{key}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-transform duration-1000"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                تحديث الملف
              </button>
            </div>
          </Card>
        </div>

        {/* معرض الوسائط */}
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">معرض الوسائط</h3>
              <button className="text-blue-600 hover:underline">إضافة وسائط</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockData.media.images.map((image, index) => (
                <div key={index} className="group relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3">
                      <h4 className="text-white font-medium">{image.title}</h4>
                      <p className="text-gray-300 text-sm">{image.date}</p>
                    </div>
                  </div>
                </div>
              ))}
              {mockData.media.videos.map((video, index) => (
                <div key={`video-${index}`} className="group relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3">
                      <h4 className="text-white font-medium">{video.title}</h4>
                      <p className="text-gray-300 text-sm">{video.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* الفوتر */}
      <footer className="fixed bottom-0 left-0 right-80 bg-white border-t z-30">
        <div className="container mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/hagzz-logo.png" alt="HAGZZ GO" className="h-8" />
              <p className="text-sm text-gray-600">
                © 2024 HAGZZ GO جميع الحقوق محفوظة
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">عن المنصة</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">الشروط والأحكام</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">سياسة الخصوصية</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">اتصل بنا</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}