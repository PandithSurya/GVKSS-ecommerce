import React from 'react';
import { Milk, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import type { Product } from '../../types';

interface NaturalProductsShowcaseProps {
  onOpenDetails: (product: Product) => void;
  onViewAll: () => void;
}

export const NaturalProductsShowcase: React.FC<NaturalProductsShowcaseProps> = ({
  onOpenDetails,
  onViewAll
}) => {
  const { language, t } = useLanguage();

  const naturalProducts = products
    .filter(
      p =>
        p.isNaturalProduct ||
        p.category === 'natural-dairy' ||
        p.category === 'herbal-eco'
    )
    .slice(0, 4);

  return (
    <section className="py-16 bg-transparent border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Milk className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {language === 'te'
                  ? 'దేశీ గో ఆధారిత & సహజ ఉత్పత్తులు'
                  : 'Desi Cow & Forest Gathered'}
              </span>
            </div>
            <h2 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-stone-900">
              {t.sections.naturalCowTitle}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1.5 max-w-xl">
              {t.sections.naturalCowSub}
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="self-start sm:self-auto px-5 py-2.5 rounded-full border border-emerald-600 text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-600 hover:text-white transition flex items-center gap-1.5 shrink-0"
          >
            <span>
              {language === 'te'
                ? 'అన్ని సహజ ఉత్పత్తులు'
                : 'View All Natural Products'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {naturalProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
