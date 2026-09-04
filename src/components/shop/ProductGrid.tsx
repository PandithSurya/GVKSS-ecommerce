import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { SearchX, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenDetails,
  onResetFilters
}) => {
  const { language, t } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center my-8 shadow-sm flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-stone-400 mb-4">
          <SearchX className="w-8 h-8 text-forest-700" />
        </div>
        <h3 className="font-serif font-bold text-xl text-forest-950 mb-1">
          {t.search.noResults}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mb-6">
          {language === 'te'
            ? 'వేరే పేరుతో వెతకండి లేదా ఫిల్టర్లను రీసెట్ చేయండి.'
            : 'Try searching with different keywords or resetting your active filters.'}
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 transition shadow-sm"
          >
            {t.search.clearFilters}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </div>
  );
};
