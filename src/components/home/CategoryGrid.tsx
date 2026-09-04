import React from 'react';
import { categories } from '../../data/categories';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Leaf } from 'lucide-react';
import type { CategoryId } from '../../types';

interface CategoryGridProps {
  onSelectCategory: (catId: CategoryId) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 bg-transparent border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'te' ? 'సహజ ఆహార వర్గాలు' : 'Fresh & Pure Categories'}</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-stone-900">
            {t.sections.featuredCategories}
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            {t.sections.featuredCategoriesSub}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-3xl p-4 border border-stone-200/80 hover:border-emerald-400 shadow-sm hover:shadow-foodie transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden relative transform hover:-translate-y-1.5"
            >
              {cat.badge && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {cat.badge}
                </span>
              )}

              <div>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-emerald-50/50 p-1">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-sans font-bold text-sm sm:text-base text-stone-900 group-hover:text-emerald-700 transition leading-snug">
                  {cat.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-800 font-telugu mt-0.5">
                  {cat.teluguName}
                </p>
                {/* Health Benefit Summary */}
                <p className="text-[10.5px] font-medium text-emerald-700 leading-tight mt-1 line-clamp-2">
                  {language === 'te' ? cat.benefitTe : cat.benefitEn}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>{language === 'te' ? 'చూడండి' : 'Explore'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
