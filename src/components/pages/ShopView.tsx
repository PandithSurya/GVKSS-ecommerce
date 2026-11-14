import React, { useState, useMemo, useEffect } from 'react';
import { products } from '../../data/products';
import { ProductFilters } from '../shop/ProductFilters';
import { ProductGrid } from '../shop/ProductGrid';
import { Product, CategoryId, FilterState } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Leaf } from 'lucide-react';

interface ShopViewProps {
  initialCategory?: CategoryId;
  onOpenDetails: (product: Product) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  initialCategory = 'all',
  onOpenDetails
}) => {
  const { language, t } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    priceRange: [0, 5000],
    onlyInStock: false,
    onlyFeatured: false,
    sortBy: 'featured'
  });

  // Sync state whenever initialCategory prop changes from external navigation
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: initialCategory
    }));
  }, [initialCategory]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category filter
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // 2. In Stock filter
    if (filters.onlyInStock) {
      result = result.filter(p => p.available);
    }

    // 3. Featured filter
    if (filters.onlyFeatured) {
      result = result.filter(p => p.isFeatured);
    }

    // 4. Sorting
    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'featured') {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 5000],
      onlyInStock: false,
      onlyFeatured: false,
      sortBy: 'featured'
    });
  };

  return (
    <div className="py-10 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title Banner */}
        <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-md border-b-4 border-emerald-600">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-700">
              <Leaf className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {language === 'te'
                  ? 'పూర్తి సహజ ఉత్పత్తుల కేటలాగ్'
                  : '100% Traditional & Organic Store'}
              </span>
            </div>
            <h1 className="font-sans font-black text-2xl sm:text-4xl text-white">
              {t.nav.shop}
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              {language === 'te'
                ? 'సేంద్రీయ రైతుల నుండి నేరుగా సేకరించిన స్వచ్ఛమైన చిరుధాన్యాలు, పిండి రకాలు, ఎద్దు గానుగ నూనెలు మరియు సేంద్రీయ కిరాణా.'
                : 'Browse our complete range of certified GVKSS organic millets, stone ground flours, cold-pressed oils, and farm-fresh natural staples.'}
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <ProductFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          resultCount={filteredProducts.length}
        />

        {/* Results Count & Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-600 font-semibold px-1">
            <span>
              {t.search.showingProducts.replace(
                '{count}',
                filteredProducts.length.toString()
              )}
            </span>
          </div>

          <ProductGrid
            products={filteredProducts}
            onOpenDetails={onOpenDetails}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
};
