import React from 'react';
import { Filter, X, Sparkles, Leaf, CheckCircle2 } from 'lucide-react';
import { categories } from '../../data/categories';
import { useLanguage } from '../../context/LanguageContext';
import type { CategoryId, FilterState } from '../../types';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  resultCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  resultCount
}) => {
  const { language, t } = useLanguage();

  const handleCategorySelect = (categoryId: CategoryId) => {
    onFilterChange({ ...filters, category: categoryId });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const activeCategoryObj = categories.find((c) => c.id === filters.category);

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.sortBy !== 'featured' ||
    filters.onlyInStock ||
    filters.onlyFeatured;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-50">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h3 className="font-sans font-bold text-base text-stone-900">
            {language === 'te' ? 'వర్గాల వారీగా ఎంపిక & సారాంశం' : 'Categories & Health Summaries'}
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
            {resultCount} {t.items}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-stone-500 hover:text-red-600 font-bold flex items-center gap-1 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t.search.clearFilters}</span>
          </button>
        )}
      </div>

      {/* Categories Pills */}
      <div>
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
          {language === 'te' ? 'వర్గాన్ని ఎంచుకోండి:' : 'Select Desired Category:'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {/* All Products Option */}
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              filters.category === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50/70 hover:bg-emerald-100 text-stone-700 border border-emerald-200'
            }`}
          >
            <span>{language === 'te' ? 'అన్ని ఉత్పత్తులు' : 'All Products'}</span>
          </button>

          {categories.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50/70 hover:bg-emerald-100 text-stone-700 border border-emerald-200'
                }`}
              >
                <span>{language === 'te' ? cat.teluguName : cat.name}</span>
                {cat.badge && !isSelected && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 hidden sm:inline">
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Health Summary Spotlight Card */}
      {activeCategoryObj && (
        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-emerald-950">
                {language === 'te' ? activeCategoryObj.teluguName : activeCategoryObj.name}
              </span>
              {activeCategoryObj.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                  {activeCategoryObj.badge}
                </span>
              )}
            </div>
            <p className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{language === 'te' ? activeCategoryObj.benefitTe : activeCategoryObj.benefitEn}</span>
            </p>
            <p className="text-[11px] text-stone-600">
              {language === 'te' ? activeCategoryObj.teluguDescription : activeCategoryObj.description}
            </p>
          </div>
          <div className="shrink-0 text-xs font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm">
            {resultCount} {language === 'te' ? 'ఉత్పత్తులు అందుబాటులో ఉన్నాయి' : 'Items Available'}
          </div>
        </div>
      )}

      {/* Sorting */}
      <div>
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          {t.search.sortBy}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'featured', label: t.recommended },
            { id: 'price-low', label: t.search.priceLowHigh },
            { id: 'price-high', label: t.search.priceHighLow },
            { id: 'name', label: t.search.alphabetical }
          ].map((sort) => (
            <button
              key={sort.id}
              onClick={() =>
                handleSortChange(sort.id as FilterState['sortBy'])
              }
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                filters.sortBy === sort.id
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-600'
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Checkboxes */}
      <div className="pt-3 border-t border-emerald-50 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyInStock}
            onChange={(e) =>
              onFilterChange({ ...filters, onlyInStock: e.target.checked })
            }
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span>{t.inStock}</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyFeatured}
            onChange={(e) =>
              onFilterChange({ ...filters, onlyFeatured: e.target.checked })
            }
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Featured Specials</span>
          </span>
        </label>
      </div>
    </div>
  );
};
