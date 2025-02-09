'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Star, MapPin, Mail, Phone, ChevronLeft, Brain, Trophy, Network, Globe } from 'lucide-react';

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [stats, setStats] = useState({
    visitors: 0,
    deals: 0,
    players: 0,
    clubs: 0
  });

  // Hero Slider Data
  const heroSlides = [
    {
      title: "حول موهبتك إلى احتراف عالمي",
      subtitle: "نستخدم الذكاء الاصطناعي لتحليل أدائك وربطك بأفضل الأندية العالمية",
      image: "/api/placeholder/1920/1080",
      gradient: "from-blue-900/90 to-blue-600/90"
    },
    {
      title: "فرص احترافية حقيقية",
      subtitle: "نوفر لك فرص الانضمام لأكبر الأندية في أوروبا والوطن العربي",
      image: "/api/placeholder/1920/1080",
      gradient: "from-green-900/90 to-green-600/90"
    }
  ];

  // Subscription Packages
  const packages = [
    {
      title: "باقة 3 شهور",
      price: "2",
      originalPrice: "3",
      discount: "33%",
      features: [
        "تحليل أداء شهري",
        "عرض للأندية المحلية",
        "3 اختبارات",
        "دعم فني"
      ]
    },
    {
      title: "باقة 6 شهور",
      price: "6",
      originalPrice: "10",
      discount: "40%",
      isPopular: true,
      features: [
        "تحليل أداء أسبوعي",
        "عرض للأندية الإقليمية",
        "6 اختبارات",
        "دعم فني مباشر"
      ]
    },
    {
      title: "باقة سنوية",
      price: "10",
      originalPrice: "20",
      discount: "50%",
      features: [
        "تحليل أداء يومي",
        "عرض للأندية العالمية",
        "اختبارات غير محدودة",
        "دعم فني على مدار الساعة"
      ]
    }
  ];

  useEffect(() => {
    // Auto slide changer
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    // Stats counter animation
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        visitors: Math.min(prev.visitors + 100, 50000),
        deals: Math.min(prev.deals + 1, 150),
        players: Math.min(prev.players + 2, 500),
        clubs: Math.min(prev.clubs + 1, 200)
      }));
    }, 50);

    return () => {
      clearInterval(slideInterval);
      clearInterval(statsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm shadow-lg z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Hagzz Go
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a href="#services" className="hover:text-blue-600 transition-colors">خدماتنا</a>
              <a href="#packages" className="hover:text-blue-600 transition-colors">الباقات</a>
              <a href="#careers" className="hover:text-blue-600 transition-colors">الوظائف</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">اتصل بنا</a>
              <button 
                onClick={() => window.location.href = '/auth/login'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                تسجيل الدخول
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2">
              <a href="#services" className="block py-2">خدماتنا</a>
              <a href="#packages" className="block py-2">الباقات</a>
              <a href="#careers" className="block py-2">الوظائف</a>
              <a href="#contact" className="block py-2">اتصل بنا</a>
              <button 
                onClick={() => window.location.href = '/auth/login'}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                تسجيل الدخول
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              activeSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
            <div className="absolute inset-0 flex items-center justify-center text-white text-center">
              <div className="container mx-auto px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                <button 
                  onClick={() => window.location.href = '/auth/register'}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-50 transition-all"
                >
                  ابدأ رحلتك الآن
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.visitors.toLocaleString()}+
              </div>
              <div className="text-gray-600">زائر شهريا</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats.deals.toLocaleString()}+
              </div>
              <div className="text-gray-600">صفقة ناجحة</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">
                {stats.players.toLocaleString()}+
              </div>
              <div className="text-gray-600">لاعب محترف</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {stats.clubs.toLocaleString()}+
              </div>
              <div className="text-gray-600">نادي شريك</div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">باقات الاشتراك</h2>
          <p className="text-xl text-gray-600 text-center mb-12">اختر الباقة المناسبة وابدأ رحلة احترافك</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-8 ${
                  pkg.isPopular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {pkg.isPopular && (
                  <div className="bg-blue-500 text-white text-center py-2 px-4 rounded-full text-sm mb-4">
                    الأكثر طلباً
                  </div>
                )}
                <h3 className="text-2xl font-bold text-center mb-4">{pkg.title}</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-blue-600">${pkg.price}</span>
                  <span className="text-gray-400 line-through mr-2">${pkg.originalPrice}</span>
                  <span className="bg-green-100 text-green-600 text-sm px-2 py-1 rounded-full mr-2">
                    خصم {pkg.discount}
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <ChevronRight className="text-green-500 ml-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => window.location.href = `/dashboard/payment?plan=${pkg.title}&price=${pkg.price}`}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  اشترك الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">خدماتنا</h2>
          <p className="text-gray-600 text-center mb-12">نقدم لك خدمات مميزة تساعدك على تحقيق أحلامك</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  تحليل الأداء
                </h3>
                <Star className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">نقدم لك تحليل دقيق لأدائك ونساعدك على تحسين نقاط الضعف</p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اعرف المزيد
              </button>
            </div>
            <div className="group bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  العروض الاحترافية
                </h3>
                <Star className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">نقدم لك عروض احترافية للأندية العالمية والمحلية</p>
            </div> <div className="group bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  المعايشات الدولية والمحلية
                </h3>
                <Star className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">نقدم لك عروض معايشات للأندية العالمية والمحلية في دول  قطر والامارات  والجزائر والسعودية</p>
            </div> <div className="group bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  تسويق اللاعبين
                </h3>
                <Star className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">بناء جسور مع الاندية والوكلاء الرياضيين من كل دول العالم </p>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">الوظائف</h2>
          <p className="text-gray-600 text-center mb-12">انضم إلى فريقنا المتميز وساهم في تحقيق أحلام الشباب</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  محلل الأداء
                </h3>
                <Star className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">نبحث عن محللين متخصصين في تحليل الأداء وتقديم النصائح</p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>
            <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  قسم العروض
                </h3>
                <Star className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">نبحث عن مديرين اشخاص لديهم مهارات التفاوض وعداد العروض الرياضية والتعاقدات للعمل في فرع في مصر </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>  <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                    قسم التسويق  
                </h3>
                <Star className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">نبحث عن مديير لقسم التسويق والشركات الاستراتيجية </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>  <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                قسم العلاقات الدولية  
                </h3>
                <Star className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">نبحث عن مسئول العلاقات الدولية بالسعودية  والامارات وقطر</p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>
            <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                   قسم المعايشات  
                </h3>
                <Star className="text-yellow-500" />
              </div>
              <p className="text-gray-600 mb-4">نبحث عن رئيس قسم للمعايشات المحلية في قطر ومصر والسعودية والامارات </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div>
              <h3 className="text-2xl font-bold mb-4">تواصل معنا</h3>
              <p className="text-gray-400 mb-4">نحن هنا لمساعدتك في تحقيق أحلامك</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="text-gray-400 mr-2" />
                  <a href="mailto:info@example.com" className="text-gray-400 hover:text-white transition-colors">
                    info@example.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="text-gray-400 mr-2" />
                  <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">
                    +1234567890
                  </a>
                </li>
                <li className="flex items-center">
                  <MapPin className="text-gray-400 mr-2" />
                  <span className="text-gray-400"> 60 westbay, omer st, Doha, Qatar</span>
                  <span className="text-gray-400"> 155 abbas elakad St, Cairo, Egypt</span>
                  <span className="text-gray-400"> 768, khalifa St, Dubai, UHA</span>
                </li>
              </ul>
            </div>
            
            {/* Right column */}
            <div>
              <h3 className="text-2xl font-bold mb-4">تابعنا</h3>
              <p className="text-gray-400 mb-4">
                تابعنا على وسائل التواصل الاجتماعي للبقاء على اطلاع بآخر الأخبار والعروض
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Brain size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Trophy size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Network size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Globe size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

