import React from 'react';
import {
  Leaf,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { businessInfo } from '../../data/businessInfo';
import { categories } from '../../data/categories';
import type { CategoryId } from '../../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onSelectCategory?: (categoryId: CategoryId) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onSelectCategory
}) => {
  const { language, t } = useLanguage();

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCatClick = (catId: CategoryId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-emerald-500 shadow-md flex items-center justify-center shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Gau Vishwa Kalyan Samrakshana Samithi Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-sans font-black text-xl text-white tracking-tight">
                  GVKSS
                </h3>
                <span className="text-[11px] text-emerald-300 font-semibold block leading-tight mt-0.5">
                  {language === 'te'
                    ? 'గో విశ్వ కళ్యాణ స్వచ్ఛంద సేవా సంస్థ'
                    : 'Go Vishwa Kalyana Voluntary Service Organization'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                  Regd. No. 320 of 2024
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed">
              {t.footer.aboutText}
            </p>

            <div className="pt-2 border-t border-emerald-900">
              <div className="text-xs text-emerald-200/80 space-y-1">
                <p className="font-semibold text-emerald-300">
                  {language === 'te' ? 'త్వరలో కొత్త బ్రాంచీలు:' : 'Opening Soon Branches:'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {businessInfo.upcomingBranches.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-emerald-900 text-[10px] text-emerald-200 border border-emerald-800"
                    >
                      {language === 'te' ? b.nameTe : b.nameEn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-sans font-bold text-base text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/80">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop')}
                  className="hover:text-white transition"
                >
                  {t.nav.shop}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('monthly-pack')}
                  className="text-emerald-300 font-bold hover:underline"
                >
                  {t.nav.monthlyPack} (₹7,500 / ₹9,000)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('ready-to-cook')}
                  className="hover:text-white transition"
                >
                  {t.nav.readyToCook}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('ready-to-eat')}
                  className="hover:text-white transition"
                >
                  {t.nav.readyToEat}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('natural-products')}
                  className="hover:text-white transition"
                >
                  {t.nav.naturalProducts}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition"
                >
                  {t.nav.aboutUs}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="font-sans font-bold text-base text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {t.footer.categories}
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCatClick(cat.id)}
                    className="hover:text-white transition flex items-center gap-1.5"
                  >
                    <span>•</span>
                    <span>{language === 'te' ? cat.teluguName : cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-3 border-t border-emerald-900">
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.footer.hours}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Locations */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-base text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {t.footer.contactInfo}
            </h4>

            <div className="space-y-2.5 text-xs text-emerald-200/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">
                    {language === 'te'
                      ? businessInfo.locations[0].titleTe
                      : businessInfo.locations[0].titleEn}
                  </strong>
                  <p className="text-emerald-200/70">
                    {language === 'te'
                      ? businessInfo.locations[0].addressTe
                      : businessInfo.locations[0].addressEn}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">
                    {language === 'te'
                      ? businessInfo.locations[1].titleTe
                      : businessInfo.locations[1].titleEn}
                  </strong>
                  <p className="text-emerald-200/70">
                    {language === 'te'
                      ? businessInfo.locations[1].addressTe
                      : businessInfo.locations[1].addressEn}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Orders: <strong className="text-white">9391628344</strong> / <strong className="text-white">9346749301</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{businessInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{businessInfo.website}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80 text-center sm:text-left">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-4 text-[11px] text-emerald-300/80">
            <span>✓ 100% GVKSS Sourced</span>
            <span>•</span>
            <span>✓ Traditional Chemical-Free</span>
            <span>•</span>
            <span>✓ Doorstep Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
