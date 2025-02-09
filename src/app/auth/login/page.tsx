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

  const handleInputChange = (e: { target: { name: string; value: string; type: string; checked: boolean; }; }) => {
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
      className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-600 to-purple-700"
      dir="rtl"
    >
      <div className="w-full max-w-xl overflow-hidden transition-all duration-500 transform bg-white shadow-2xl rounded-xl hover:scale-102">
        {/* Header */}
        <div className="p-6 text-center text-white bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">مرحباً بعودتك</h1>
          <p className="text-blue-100">قم بتسجيل الدخول للوصول إلى حسابك</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {/* Alert Messages */}
          {error && (
            <div className="flex items-center gap-2 p-4 text-red-700 rounded-lg bg-red-50">
              <AlertTriangle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}
          {message && (
            <div className="flex items-center gap-2 p-4 text-green-700 rounded-lg bg-green-50">
              <CheckCircle className="w-5 h-5" />
              <p>{message}</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-4 text-sm text-blue-700 rounded-lg bg-blue-50">
            <KeyRound className="flex-shrink-0 w-5 h-5" />
            <p>جميع البيانات مشفرة ومحمية باستخدام أحدث تقنيات التشفير والحماية</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="relative">
              <label className="block mb-2 text-gray-700">رقم الهاتف</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل رقم الهاتف"
                  required
                />
                <Phone className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
              </div>
            </div>

            <div className="relative">
              <label className="block mb-2 text-gray-700">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                <label className="text-sm text-gray-600">تذكرني</label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
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
                <Loader2 className="w-5 h-5 animate-spin" />
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
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              سجل الآن
            </button>
          </div>

          {/* Security Features */}
          <div className="pt-6 mt-6 border-t">
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>تسجيل الدخول آمن ومشفر بالكامل</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>حماية متقدمة ضد الاختراق والتسلل</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
