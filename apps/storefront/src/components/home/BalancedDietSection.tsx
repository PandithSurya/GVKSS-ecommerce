import React, { useState } from 'react';
import { Play, X, Leaf, CheckCircle2, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface BalancedDietSectionProps {
  onOrderClick: () => void;
  onLearnMoreClick?: () => void;
}

export const BalancedDietSection: React.FC<BalancedDietSectionProps> = ({
  onOrderClick
}) => {
  const { language } = useLanguage();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="py-16 sm:py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Round Organic Grains Platter with Bottom Green Arc */}
          <div className="lg:col-span-6 relative flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
              
              {/* Bottom Green Semi-Circle Arc Geometry */}
              <div
                className="absolute bottom-2 left-0 w-[84%] h-[84%] bg-foodieGreen rounded-full z-0 overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 opacity-95"></div>
              </div>

              {/* Circular Organic Staple Foods Platter */}
              <div className="relative z-10 w-[84%] h-[84%] rounded-full shadow-2xl p-1 bg-white border-4 border-white overflow-hidden transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/diet_organic_grains.jpg"
                  alt="Traditional unpolished rice, sprouted grains, dals, desi cow curd, and cold-pressed oil"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80';
                  }}
                />
              </div>

              {/* Natural Heritage Badge */}
              <div className="absolute -top-4 -left-2 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-emerald-200">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-stone-800">
                  Heirloom Non-GMO
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Typography & Action Buttons */}
          <div className="lg:col-span-6 space-y-6 text-left order-1 lg:order-2">
            <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-[1.18]">
              {language === 'te' ? (
                <>
                  సమతుల్య జీవనంలో <br />
                  <span className="text-emerald-600">సహజ ఆహారమే అత్యంత ముఖ్యం</span>
                </>
              ) : (
                <>
                  Food Is An Important part <br />
                  <span className="text-emerald-600">Of A Balanced Diet</span>
                </>
              )}
            </h2>

            <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              <p>
                {language === 'te'
                  ? 'కృత్రిమ రసాయనాలు, పామాయిల్ మరియు మైదా లేకుండా ప్రకృతి సిద్ధంగా పండించిన సంప్రదాయ చిరుధాన్యాలు శరీరానికి పూర్తి పోషకాలను, రోగనిరోధక శక్తిని అందిస్తాయి.'
                  : 'Pure, chemical-free traditional grains, cold-pressed oils, and indigenous Desi cow dairy provide the ideal foundation for lasting wellness and natural immunity.'}
              </p>

              <p className="text-stone-500 text-xs sm:text-sm">
                {language === 'te'
                  ? 'డీడీఎస్ మహిళా సంఘాల ద్వారా రసాయన రహిత సేంద్రీయ వ్యవసాయ పద్ధతులలో పండించిన రాగులు, జొన్నలు, కొర్రలు, మరియు దేశీ ఆవు A2 ఉత్పత్తులను మీ కుటుంబానికి అందించండి.'
                  : 'Cultivated with love and biodiversity by Deccan Development Society (DDS) women farmer collectives and GVKSS Go Viswa Kalyana Samrakshana Samithi.'}
              </p>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOrderClick}
                className="px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>{language === 'te' ? 'ఇప్పుడే ఆర్డర్ చేయండి' : 'Order Now'}</span>
              </button>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl text-stone-900 font-bold text-sm hover:bg-stone-100 transition group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition shrink-0">
                  <Play className="w-4 h-4 fill-current text-white ml-0.5" />
                </div>
                <span>{language === 'te' ? 'మా కథ & వీడియో' : 'Play Video'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Video & Story Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsVideoModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl z-10 border border-stone-200/90 text-left">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Leaf className="w-3.5 h-3.5" />
                <span>GVKSS Organic Movement</span>
              </div>
              <h3 className="font-sans font-black text-2xl text-stone-900">
                Traditional Organic Farming & Women Sanghams
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Learn how Deccan Development Society (DDS) and GVKSS empower rural women farmers across Telangana to preserve heirloom seeds, cultivate nutritious indigenous millets without chemical fertilizers, and produce pure cold-pressed oils.
              </p>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-950">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Traditional Multi-Cropping</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bull-Driven Wood Pressed Oils</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Desi Cow A2 Dairy & Pure Forest Honey</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    onOrderClick();
                  }}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                >
                  Explore Organic Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
