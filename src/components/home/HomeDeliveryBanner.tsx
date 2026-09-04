import React from 'react';
import { Truck, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { businessInfo } from '../../data/businessInfo';

export const HomeDeliveryBanner: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-14 bg-emerald-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-bold">
              <Truck className="w-4 h-4 text-emerald-300" />
              <span>
                {language === 'te'
                  ? 'హోమ్ డెలివరీ సదుపాయం కలదు'
                  : 'Doorstep Home Delivery'}
              </span>
            </div>

            <h2 className="font-sans font-black text-2xl sm:text-4xl text-white leading-tight">
              {t.sections.homeDeliveryTitle}
            </h2>

            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              {t.sections.homeDeliverySub}
            </p>

            {/* Delivery Tiers Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {businessInfo.deliveryTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-950/70 p-3.5 rounded-2xl border border-emerald-800 text-left space-y-1"
                >
                  <span className="text-emerald-300 font-extrabold text-xs block">
                    {tier.range}
                  </span>
                  <p className="text-[11px] text-emerald-100">
                    {language === 'te' ? tier.conditionTe : tier.conditionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Action Box */}
          <div className="lg:col-span-5 bg-white text-stone-900 p-6 sm:p-7 rounded-3xl shadow-2xl border-4 border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  {language === 'te' ? 'ఆర్డర్ల కోసం సంప్రదించండి' : 'Quick Order Helpline'}
                </span>
                <span className="font-sans font-bold text-lg text-stone-900">
                  ప్రభాకర్ రెడ్డి (Prabhakar Reddy)
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <a
                href="tel:9391628344"
                className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-green-glow"
              >
                <Phone className="w-4 h-4 text-emerald-200" />
                <span>Call 9391628344</span>
              </a>

              <a
                href="tel:9346749301"
                className="w-full py-2.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Secondary Phone: 9346749301</span>
              </a>

              <a
                href="https://wa.me/919391628344?text=Namaste%2C%20I%20want%20to%20order%20groceries%20for%20home%20delivery."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
