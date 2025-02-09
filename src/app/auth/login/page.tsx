'use client';

import { useState } from 'react';
import { auth } from "@/lib/firebase/config";
import { loginUser } from '@/lib/firebase/auth-provider';
import {
  User,
  Lock,
  Phone,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Loader2,
  KeyRound,
} from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await loginUser(formData.phone, formData.password);
      setMessage('تم تسجيل الدخول بنجاح! جاري تحويلك...');

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userPhone', formData.phone);
      }
      // استخدام next/navigation بدلاً من window.location

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      const error = err as { code: string; message: string };
      if (error.code === 'auth/invalid-credential') {
        setError('بيانات الاعتماد غير صحيحة. تحقق من رقم الهاتف وكلمة المرور.');
      } else if (error.code === 'auth/user-not-found') {
        setError('المستخدم غير موجود. يرجى التسجيل أولاً.');
      } else if (error.code === 'auth/wrong-password') {
        setError('كلمة المرور غير صحيحة. حاول مرة أخرى.');
      } else {
        setError(`خطأ غير متوقع: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex justify-center items-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden transform transition-all duration-500 hover:scale-102">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">مرحباً بعودتك</h1>
          <p className="text-blue-100">قم بتسجيل الدخول للوصول إلى حسابك</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {/* Alert Messages */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
          {message && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <p>{message}</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
            <KeyRound className="h-5 w-5 flex-shrink-0" />
            <p>جميع البيانات مشفرة ومحمية باستخدام أحدث تقنيات التشفير والحماية</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-gray-700 mb-2">رقم الهاتف</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل رقم الهاتف"
                  required
                />
                <Phone className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-gray-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <Lock className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label className="text-gray-600 text-sm">تذكرني</label>
              </div>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 text-sm hover:underline"
                onClick={() => alert('سيتم إرسال رابط إعادة تعيين كلمة المرور إلى هاتفك')}
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all flex items-center justify-center gap-2
              ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>

          {/* Register Link */}
          <div className="text-center text-gray-600">
            ليس لديك حساب؟{' '}
            <button
              type="button"
              onClick={() => (window.location.href = '/auth/register')}
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              سجل الآن
            </button>
          </div>

          {/* Security Features */}
          <div className="border-t pt-6 mt-6">
            <div className="text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>تسجيل الدخول آمن ومشفر بالكامل</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>حماية متقدمة ضد الاختراق والتسلل</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
