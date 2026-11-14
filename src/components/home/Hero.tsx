import React from 'react';
import {
  Utensils,
  Smartphone,
  Truck,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Sparkles,
  Heart
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroProps {
  onShopClick: () => void;
  onPackClick: () => void;
  onDeliveryClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  onPackClick,
  onDeliveryClick
}) => {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-transparent pt-6 pb-16 lg:pt-10 lg:pb-24">
      {/* Subtle organic green background wash top-left */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-50/70 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Typography, CTA, and "Our Service" Cards */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
            <div className="space-y-3">
              {/* Element 1: Leaf Badge */}
              <div 
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80"
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {language === 'te'
                    ? '100% సేంద్రీయ & సహజ ఉత్పత్తులు'
                    : '100% Traditional & Organic Farm Staples'}
                </span>
              </div>

              {/* Element 2: Main Title */}
              <h1 
                className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-[54px] text-stone-900 tracking-tight leading-[1.15]"
              >
                {language === 'te' ? (
                  <>
                    మీ అభిమాన <br />
                    <span className="text-stone-900">సహజ ఆహారం</span> <br />
                    <span className="text-emerald-800">స్వచ్ఛంగా మీ చెంతకు</span>
                  </>
                ) : (
                  <>
                    Authentic Organic Food <br />
                    Delivered Pure & <br />
                    <span className="text-emerald-800">Fresh</span>
                  </>
                )}
              </h1>

              {/* Element 3: Paragraph Text */}
              <p 
                className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg pt-1 font-normal"
              >
                {language === 'te'
                  ? 'డీడీఎస్ మహిళా సంఘాల రైతుల నుండి నేరుగా సంప్రదాయ చిరుధాన్యాలు, ఎద్దు గానుగ నూనెలు, మొలక పిండి రకాలు మరియు స్వచ్ఛమైన సేంద్రీయ కిరాణా.'
                  : 'Authentic organic millets, wood-pressed oils, sprouted flours, Desi cow A2 dairy, and pure forest honey direct from GVKSS - Go Vishwa Kalyana Voluntary Service Organization.'}
              </p>
            </div>

            {/* Element 4: Sleek Primary CTA Button */}
            <div>
              <button
                onClick={onShopClick}
                className="px-7 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200 inline-flex items-center gap-2 group"
              >
                <span>{language === 'te' ? 'ఇప్పుడే ఆర్డర్ చేయండి' : 'Order Now'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Element 5: "Our Service" 3 Clean Cards */}
            <div className="pt-2 sm:pt-4 space-y-3">
              <h3 
                className="font-sans font-bold text-sm uppercase tracking-wider text-stone-500"
              >
                {language === 'te' ? 'మా సేవలు' : 'Our Services'}
              </h3>

              <div className="grid grid-cols-3 gap-3 max-w-lg">
                {/* Service Card 1 */}
                <div
                  onClick={onShopClick}
                  className="bg-white hover:bg-stone-50/80 border border-stone-200/80 hover:border-emerald-600/40 rounded-xl p-3 sm:p-3.5 cursor-pointer shadow-subtle hover:shadow transition-all duration-200 flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-200">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                      {language === 'te' ? 'సేంద్రీయ కిరాణా' : 'Organic Staples'}
                    </h4>
                    <span className="text-[10px] text-stone-500 hidden sm:block mt-0.5">
                      100% Pure Food
                    </span>
                  </div>
                </div>

                {/* Service Card 2 */}
                <div
                  onClick={onPackClick}
                  className="bg-emerald-50/70 hover:bg-emerald-100/60 border border-emerald-200/80 rounded-xl p-3 sm:p-3.5 cursor-pointer shadow-subtle transition-all duration-200 flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-emerald-950 leading-tight">
                      {language === 'te' ? 'నెలవారీ ప్యాక్' : 'Monthly Packs'}
                    </h4>
                    <span className="text-[10px] text-emerald-800 font-medium hidden sm:block mt-0.5">
                      Subscribed Box
                    </span>
                  </div>
                </div>

                {/* Service Card 3 */}
                <div
                  onClick={onDeliveryClick || onShopClick}
                  className="bg-white hover:bg-stone-50/80 border border-stone-200/80 hover:border-emerald-600/40 rounded-xl p-3 sm:p-3.5 cursor-pointer shadow-subtle hover:shadow transition-all duration-200 flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-200">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                      {language === 'te' ? 'హోమ్ డెలివరీ' : 'Doorstep Delivery'}
                    </h4>
                    <span className="text-[10px] text-stone-500 hidden sm:block mt-0.5">
                      Fast Dispatch
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Refined Organic Harvest Composition */}
          <div 
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
              
              {/* Subtle Natural Ambient Ring */}
              <div
                className="absolute w-[92%] h-[92%] rounded-full bg-emerald-900/5 border border-emerald-900/10 pointer-events-none"
              />

              {/* Main Circular Imagery with Clean White Border and Natural Shadow */}
              <div 
                className="relative z-10 w-[86%] h-[86%] rounded-full shadow-lg p-1.5 bg-white border border-stone-200/90 overflow-hidden"
              >
                <img
                  src="/images/hero_innovative_emblem.jpg"
                  alt="GVKSS - Go Vishwa Kalyana Voluntary Service Organization - Nurturing hands holding organic harvest platter"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero_organic_products.jpg';
                  }}
                />
              </div>

              {/* Floating Badge 1: Top-Left (A2 Bilona Ghee) */}
              <div 
                className="absolute top-2 left-0 z-20 hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-subtle border border-stone-200 cursor-pointer hover:border-emerald-600/40 transition-colors"
                onClick={onShopClick}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-xs font-semibold text-stone-800">
                  {language === 'te' ? 'బిలోనా A2 నెయ్యి' : 'A2 Bilona Ghee'}
                </span>
              </div>

              {/* Floating Badge 2: Top-Right (Wood-Pressed Oils) */}
              <div 
                className="absolute top-6 right-0 z-20 hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-subtle border border-stone-200 cursor-pointer hover:border-emerald-600/40 transition-colors"
                onClick={onShopClick}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-xs font-semibold text-stone-800">
                  {language === 'te' ? 'ఎద్దు గానుగ నూనెలు' : 'Cold-Pressed Oils'}
                </span>
              </div>

              {/* Verified Organic Badge Corner */}
              <div 
                className="absolute -bottom-3 right-4 z-20 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-md border border-stone-200" 
              >
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div className="text-left">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block leading-none">
                    DDS & GVKSS
                  </span>
                  <span className="text-xs font-extrabold text-emerald-900 leading-none">
                    100% Certified Organic
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
