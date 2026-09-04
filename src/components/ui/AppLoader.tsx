import React, { useEffect, useState } from 'react';
import { Leaf, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AppLoaderProps {
  onLoadingComplete: () => void;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ onLoadingComplete }) => {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    { en: 'Nurturing Heirloom Seeds...', te: 'సంప్రదాయ విత్తనాల సేకరణ...' },
    { en: 'Extracting Cold-Pressed Oils...', te: 'ఎద్దు గానుగ నూనెల తయారీ...' },
    { en: 'Churning Vedic Bilona Ghee...', te: 'సాంప్రదాయ బిలోనా నెయ్యి...' },
    { en: 'Welcome to Pure Organic Living', te: 'సహజ ఆహార ప్రపంచానికి స్వాగతం' }
  ];

  useEffect(() => {
    // 1. Smooth Progress Counter Simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 40 ? 6 : prev < 80 ? 8 : 12;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    // 2. Status message cycling
    const statusInterval = setInterval(() => {
      setStatusIndex(prev => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Trigger smooth fade out to pure blank canvas
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 150);

      // Transition to blank canvas and trigger webpage pop-up
      const doneTimeout = setTimeout(() => {
        onLoadingComplete();
      }, 650);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(doneTimeout);
      };
    }
  }, [progress, onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-stone-900 transition-all duration-500 ease-out select-none ${
        isFadingOut
          ? 'opacity-0 scale-95 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Soft Organic Glow Rings */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute w-[320px] h-[320px] bg-green-200/40 rounded-full blur-2xl pointer-events-none"></div>

      {/* Decorative Corner Leaf Accents */}
      <div className="absolute top-8 left-8 opacity-20 text-emerald-600 hidden sm:block animate-float-slow">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>

      <div className="absolute bottom-8 right-8 opacity-20 text-emerald-600 hidden sm:block animate-float-slow-reverse">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 rotate-180">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>

      {/* Center Brand & Animated Sprout Loader */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md space-y-6">
        
        {/* Animated Sprouting Emblem with Official Logo */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer Rotating Emerald Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 border-r-emerald-500 animate-spin"></div>
          
          {/* Secondary Counter-Rotating Dash Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '8s' }}></div>

          {/* Central Logo Emblem */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white p-1 shadow-green-glow border-2 border-emerald-400 flex items-center justify-center transform hover:scale-105 transition-transform">
            <img
              src="/images/logo.png"
              alt="Gau Vishwa Kalyan Samrakshana Samithi Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Floating Organic Sparkle */}
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md border border-emerald-200 flex items-center justify-center text-emerald-600 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-extrabold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>REGD. NO. 320 OF 2024</span>
          </div>

          <h1 className="font-sans font-black text-2xl sm:text-3xl text-stone-900 tracking-tight">
            GVKSS
          </h1>

          <p className="text-xs font-bold text-emerald-700">
            {language === 'te'
              ? 'గో విశ్వ కళ్యాణ స్వచ్ఛంద సేవా సంస్థ'
              : 'Go Vishwa Kalyana Voluntary Service Organization'}
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full max-w-xs space-y-2.5 pt-2">
          {/* Progress Bar Track */}
          <div className="w-full h-2 rounded-full bg-emerald-100/80 overflow-hidden p-0.5 border border-emerald-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 transition-all duration-150 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status Text and Percentage */}
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500">
            <span className="text-emerald-800 animate-fadeIn font-medium">
              {language === 'te'
                ? statuses[statusIndex].te
                : statuses[statusIndex].en}
            </span>
            <span className="font-mono text-emerald-600 font-bold">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
