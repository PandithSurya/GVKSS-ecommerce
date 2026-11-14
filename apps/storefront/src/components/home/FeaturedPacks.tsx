import React, { useState } from 'react';
import {
  CheckCircle2,
  ShoppingBag,
  Gift,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { monthlyPacks } from '../../data/monthlyPacks';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import type { MonthlyPack } from '../../types';

export const FeaturedPacks: React.FC = () => {
  const { language, t } = useLanguage();
  const { addMonthlyPack } = useCart();
  const [expandedPackId, setExpandedPackId] = useState<string | null>(null);

  const toggleExpand = (packId: string) => {
    setExpandedPackId(expandedPackId === packId ? null : packId);
  };

  const handleWhatsAppOrderPack = (pack: MonthlyPack) => {
    const message = `Namaste GVKSS! I want to order the *${pack.name}* (Rs. ${pack.price}/-). Please confirm home delivery.`;
    window.open(
      `https://wa.me/919391628344?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <section className="py-16 bg-transparent border-y border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Gift className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {language === 'te'
                ? 'నెలవారీ కిరాణా ప్యాక్‌లు – ఉచిత డెలివరీ'
                : 'Monthly Grocery Essentials – Free Delivery'}
            </span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-stone-900">
            {t.sections.monthlyPacksTitle}
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
            {t.sections.monthlyPacksSub}
          </p>
        </div>

        {/* 2 Packs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {monthlyPacks.map((pack) => {
            const isExpanded = expandedPackId === pack.id;

            return (
              <div
                key={pack.id}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-700/40 shadow-subtle hover:shadow-foodie transition-all duration-200 overflow-hidden flex flex-col justify-between relative group"
              >
                {/* Top Badge */}
                <div className="bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold tracking-wide uppercase">
                      {pack.badge}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-stone-300">
                    {pack.itemCount} {t.items} ({pack.totalWeightApprox})
                  </span>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Titles */}
                    <div className="mb-4">
                      <h3 className="font-sans font-bold text-xl sm:text-2xl text-stone-900 leading-snug">
                        {pack.name}
                      </h3>
                      <p className="text-sm font-semibold text-emerald-800 font-telugu mt-0.5">
                        {pack.teluguName}
                      </p>
                    </div>

                    {/* Price Banner */}
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 mb-5 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-stone-500 font-medium block">
                          Monthly Provision Price
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
                            ₹{pack.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-stone-400 line-through font-mono">
                            ₹{pack.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✓ Free Doorstep Delivery
                        </span>
                      </div>
                    </div>

                    {/* Highlights Bullet List */}
                    <div className="space-y-2 mb-5">
                      {pack.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{language === 'te' ? h.te : h.en}</span>
                        </div>
                      ))}
                    </div>

                    {/* Free Gift Alert for Pack 9000 */}
                    {pack.id === 'pack-9000' && (
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-semibold mb-5 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{t.pack.freeGiftNotice}</span>
                      </div>
                    )}

                    {/* Toggle Full Item List */}
                    <button
                      onClick={() => toggleExpand(pack.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-colors flex items-center justify-between mb-4 border border-stone-200"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-800" />
                        <span>
                          {isExpanded
                            ? 'Hide Item Breakdown'
                            : `View All ${pack.items.length} Included Items`}
                        </span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {/* Expanded Items Table */}
                    {isExpanded && (
                      <div className="border border-stone-200 rounded-xl overflow-hidden mb-5 max-h-64 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-50 text-stone-800 font-bold sticky top-0 border-b border-stone-200">
                            <tr>
                              <th className="py-2 px-3">#</th>
                              <th className="py-2 px-3">Product Name</th>
                              <th className="py-2 px-3 text-right">Quantity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {pack.items.map((item, idx) => (
                              <tr key={idx} className="hover:bg-stone-50/70">
                                <td className="py-1.5 px-3 text-stone-400">
                                  {item.slNo || idx + 1}
                                </td>
                                <td className="py-1.5 px-3">
                                  <span className="font-semibold text-stone-900">
                                    {item.name}
                                  </span>
                                  {item.teluguName && (
                                    <span className="text-[11px] text-emerald-800 font-telugu block">
                                      {item.teluguName}
                                    </span>
                                  )}
                                </td>
                                <td className="py-1.5 px-3 text-right font-bold text-stone-700">
                                  {item.quantity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => addMonthlyPack(pack)}
                      className="py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-200" />
                      <span>{t.pack.addEntirePack}</span>
                    </button>

                    <button
                      onClick={() => handleWhatsAppOrderPack(pack)}
                      className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-700" />
                      <span>{t.orderOnWhatsApp}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
