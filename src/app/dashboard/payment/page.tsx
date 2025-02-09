'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Upload, CreditCard, Star, Trophy, Crown, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from 'lucide-react';






const PaymentVerification = () => {
  const [selectedPackage, setSelectedPackage] = useState<'3months' | '6months' | 'yearly'>('3months');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(true);

  
  const packages = {
    '3months': {
      title: 'باقة النجم الصاعد ⭐',
      price: '60 جنيه مصري',
      originalPrice: '80 جنيه مصري',
      period: '3 شهور',
      discount: '25%',
      features: [
        'إنشاء ملف شخصي احترافي كامل',
        'إضافة صور وفيديوهات غير محدودة',
        'الظهور في نتائج البحث',
        'التواصل مع 5 أفراد شهرياً',
        'حضور تجارب الأداء',
        'الدعم الفني علي مدار الساعة',
        'تحديثات مجانية للمميزات الجديدة'
      ]
    },
    '6months': {
      title: 'باقة المحترف المتألق 🏆',
      price: '110 جنيه مصري',
      originalPrice: '150 جنيه مصري',
      period: '6 شهور',
      discount: '27%',
      features: [
        'جميع مميزات باقة النجم الصاعد',
        'التواصل مع 15 نادي شهرياً',
        'إشارة لمدير مميز',
        'إحصائيات متقدمة للملف الشخصي',
        'تقارير شهرية عن أداء حسابك',
        'أولوية في الظهور بنتائج البحث',
        'دعوات حصرية لمعسكرات تدريبية'
      ]
    },
    'yearly': {
      title: 'باقة النخبة الذهبية 👑',
      price: '150 جنيه مصري',
      originalPrice: '220 جنيه مصري',
      period: 'سنة كاملة',
      discount: '32%',
      features: [
        'جميع مميزات باقة المحترف المتألق',
        'تواصل غير محدود مع الأندية',
        'إشارة لاعب محترف',
        'أعلى أولوية في الظهور',
        'تحليل شهري من مدربين محترفين',
        'جلسات استشارية مع خبراء رياضيين',
        'عضوية VIP وخصومات خاصة'
      ]
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setFile(file);
    } else {
      alert('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
    }
  };

  const phoneNumbers: { [key: string]: string } = {
    'فودافون كاش': '01017795500',
    'اتصالات كاش': '01517795500',
    'بنك الأهلي': '01217795500'
  };

  const CreditCardForm = () => (
    <div className="space-y-4">
      <Input placeholder="رقم البطاقة" className="w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="MM/YY" />
        <Input placeholder="CVV" type="password" maxLength={3} />
      </div>
      <Input placeholder="الاسم على البطاقة" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="px-6 py-4 mb-8 bg-white shadow-sm">
        <div className="container flex items-center justify-between mx-auto">
          <h1 className="text-2xl font-bold text-blue-600">Hagzz-Go</h1>
          <nav className="space-x-4">
            <Button variant="ghost">الرئيسية</Button>
            <Button variant="ghost">الملف الشخصي</Button>
            <Button variant="ghost">تواصل معنا</Button>
          </nav>
        </div>
      </header>

      <div className="container max-w-6xl p-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">اختر باقة الاشتراك المناسبة</h2>
          <p className="text-gray-600">ابدأ رحلتك الاحترافية مع أفضل الباقات المصممة خصيصاً لك</p>
        </div>
        
        {/* Packages Section */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {Object.entries(packages).map(([key, pack]) => (
            <Card 
              key={key}
              className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedPackage === key ? 'border-blue-500 border-2 shadow-lg' : ''
              }`}
              onClick={() => setSelectedPackage(key as '3months' | '6months' | 'yearly')}
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="text-xl text-center">{pack.title}</CardTitle>
                <div className="text-center">
                  <span className="text-sm text-gray-500 line-through">{pack.originalPrice}</span>
                  <div className="text-3xl font-bold text-blue-600">{pack.price}</div>
                  <div className="font-semibold text-green-500">خصم {pack.discount}</div>
                  <div className="text-gray-500">{pack.period}</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pack.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="flex-shrink-0 w-5 h-5 ml-2 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => setSelectedPackage(key as '3months' | '6months' | 'yearly')}
                >
                  اختر هذه الباقة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

       {/* Payment Methods */}
<Card className="mb-8">
  <CardHeader>
    <CardTitle>اختر طريقة الدفع</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <TooltipProvider>
        {Object.keys(phoneNumbers).concat(['بطاقة ائتمان']).map(method => (
          <Tooltip key={method}>
            <TooltipTrigger asChild>
              <div> {/* استخدام div كحاوية */}
                <Button
                  variant={paymentMethod === method ? 'default' : 'outline'}
                  className="w-full h-20 text-lg"
                  onClick={() => {
                    setPaymentMethod(method);
                    setShowVerification(true);
                    setShowCreditCard(method === 'بطاقة ائتمان');
                  }}
                >
                  {method}
                  {method === 'بطاقة ائتمان' ? <CreditCard className="mr-2" /> : null}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {method === 'بطاقة ائتمان' 
                ? 'الدفع الآمن ببطاقة الائتمان'
                : `رقم المحفظة: ${phoneNumbers[method as keyof typeof phoneNumbers]}`
              }
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  </CardContent>
</Card>

       {/* Verification Section */}
{showVerification && (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>تأكيد الدفع</CardTitle>
    </CardHeader>
    <CardContent>
      {showCreditCard ? (
        <CreditCardForm />
      ) : (
        <>
          {/* Alert Section */}
          <div className="mb-6">
            <Alert open={showAlert} onOpenChange={setShowAlert}>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  برجاء تحويل مبلغ {packages[selectedPackage].price} إلى رقم {phoneNumbers[paymentMethod]}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-2 ml-2"
                  onClick={() => setShowAlert(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDescription>
            </Alert>
          </div>
          
          {/* Transfer Number Input */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                رقم عملية التحويل
              </label>
              <Input
                type="text"
                placeholder="أدخل رقم العملية من إيصال التحويل"
                className="w-full"
              />
            </div>
            
            {/* Receipt Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                صورة إيصال الدفع
              </label>
              <div className="p-4 text-center border-2 border-dashed rounded-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="receipt-upload"
                />
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  <Button variant="outline" className="w-full h-24">
                    <Upload className="ml-2" />
                    {file ? file.name : 'اضغط هنا لرفع صورة الإيصال'}
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button 
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Check className="ml-2" />
          تأكيد وإتمام الاشتراك
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
        >
          حفظ كمسودة
        </Button>
      </div>
    </CardContent>
  </Card>
)}

      {/* Footer */}
      </div>
      <footer className="py-8 mt-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 font-bold">تواصل معنا</h3>
              <p>البريد الإلكتروني: support@hagzz-go.com</p>
              <p>الهاتف: 19123</p>
            </div>
            <div>
              <h3 className="mb-4 font-bold">روابط سريعة</h3>
              <ul className="space-y-2">
                <li><Button variant="link">الأسئلة الشائعة</Button></li>
                <li><Button variant="link">سياسة الخصوصية</Button></li>
                <li><Button variant="link">الشروط والأحكام</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold">تابعنا</h3>
              <div className="flex space-x-4">
                <Button variant="ghost">فيسبوك</Button>
                <Button variant="ghost">تويتر</Button>
                <Button variant="ghost">انستغرام</Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentVerification;