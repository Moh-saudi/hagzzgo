'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Star, MapPin, Mail, Phone, ChevronLeft, Brain, Trophy, Network, Globe } from 'lucide-react';
<<<<<<< HEAD
import Image from 'next/image';
=======
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6

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
<<<<<<< HEAD
      image: "/slider/1.png",
=======
      image: "/api/placeholder/1920/1080",
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
      gradient: "from-blue-900/90 to-blue-600/90"
    },
    {
      title: "فرص احترافية حقيقية",
      subtitle: "نوفر لك فرص الانضمام لأكبر الأندية في أوروبا والوطن العربي",
<<<<<<< HEAD
      image: "/slider/2.png",
      gradient: "from-green-900/90 to-green-600/90"
    },
    {
      title: "عنوان ثالث للسلايدر",
      subtitle: "نص توضيحي للسلايدر الثالث",
      image: "/slider/3.png",
      gradient: "from-purple-900/90 to-purple-600/90"
=======
      image: "/api/placeholder/1920/1080",
      gradient: "from-green-900/90 to-green-600/90"
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
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
<<<<<<< HEAD
      <header className="fixed z-50 w-full shadow-lg bg-white/90 backdrop-blur-sm">
        <nav className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/hagzz-logo.png" alt="Logo" className="w-auto h-10" />
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text">
                Hagzz Go
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="items-center hidden space-x-8 space-x-reverse md:flex">
              <a href="#services" className="transition-colors hover:text-blue-600">خدماتنا</a>
              <a href="#packages" className="transition-colors hover:text-blue-600">الباقات</a>
              <a href="#careers" className="transition-colors hover:text-blue-600">الوظائف</a>
              <a href="#contact" className="transition-colors hover:text-blue-600">اتصل بنا</a>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.location.href = '/auth/login'}
                  className="px-6 py-2 text-white transition-all bg-blue-500 rounded-lg hover:bg-blue-700"
                >
                  تسجيل الدخول
                </button>
                <button 
                  onClick={() => window.location.href = '/auth/register'}
                  className="px-8 py-2 text-xl font-bold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  ابدأ رحلتك الآن
                </button>
              </div>
=======
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
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
<<<<<<< HEAD
            <div className="pt-4 pb-2 md:hidden">
=======
            <div className="md:hidden pt-4 pb-2">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <a href="#services" className="block py-2">خدماتنا</a>
              <a href="#packages" className="block py-2">الباقات</a>
              <a href="#careers" className="block py-2">الوظائف</a>
              <a href="#contact" className="block py-2">اتصل بنا</a>
<<<<<<< HEAD
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => window.location.href = '/auth/login'}
                  className="w-1/2 px-4 py-2 text-white bg-blue-500 rounded-lg"
                >
                  تسجيل الدخول
                </button>
                <button 
                  onClick={() => window.location.href = '/auth/register'}
                  className="w-1/2 px-4 py-2 text-white bg-blue-600 rounded-lg"
                >
                  ابدأ رحلتك الآن
                </button>
              </div>
=======
              <button 
                onClick={() => window.location.href = '/auth/login'}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                تسجيل الدخول
              </button>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
<<<<<<< HEAD
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              activeSlide === idx ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={`سلايدر ${idx+1}`}
              width={1920}
              height={800}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="container px-4 mx-auto">
                {/* تم حذف زر التسجيل من السلايدر */}
=======
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
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
<<<<<<< HEAD
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="mb-2 text-4xl font-bold text-blue-600">
=======
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
                {stats.visitors.toLocaleString()}+
              </div>
              <div className="text-gray-600">زائر شهريا</div>
            </div>
<<<<<<< HEAD
            <div className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="mb-2 text-4xl font-bold text-green-600">
=======
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
                {stats.deals.toLocaleString()}+
              </div>
              <div className="text-gray-600">صفقة ناجحة</div>
            </div>
<<<<<<< HEAD
            <div className="p-6 text-center bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl">
              <div className="mb-2 text-4xl font-bold text-amber-600">
=======
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
                {stats.players.toLocaleString()}+
              </div>
              <div className="text-gray-600">لاعب محترف</div>
            </div>
<<<<<<< HEAD
            <div className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="mb-2 text-4xl font-bold text-purple-600">
=======
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
                {stats.clubs.toLocaleString()}+
              </div>
              <div className="text-gray-600">نادي شريك</div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
<<<<<<< HEAD
        <div className="container px-4 mx-auto">
          <h2 className="mb-4 text-4xl font-bold text-center">باقات الاشتراك</h2>
          <p className="mb-12 text-xl text-center text-gray-600">اختر الباقة المناسبة وابدأ رحلة احترافك</p>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
