import React, { useState } from 'react';
import {
  Gift,
  ShoppingBag,
  CheckCircle2,
  Package,
  MessageCircle,
  Phone,
  Search
} from 'lucide-react';
import { monthlyPacks } from '../../data/monthlyPacks';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { MonthlyPack } from '../../types';

export const MonthlyPackView: React.FC = () => {
  const { language, t } = useLanguage();
  const { addMonthlyPack } = useCart();
  const [activePackTab, setActivePackTab] = useState<string>('pack-7500');
  const [packItemSearch, setPackItemSearch] = useState('');

  const currentPack =
    monthlyPacks.find(p => p.id === activePackTab) || monthlyPacks[0];

  const filteredItems = currentPack.items.filter(
    item =>
      item.name.toLowerCase().includes(packItemSearch.toLowerCase()) ||
      (item.teluguName && item.teluguName.includes(packItemSearch))
  );

  const handleWhatsAppOrderPack = (pack: MonthlyPack) => {
    const message = `Namaste GVKSS! I want to order the *${pack.name}* (Rs. ${pack.price}/-). Please arrange home delivery.`;
    window.open(
      `https://wa.me/919391628344?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="py-10 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Banner */}
        <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-12 relative overflow-hidden shadow-xl border-b-4 border-emerald-600">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-bold">
              <Gift className="w-4 h-4 text-emerald-300" />
              <span>
                {language === 'te'
                  ? 'పూర్తి కుటుంబ నెలవారీ నిత్యావసరాలు'
                  : 'Complete Household Monthly Grocery Kits'}
              </span>
            </div>

            <h1 className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl leading-tight">
              {language === 'te'
                ? 'నెలవారీ ప్రొవిజన్ ప్యాక్'
                : 'Monthly Provision Pack'}
            </h1>

            <p className="text-emerald-100/80 text-xs sm:text-base leading-relaxed max-w-2xl">
              {language === 'te'
                ? 'ఒక నెల కుటుంబానికి సరిపడా బియ్యం, స్వచ్ఛమైన గానుగ నూనె, పప్పులు, పిండి రకాలు, చిరుధాన్యాలు, మరియు మసాలాలు ఒకే కిట్‌లో మీ ఇంటి వద్దకే ఉచిత డెలివరీ.'
                : 'Say goodbye to multiple grocery runs. Enjoy farm-fresh, unadulterated traditional grains, cold-pressed oils, pure spices, and pulses delivered directly to your home every month.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-300">
              <span>✓ Free Doorstep Delivery</span>
              <span>•</span>
              <span>✓ Pre-Weighed & Sealed for Freshness</span>
              <span>•</span>
              <span>✓ 100% Traditional Quality</span>
            </div>
          </div>
        </div>

        {/* Tab Selector between ₹7,500 and ₹9,000 Packs */}
        <div className="flex rounded-full bg-white p-1.5 border border-emerald-200 shadow-sm max-w-2xl mx-auto">
          {monthlyPacks.map(pack => {
            const isActive = activePackTab === pack.id;
            return (
              <button
                key={pack.id}
                onClick={() => {
                  setActivePackTab(pack.id);
                  setPackItemSearch('');
                }}
                className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-600 hover:text-emerald-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>
                  {pack.id === 'pack-7500'
                    ? '₹7,500 Pack (42 Items)'
                    : '₹9,000 Premium Desi Pack (21 Items)'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Pack Display Container */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Pack Overview */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-emerald-50/40 border-b lg:border-b-0 lg:border-r border-emerald-100 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                {currentPack.badge}
              </span>

              <h2 className="font-sans font-black text-2xl sm:text-3xl text-stone-900">
                {currentPack.name}
              </h2>
              <p className="text-sm font-bold text-emerald-800 font-telugu">
                {currentPack.teluguName}
              </p>

              {/* Price Banner */}
              <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                <span className="text-xs text-stone-500 font-medium block">
                  Package Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-emerald-900">
                    ₹{currentPack.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{currentPack.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 ml-auto">
                    Save ₹
                    {(
                      currentPack.originalPrice - currentPack.price
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {currentPack.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                  Key Inclusions:
                </h4>
                {currentPack.highlights.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-stone-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{language === 'te' ? h.te : h.en}</span>
                  </div>
                ))}
              </div>

              {/* Free Gift Notice */}
              {currentPack.id === 'pack-9000' && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-bold flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t.pack.freeGiftNotice}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-emerald-100 space-y-2.5">
              <button
                onClick={() => addMonthlyPack(currentPack)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-200" />
                <span>{t.pack.addEntirePack}</span>
              </button>

              <button
                onClick={() => handleWhatsAppOrderPack(currentPack)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Pack via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Full Interactive Itemized Checklist */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-sans font-black text-lg text-stone-900">
                    Included Items Checklist ({currentPack.items.length} Total)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Exact quantities and weights from the official catalog
                  </p>
                </div>

                {/* Search within pack */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={packItemSearch}
                    onChange={e => setPackItemSearch(e.target.value)}
                    placeholder="Search in pack..."
                    className="pl-8 pr-3 py-1.5 rounded-full border border-stone-300 text-xs outline-none focus:border-emerald-500 w-full sm:w-48"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-emerald-100 rounded-2xl overflow-hidden max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-900 text-white font-bold sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3.5 w-10">#</th>
                      <th className="py-2.5 px-3.5">Product Name</th>
                      <th className="py-2.5 px-3.5 text-right">
                        Quantity / Weight
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {filteredItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/40">
                        <td className="py-2.5 px-3.5 text-stone-400 font-mono text-[11px]">
                          {item.slNo || idx + 1}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <span className="font-bold text-stone-900 block">
                            {item.name}
                          </span>
                          {item.teluguName && (
                            <span className="text-[11px] text-emerald-800 font-telugu">
                              {item.teluguName}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-black text-emerald-900">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Support Notice */}
            <div className="pt-4 mt-4 border-t border-emerald-100 flex items-center justify-between text-xs text-stone-500">
              <span>Have custom package requests?</span>
              <a
                href="tel:9391628344"
                className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Call Prabhakar Reddy: 9391628344
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
