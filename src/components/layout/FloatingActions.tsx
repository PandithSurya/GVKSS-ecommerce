import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingActions: React.FC = () => {
  const { language } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 animate-pop-out" style={{ animationDelay: '650ms' }}>
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-11 h-11 rounded-full bg-white text-emerald-800 border border-emerald-200 shadow-lg hover:bg-emerald-50 transition flex items-center justify-center hover:scale-110"
        >
          <ArrowUp className="w-5 h-5 text-emerald-700" />
        </button>
      )}

      {/* Call Direct Helpline */}
      <a
        href="tel:9391628344"
        aria-label="Call GVKSS"
        className="group flex items-center gap-2 bg-emerald-900 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-lg hover:bg-emerald-950 transition hover:scale-105 border border-emerald-700"
      >
        <Phone className="w-5 h-5 text-emerald-300" />
        <span className="text-xs font-bold hidden sm:inline">
          {language === 'te' ? 'కాల్ చేయండి: 9391628344' : 'Call 9391628344'}
        </span>
      </a>

      {/* WhatsApp Quick Order Button */}
      <a
        href="https://wa.me/919391628344?text=Namaste%20GVKSS%2C%20I%20want%20to%20order%20organic%20groceries."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="group flex items-center gap-2.5 bg-emerald-600 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:bg-emerald-700 transition hover:scale-105 border-2 border-white/30"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <span className="block text-[10px] font-medium text-emerald-100 uppercase tracking-wider">
            {language === 'te' ? 'తక్షణ ఆర్డర్' : 'Fast Order'}
          </span>
          <span className="block text-xs font-extrabold leading-none">
            {language === 'te' ? 'వాట్సాప్ ఆర్డర్' : 'WhatsApp Order'}
          </span>
        </div>
      </a>
    </div>
  );
};
