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
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-10 h-10 rounded-xl bg-white text-stone-700 border border-stone-200/90 shadow-md hover:bg-stone-50 transition-colors flex items-center justify-center"
        >
          <ArrowUp className="w-4 h-4 text-emerald-800" />
        </button>
      )}

      {/* Call Direct Helpline */}
      <a
        href="tel:9391628344"
        aria-label="Call GVKSS"
        className="group flex items-center gap-2 bg-stone-900 text-white pl-3.5 pr-4 py-2 rounded-xl shadow-md hover:bg-black transition-colors border border-stone-800"
      >
        <Phone className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold hidden sm:inline">
          {language === 'te' ? 'కాల్ చేయండి: 9391628344' : 'Call 9391628344'}
        </span>
      </a>

      {/* WhatsApp Quick Order Button */}
      <a
        href="https://wa.me/919391628344?text=Namaste%20GVKSS%2C%20I%20want%20to%20order%20organic%20groceries."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="group flex items-center gap-2.5 bg-emerald-800 text-white pl-3.5 pr-4 py-2.5 rounded-xl shadow-md hover:bg-emerald-900 transition-colors border border-emerald-700"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-700 flex items-center justify-center">
          <MessageCircle className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="text-left">
          <span className="block text-[10px] font-medium text-emerald-200 uppercase tracking-wider leading-none">
            {language === 'te' ? 'తక్షణ ఆర్డర్' : 'Fast Order'}
          </span>
          <span className="block text-xs font-bold leading-tight mt-0.5">
            {language === 'te' ? 'వాట్సాప్ ఆర్డర్' : 'WhatsApp Order'}
          </span>
        </div>
      </a>
    </div>
  );
};
