import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, register } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        if (!fullName.trim() || fullName.length < 2) {
          throw new Error('Please enter your full name (at least 2 characters)');
        }
        if (!/^[0-9]{10}$/.test(phone)) {
          throw new Error('Please enter a valid 10-digit mobile number');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters with letters & numbers');
        }
        await register(fullName, email, password, phone);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-emerald-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="fixed inset-0" onClick={() => setIsAuthModalOpen(false)}></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200/90 z-10 my-6 animate-fadeIn">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-lg sm:text-xl">
                {authMode === 'login'
                  ? language === 'te'
                    ? 'లాగిన్ అవ్వండి'
                    : 'Customer Sign In'
                  : language === 'te'
                    ? 'ఖాతా సృష్టించండి'
                    : 'Create Customer Account'}
              </h2>
              <p className="text-xs text-emerald-200">
                {authMode === 'login'
                  ? 'Access your orders & saved addresses'
                  : 'Join GVKSS Organic community'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 p-1.5">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition ${
              authMode === 'login'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'te' ? 'లాగిన్' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition ${
              authMode === 'register'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'te' ? 'రిజిస్టర్' : 'Register'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'te' ? 'పూర్తి పేరు' : 'Full Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Reddy"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {language === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Number (10 digits)'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9391628344"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm font-mono"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {language === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:bg-stone-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>
                  {authMode === 'login'
                    ? language === 'te'
                      ? 'సైన్ ఇన్ అవ్వండి'
                      : 'Sign In to Account'
                    : language === 'te'
                      ? 'రిజిస్టర్ అవ్వండి'
                      : 'Create My Account'}
                </span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-stone-500 pt-1">
            {authMode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};