=======
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">باقات الاشتراك</h2>
          <p className="text-xl text-gray-600 text-center mb-12">اختر الباقة المناسبة وابدأ رحلة احترافك</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-8 ${
                  pkg.isPopular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {pkg.isPopular && (
<<<<<<< HEAD
                  <div className="px-4 py-2 mb-4 text-sm text-center text-white bg-blue-500 rounded-full">
                    الأكثر طلباً
                  </div>
                )}
                <h3 className="mb-4 text-2xl font-bold text-center">{pkg.title}</h3>
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold text-blue-600">${pkg.price}</span>
                  <span className="mr-2 text-gray-400 line-through">${pkg.originalPrice}</span>
                  <span className="px-2 py-1 mr-2 text-sm text-green-600 bg-green-100 rounded-full">
                    خصم {pkg.discount}
                  </span>
                </div>
                <ul className="mb-8 space-y-4">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <ChevronRight className="ml-2 text-green-500" />
=======
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
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
<<<<<<< HEAD
                  onClick={() => window.location.href = '/auth/register'}
                  className="w-full py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
=======
                  onClick={() => window.location.href = `/dashboard/payment?plan=${pkg.title}&price=${pkg.price}`}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
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
<<<<<<< HEAD
        <div className="container px-4 mx-auto">
          <h2 className="mb-4 text-3xl font-bold text-center">خدماتنا</h2>
          <p className="mb-12 text-center text-gray-600">نقدم لك خدمات مميزة تساعدك على تحقيق أحلامك</p>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-6 transition-all duration-300 transform shadow-md group bg-gray-50 rounded-xl hover:shadow-xl hover:-translate-y-1">
=======
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">خدماتنا</h2>
          <p className="text-gray-600 text-center mb-12">نقدم لك خدمات مميزة تساعدك على تحقيق أحلامك</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  تحليل الأداء
                </h3>
                <Star className="text-yellow-500" />
              </div>
<<<<<<< HEAD
              <p className="mb-4 text-gray-600">نقدم لك تحليل دقيق لأدائك ونساعدك على تحسين نقاط الضعف</p>
=======
              <p className="text-gray-600 mb-4">نقدم لك تحليل دقيق لأدائك ونساعدك على تحسين نقاط الضعف</p>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اعرف المزيد
              </button>
            </div>
<<<<<<< HEAD
            <div className="p-6 transition-all duration-300 transform shadow-md group bg-gray-50 rounded-xl hover:shadow-xl hover:-translate-y-1">
=======
            <div className="group bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  العروض الاحترافية
                </h3>
                <Star className="text-yellow-500" />
              </div>
<<<<<<< HEAD
              <p className="mb-4 text-gray-600">نقدم لك عروض احترافية للأندية العالمية والمحلية</p>
            </div> <div className="p-6 transition-all duration-300 transform shadow-md group bg-gray-50 rounded-xl hover:shadow-xl hover:-translate-y-1">
=======
              <p className="text-gray-600 mb-4">نقدم لك عروض احترافية للأندية العالمية والمحلية</p>
            </div> <div className="group bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  المعايشات الدولية والمحلية
                </h3>
                <Star className="text-yellow-500" />
              </div>
<<<<<<< HEAD
              <p className="mb-4 text-gray-600">نقدم لك عروض معايشات للأندية العالمية والمحلية في دول  قطر والامارات  والجزائر والسعودية</p>
            </div> <div className="p-6 transition-all duration-300 transform shadow-md group bg-gray-50 rounded-xl hover:shadow-xl hover:-translate-y-1">
=======
              <p className="text-gray-600 mb-4">نقدم لك عروض معايشات للأندية العالمية والمحلية في دول  قطر والامارات  والجزائر والسعودية</p>
            </div> <div className="group bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  تسويق اللاعبين
                </h3>
                <Star className="text-yellow-500" />
              </div>
<<<<<<< HEAD
              <p className="mb-4 text-gray-600">بناء جسور مع الاندية والوكلاء الرياضيين من كل دول العالم </p>
=======
              <p className="text-gray-600 mb-4">بناء جسور مع الاندية والوكلاء الرياضيين من كل دول العالم </p>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
<<<<<<< HEAD
        <div className="container px-4 mx-auto">
          <h2 className="mb-4 text-3xl font-bold text-center">الوظائف</h2>
          <p className="mb-12 text-center text-gray-600">انضم إلى فريقنا المتميز وساهم في تحقيق أحلام الشباب</p>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-6 transition-all duration-300 transform bg-white shadow-md group rounded-xl hover:shadow-xl hover:-translate-y-1">
=======
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">الوظائف</h2>
          <p className="text-gray-600 text-center mb-12">انضم إلى فريقنا المتميز وساهم في تحقيق أحلام الشباب</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  محلل الأداء
                </h3>
                <Star className="text-yellow-500" />
              </div>
<<<<<<< HEAD
              <p className="mb-4 text-gray-600">نبحث عن محللين متخصصين في تحليل الأداء وتقديم النصائح</p>
=======
              <p className="text-gray-600 mb-4">نبحث عن محللين متخصصين في تحليل الأداء وتقديم النصائح</p>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>
<<<<<<< HEAD
            <div className="p-6 transition-all duration-300 transform bg-white shadow-md group rounded-xl hover:shadow-xl hover:-translate-y-1">
=======
            <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  قسم العروض
                </h3>
                <Star className="text-yellow-500" />
              </div>
<<<<<<< HEAD
              <p className="mb-4 text-gray-600">نبحث عن مديرين اشخاص لديهم مهارات التفاوض وعداد العروض الرياضية والتعاقدات للعمل في فرع في مصر </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>  <div className="p-6 transition-all duration-300 transform bg-white shadow-md group rounded-xl hover:shadow-xl hover:-translate-y-1">
=======
              <p className="text-gray-600 mb-4">نبحث عن مديرين اشخاص لديهم مهارات التفاوض وعداد العروض الرياضية والتعاقدات للعمل في فرع في مصر </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>  <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                    قسم التسويق  
                </h3>
                <Star className="text-yellow-500" />
              </div>
<<<<<<< HEAD
              <p className="mb-4 text-gray-600">نبحث عن مديير لقسم التسويق والشركات الاستراتيجية </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>  <div className="p-6 transition-all duration-300 transform bg-white shadow-md group rounded-xl hover:shadow-xl hover:-translate-y-1">
=======
              <p className="text-gray-600 mb-4">نبحث عن مديير لقسم التسويق والشركات الاستراتيجية </p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>  <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                قسم العلاقات الدولية  
                </h3>
                <Star className="text-yellow-500" />
              </div>
<<<<<<< HEAD
              <p className="mb-4 text-gray-600">نبحث عن مسئول العلاقات الدولية بالسعودية  والامارات وقطر</p>
=======
              <p className="text-gray-600 mb-4">نبحث عن مسئول العلاقات الدولية بالسعودية  والامارات وقطر</p>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>
<<<<<<< HEAD
            <div className="p-6 transition-all duration-300 transform bg-white shadow-md group rounded-xl hover:shadow-xl hover:-translate-y-1">
=======
            <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                   قسم المعايشات  
                </h3>
                <Star className="text-yellow-500" />
              </div>
<<<<<<< HEAD
              <p className="mb-4 text-gray-600">نبحث عن رئيس قسم للمعايشات المحلية في قطر ومصر والسعودية والامارات </p>
=======
              <p className="text-gray-600 mb-4">نبحث عن رئيس قسم للمعايشات المحلية في قطر ومصر والسعودية والامارات </p>
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                اتصل بنا
              </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
<<<<<<< HEAD
      <footer id="contact" className="py-16 text-white bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left column */}
            <div>
              <h3 className="mb-4 text-2xl font-bold">تواصل معنا</h3>
              <p className="mb-4 text-gray-400">نحن هنا لمساعدتك في تحقيق أحلامك</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MapPin className="mr-2 text-gray-400" />
                  <span className="text-gray-400">المقر الرئيسي: مركز قطر للمال</span>
                </li>
                <li className="flex items-center">
                  <Phone className="mr-2 text-gray-400" />
                  <span className="text-gray-400">قطر: +974-72053188</span>
                </li>
                <li className="flex items-center">
                  <Phone className="mr-2 text-gray-400" />
                  <span className="text-gray-400">مصر: +20-01017799580</span>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-2 text-gray-400" />
                  <a href="mailto:hazz@mesk.qa" className="text-gray-400 transition-colors hover:text-white">
                    hazz@mesk.qa
                  </a>
                </li>
=======
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
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
              </ul>
            </div>
            
            {/* Right column */}
            <div>
<<<<<<< HEAD
              <h3 className="mb-4 text-2xl font-bold">تابعنا</h3>
              <p className="mb-4 text-gray-400">
                تابعنا على وسائل التواصل الاجتماعي للبقاء على اطلاع بآخر الأخبار والعروض
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="فيسبوك">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="تويتر">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z"/></svg>
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="إنستجرام">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.809 2.256 6.089 2.243 6.498 2.243 12c0 5.502.013 5.911.072 7.191.059 1.277.353 2.45 1.32 3.417.967.967 2.14 1.261 3.417 1.32 1.28.059 1.689.072 7.191.072s5.911-.013 7.191-.072c1.277-.059 2.45-.353 3.417-1.32.967-.967 1.261-2.14 1.32-3.417.059-1.28.072-1.689.072-7.191s-.013-5.911-.072-7.191c-.059-1.277-.353-2.45-1.32-3.417C21.05.425 19.877.131 18.6.072 17.32.013 16.911 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-white" aria-label="لينكدإن">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v5.597z"/></svg>
=======
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
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

