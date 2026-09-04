import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { useLanguage } from '../../context/LanguageContext';
import type { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.teluguName.includes(query) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-emerald-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 z-10">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 flex items-center gap-3 bg-emerald-50/40">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'te'
                ? 'ఉత్పత్తుల కోసం వెతకండి (ఉదా: రాగులు, నూనె, పిండి)...'
                : 'Search millets, flours, cold-pressed oils, dairy...'
            }
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 outline-none placeholder:text-stone-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 px-2 py-1"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
          {query.trim() === '' ? (
            <div className="p-6 sm:p-8 text-center text-stone-400 text-xs sm:text-sm space-y-4">
              <p className="font-semibold text-stone-600">
                {language === 'te'
                  ? 'మీ ఆరోగ్య అవసరానికి తగిన వర్గాన్ని ఎంచుకోండి లేదా కీవర్డ్ నమోదు చేయండి:'
                  : 'Search by Health Need or Quick Popular Categories:'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { label: '🌾 Millets (Diabetes & Sugar)', query: 'Millet' },
                  { label: '💧 Wood Pressed Oils (Heart)', query: 'Oil' },
                  { label: '🥛 Desi Cow A2 Ghee & Honey', query: 'Ghee' },
                  { label: '🍲 Sprouted Flours (Enzyme Rich)', query: 'Flour' },
                  { label: '🍪 Healthy Snacks (No Palm Oil)', query: 'Murukulu' },
                  { label: '🌿 Forest Herbal & Organic Dals', query: 'Dal' }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => setQuery(chip.query)}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition border border-emerald-200 shadow-sm"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs sm:text-sm">
              <p>No organic products found matching "{query}".</p>
              <span className="text-xs text-stone-400 mt-1 block">
                Try searching in English or Telugu (e.g., "Ragi", "రాగులు", "Oil", "నూనె").
              </span>
            </div>
          ) : (
            <div className="divide-y divide-emerald-50">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-emerald-50/70 transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-emerald-700 transition truncate">
                        {p.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-emerald-800 font-telugu truncate">
                        {p.teluguName}
                      </p>
                      <span className="text-[10px] text-stone-400">
                        {p.quantity} • {p.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-black text-xs sm:text-sm text-emerald-900">
                      ₹{p.price}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
