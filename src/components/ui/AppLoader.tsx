import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
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
    { en: 'Preserving Heirloom Seeds...', te: 'సంప్రదాయ విత్తనాల సేకరణ...' },
    { en: 'Extracting Cold-Pressed Oils...', te: 'ఎద్దు గానుగ నూనెల తయారీ...' },
    { en: 'Churning Vedic Bilona Ghee...', te: 'సాంప్రదాయ బిలోనా నెయ్యి...' },
    { en: 'Pure Traditional Goodness', te: 'సహజ ఆహార ప్రపంచానికి స్వాగతం' }
  ];

  useEffect(() => {
    // Smooth, linear progress progression
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

    // Status message cycling
    const statusInterval = setInterval(() => {
      setStatusIndex(prev => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 180);

      const doneTimeout = setTimeout(() => {
        onLoadingComplete();
      }, 600);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(doneTimeout);
      };
    }
  }, [progress, onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fafaf9] text-stone-900 transition-opacity duration-500 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Soft Ambient Depth */}
      <div className="absolute w-[420px] h-[420px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand & Progress Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm space-y-6">
        
        {/* Minimal Circular Emblem */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Subtle Outer Spinner */}
          <div className="absolute inset-0 rounded-full border-2 border-stone-200 border-t-emerald-800 animate-spin"></div>

          {/* Central Logo */}
          <div className="w-18 h-18 rounded-full bg-white p-2 shadow-sm border border-stone-200/80 flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="Gau Vishwa Kalyan Samrakshana Samithi Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10.5px] font-bold border border-stone-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>REGD. NO. 320 OF 2024</span>
          </div>

          <h1 className="font-sans font-black text-2xl text-stone-900 tracking-tight">
            GVKSS
          </h1>

          <p className="text-xs font-semibold text-emerald-800">
            {language === 'te'
              ? 'గో విశ్వ కళ్యాణ స్వచ్ఛంద సేవా సంస్థ'
              : 'Go Vishwa Kalyana Voluntary Service Organization'}
          </p>
        </div>

        {/* Minimal Progress Bar & Text */}
        <div className="w-full max-w-xs space-y-2 pt-1">
          <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-800 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500">
            <span className="text-stone-700 truncate mr-2">
              {language === 'te'
                ? statuses[statusIndex].te
                : statuses[statusIndex].en}
            </span>
            <span className="font-mono text-emerald-800 font-semibold">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
