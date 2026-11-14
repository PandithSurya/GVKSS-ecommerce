import React, { useState } from 'react';
import { Utensils, Cookie, ChefHat } from 'lucide-react';
import { products } from '../../data/products';
import { ProductGrid } from '../shop/ProductGrid';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ReadyToCookViewProps {
  onOpenDetails: (product: Product) => void;
  defaultSubtab?: 'cook' | 'eat';
}

export const ReadyToCookView: React.FC<ReadyToCookViewProps> = ({
  onOpenDetails,
  defaultSubtab = 'cook'
}) => {
  const { language, t } = useLanguage();
  const [subtab, setSubtab] = useState<'cook' | 'eat'>(defaultSubtab);

  const cookProducts = products.filter(
    p => p.isReadyToCook || p.category === 'ready-to-cook'
  );

  const eatProducts = products.filter(
    p =>
      p.isReadyToEat ||
      p.category === 'ready-to-eat' ||
      p.category === 'sweets-snacks'
  );

  const activeProducts = subtab === 'cook' ? cookProducts : eatProducts;

  return (
    <div className="py-10 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-md border-b-4 border-emerald-600">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-bold">
              <ChefHat className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {language === 'te'
                  ? 'కమ్యూనిటీ ప్రొడక్షన్ సెంటర్ ఉత్పత్తులు'
                  : 'Community Production Center Specialties'}
              </span>
            </div>
            <h1 className="font-sans font-black text-2xl sm:text-4xl text-white">
              {subtab === 'cook' ? t.nav.readyToCook : t.nav.readyToEat}
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              {language === 'te'
                ? 'సేంద్రీయ చిరుధాన్యాలు మరియు నాటు బెల్లంతో తయారైన స్వచ్ఛమైన మొలక పిండి, సేమియా, కిచిడి మిక్స్‌లు, మురుకులు మరియు కప్ కేకులు.'
                : '100% natural, preservative-free convenience foods made with sprouted grains, cold-pressed oils, and traditional jaggery.'}
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-full bg-white p-1.5 border border-emerald-200 shadow-sm max-w-md mx-auto">
          <button
            onClick={() => setSubtab('cook')}
            className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              subtab === 'cook'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-600 hover:text-emerald-800'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Ready to Cook ({cookProducts.length})</span>
          </button>

          <button
            onClick={() => setSubtab('eat')}
            className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              subtab === 'eat'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-600 hover:text-emerald-800'
            }`}
          >
            <Cookie className="w-4 h-4" />
            <span>Ready to Eat / Snacks ({eatProducts.length})</span>
          </button>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={activeProducts}
          onOpenDetails={onOpenDetails}
        />
      </div>
    </div>
  );
};
