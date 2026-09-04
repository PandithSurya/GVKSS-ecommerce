import React from 'react';
import {
  ShieldCheck,
  Truck,
  Leaf,
  Users,
  Sun
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TrustSection: React.FC = () => {
  const { language, t } = useLanguage();

  const pillars = [
    {
      icon: Users,
      titleEn: 'Women Sangham Empowered',
      titleTe: 'మహిళా సంఘాల భాగస్వామ్యం',
      descEn:
        'Cultivated and processed by Deccan Development Society (DDS) rural women farmer collectives.',
      descTe:
        'డీడీఎస్ మహిళా సంఘాల ద్వారా రసాయనాలు లేకుండా సంప్రదాయ పద్ధతుల్లో పండించినవి.'
    },
    {
      icon: ShieldCheck,
      titleEn: '100% Pesticide & Chemical Free',
      titleTe: '100% సహజ సేంద్రీయ వ్యవసాయం',
      descEn:
        'Pure indigenous heirloom seeds grown using natural compost, Jeevamrutham, and zero pesticides.',
      descTe:
        'జీవామృతం, దేశీ ఎరువులతో పండించిన స్వచ్ఛమైన దేశవాళీ పంటలు.'
    },
    {
      icon: Sun,
      titleEn: 'Bull-Driven Wood Pressed Oils',
      titleTe: 'ఎద్దు గానుగ / చెక్క గానుగ నూనెలు',
      descEn:
        'Cold-extracted at low temperatures to preserve natural antioxidants, aroma, and essential fatty acids.',
      descTe:
        'వేడి లేకుండా సాంప్రదాయ పద్ధతిలో తీసిన పల్లి మరియు కుసుమ నూనెలు.'
    },
    {
      icon: Truck,
      titleEn: 'Reliable Doorstep Delivery',
      titleTe: 'విశ్వసనీయమైన హోమ్ డెలివరీ',
      descEn:
        'Freshly milled and packed provisions delivered safely to homes across Hyderabad.',
      descTe:
        'తాజా పిండి, నూనెలు, నిత్యావసరాలు నేరుగా మీ ఇంటి వద్దకే చేరవేస్తాము.'
    }
  ];

  return (
    <section className="py-16 bg-transparent border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'te' ? 'మా నిబద్ధత' : 'Our Purity Promise'}</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-stone-900">
            {t.sections.whyChooseUs}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-cream-100/60 rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-foodie transition text-center sm:text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto sm:mx-0 mb-4 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-stone-900">
                    {language === 'te' ? item.titleTe : item.titleEn}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {language === 'te' ? item.descTe : item.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
