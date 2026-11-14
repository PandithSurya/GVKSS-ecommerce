import React from 'react';
import { Phone, MessageCircle, MapPin, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TopBanner: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-emerald-950 text-white text-xs py-2 px-4 border-b border-emerald-900/60 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Free delivery notice */}
        <div className="flex items-center gap-2 font-medium">
          <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            {t.topAnnouncement}{' '}
            <a
              href="tel:9391628344"
              className="text-white font-bold hover:underline ml-1 inline-flex items-center gap-1"
            >
              <Phone className="w-3 h-3 inline text-emerald-400" /> 9391628344 / 9346749301
            </a>
          </span>
        </div>

        {/* Right: Location & Fast WhatsApp link */}
        <div className="flex items-center gap-4 shrink-0 text-[11px]">
          <div className="hidden md:flex items-center gap-1 text-emerald-300">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>Saroornagar, Kothapet & Begumpet, Hyderabad</span>
          </div>

          <a
            href="https://wa.me/919391628344?text=Hello%20GVKSS%2C%20I%20would%20like%20to%20place%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-700/60 text-white hover:bg-emerald-600 transition font-semibold"
          >
            <MessageCircle className="w-3 h-3 text-emerald-300" />
            <span>{t.orderOnWhatsApp}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
