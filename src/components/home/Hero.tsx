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
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            <div className="space-y-2">
              {/* Element 1: Leaf Badge Pops Out */}
              <div 
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 animate-pop-out hover:scale-105 transition-transform cursor-default" 
                style={{ animationDelay: '120ms' }}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>
                  {language === 'te'
                    ? '100% సేంద్రీయ & సహజ ఉత్పత్తులు'
                    : '100% Traditional & Organic Farm Staples'}
                </span>
              </div>

              {/* Element 2: Main Big Title Pops Out */}
              <h1 
                className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.12] animate-pop-out" 
                style={{ animationDelay: '220ms' }}
              >
                {language === 'te' ? (
                  <>
                    మీ అభిమాన <br />
                    <span className="text-stone-900">సహజ ఆహారం</span> <br />
                    <span className="text-emerald-600">స్వచ్ఛంగా మీ చెంతకు</span>
                  </>
                ) : (
                  <>
                    Your Favourite Food <br />
                    Delivered Hot & <br />
                    <span className="text-emerald-600">Fresh</span>
                  </>
                )}
              </h1>

              {/* Element 3: Paragraph Text Pops Out */}
              <p 
                className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg pt-2 font-normal animate-pop-out" 
                style={{ animationDelay: '320ms' }}
              >
                {language === 'te'
                  ? 'డీడీఎస్ మహిళా సంఘాల రైతుల నుండి నేరుగా సంప్రదాయ చిరుధాన్యాలు, ఎద్దు గానుగ నూనెలు, మొలక పిండి రకాలు మరియు స్వచ్ఛమైన సేంద్రీయ కిరాణా.'
                  : 'Authentic organic millets, wood-pressed oils, sprouted flours, Desi cow A2 dairy, and pure forest honey direct from GVKSS - Go Vishwa Kalyana Voluntary Service Organization.'}
              </p>
            </div>

            {/* Element 4: Pill "Order Now" Button Pops Out with Spring Bounce & Shine */}
            <div className="animate-pop-out" style={{ animationDelay: '420ms' }}>
              <button
                onClick={onShopClick}
                className="shine-effect px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-green-glow hover:shadow-green-glow-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2 group"
              >
                <span>{language === 'te' ? 'ఇప్పుడే ఆర్డర్ చేయండి' : 'Order Now'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>

            {/* Element 5: "Our Service" 3 Cards Staggered Pop-Out */}
            <div className="pt-4 sm:pt-6 space-y-3">
              <h3 
                className="font-sans font-black text-lg sm:text-xl text-stone-900 animate-pop-out" 
                style={{ animationDelay: '480ms' }}
              >
                {language === 'te' ? 'మా సేవలు' : 'Our Service'}
              </h3>

              <div className="grid grid-cols-3 gap-3 max-w-lg">
                {/* Service Card 1 */}
                <div
                  onClick={onShopClick}
                  className="bg-white/90 backdrop-blur-sm hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-300 rounded-2xl p-3 sm:p-4 cursor-pointer shadow-foodie-card hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left group transform hover:-translate-y-1 hover:scale-105 animate-pop-out"
                  style={{ animationDelay: '520ms' }}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                      {language === 'te' ? 'సేంద్రీయ కిరాణా' : 'Catering Service'}
                    </h4>
                    <span className="text-[10px] text-stone-500 hidden sm:block mt-0.5">
                      100% Pure Food
                    </span>
                  </div>
                </div>

                {/* Service Card 2: Active Card */}
                <div
                  onClick={onPackClick}
                  className="bg-emerald-50/90 backdrop-blur-sm hover:bg-emerald-100/90 border border-emerald-300 rounded-2xl p-3 sm:p-4 cursor-pointer shadow-foodie-card transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left group transform scale-[1.02] hover:-translate-y-1 hover:scale-105 animate-pop-out"
                  style={{ animationDelay: '600ms' }}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-emerald-950 leading-tight">
                      {language === 'te' ? 'నెలవారీ ప్యాక్' : 'Online Booking'}
                    </h4>
                    <span className="text-[10px] text-emerald-700 font-semibold hidden sm:block mt-0.5">
                      Monthly Packs
                    </span>
                  </div>
                </div>

                {/* Service Card 3 */}
                <div
                  onClick={onDeliveryClick || onShopClick}
                  className="bg-white/90 backdrop-blur-sm hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-300 rounded-2xl p-3 sm:p-4 cursor-pointer shadow-foodie-card hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left group transform hover:-translate-y-1 hover:scale-105 animate-pop-out"
                  style={{ animationDelay: '680ms' }}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                      {language === 'te' ? 'హోమ్ డెలివరీ' : 'Delivery Service'}
                    </h4>
                    <span className="text-[10px] text-stone-500 hidden sm:block mt-0.5">
                      Fast Doorstep
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Innovative Logo-Inspired Organic Composition (Hands Holding Platter & Leaf Wreath) */}
          <div 
            className="lg:col-span-6 relative flex items-center justify-center animate-pop-out-bloom" 
            style={{ animationDelay: '250ms' }}
          >
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              
              {/* Vibrant Green Semi-Circle Arc Backdrop with Pulse Glow */}
              <div
                className="absolute top-4 right-0 w-[88%] h-[88%] bg-foodieGreen rounded-full z-0 overflow-hidden shadow-green-glow animate-pop-out-bloom"
                style={{ animationDelay: '200ms' }}
              >
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 opacity-95"></div>
              </div>

              {/* Innovative Composition: Bangle-Adorned Hands Holding Farm Platter Wreath */}
              <div 
                className="relative z-10 w-[88%] h-[88%] rounded-full shadow-2xl p-1 bg-white border-4 border-white overflow-hidden transform hover:scale-105 transition-transform duration-500 animate-pop-out-bloom group"
                style={{ animationDelay: '300ms' }}
              >
                <img
                  src="/images/hero_innovative_emblem.jpg"
                  alt="GVKSS - Go Vishwa Kalyana Voluntary Service Organization - Nurturing hands holding organic harvest platter"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero_organic_products.jpg';
                  }}
                />
              </div>

              {/* Interactive Floating Badge 1: Top-Left (A2 Bilona Ghee) */}
              <div 
                className="absolute -top-2 -left-2 z-20 hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-emerald-200 animate-pop-out hover:scale-110 transition-transform cursor-pointer"
                style={{ animationDelay: '650ms' }}
                onClick={onShopClick}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-stone-800">
                  {language === 'te' ? 'బిలోనా A2 నెయ్యి' : 'A2 Bilona Ghee'}
                </span>
              </div>

              {/* Interactive Floating Badge 2: Top-Right (Wood-Pressed Oils) */}
              <div 
                className="absolute top-4 -right-3 z-20 hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-emerald-200 animate-pop-out hover:scale-110 transition-transform cursor-pointer"
                style={{ animationDelay: '700ms' }}
                onClick={onShopClick}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-stone-800">
                  {language === 'te' ? 'ఎద్దు గానుగ నూనెలు' : 'Cold-Pressed Oils'}
                </span>
              </div>

              {/* Verified Organic Badge Corner (Pops Out) */}
              <div 
                className="absolute -bottom-6 right-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-xl border border-emerald-200 animate-pop-out hover:scale-105 transition-transform" 
                style={{ animationDelay: '750ms' }}
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
                <div className="text-left">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block leading-none">
                    DDS & GVKSS
                  </span>
                  <span className="text-xs font-black text-emerald-900 leading-none">
                    100% Pure Organic
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
