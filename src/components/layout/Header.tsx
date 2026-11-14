import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  Wheat,
  Utensils,
  Cookie,
  Package,
  Milk,
  Droplet,
  CircleDot,
  Flame,
  Sparkles,
  Leaf,
  ArrowRight,
  User as UserIcon,
  Shield
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/categories';
import type { CategoryId } from '../../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectCategory?: (catId: CategoryId) => void;
  onOpenSearch: () => void;
  onOpenMyOrders?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSelectCategory,
  onOpenSearch,
  onOpenMyOrders,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileShopExpanded, setIsMobileShopExpanded] = useState(false);
  
  const shopDropdownRef = useRef<HTMLDivElement>(null);

  // Close shop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target as Node)
      ) {
        setIsShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tabId: string) => {
    if (tabId === 'shop' && onSelectCategory) {
      onSelectCategory('all');
    } else {
      setActiveTab(tabId);
    }
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectCategoryClick = (catId: CategoryId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      setActiveTab('shop');
    }
    setIsShopDropdownOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Icon selector helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wheat':
        return <Wheat className="w-4 h-4" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4" />;
      case 'Cookie':
        return <Cookie className="w-4 h-4" />;
      case 'Package':
        return <Package className="w-4 h-4" />;
      case 'Milk':
        return <Milk className="w-4 h-4" />;
      case 'Droplet':
        return <Droplet className="w-4 h-4" />;
      case 'CircleDot':
        return <CircleDot className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Leaf className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          
          {/* LEFT: Logo & Brand Emblem */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/40 shadow-sm group-hover:scale-105 transition-transform shrink-0 bg-white p-0.5">
              <img
                src="/images/logo.png"
                alt="Gau Vishwa Kalyan Samrakshana Samithi Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-black text-2xl text-stone-900 tracking-tight leading-none">
                  GVKSS
                </span>
                <span className="text-emerald-700 font-sans font-bold text-xs tracking-tight hidden sm:inline">
                  {language === 'te' ? 'గో విశ్వ కళ్యాణ' : 'Go Vishwa Kalyana'}
                </span>
              </div>
              <span className="text-[9px] sm:text-[9.5px] font-bold text-emerald-800 tracking-wide leading-tight mt-0.5 whitespace-nowrap">
                {language === 'te'
                  ? 'స్వచ్ఛంద సేవా సంస్థ • రిజి. నెం. 320/2024'
                  : 'Voluntary Service Organization • Regd. No. 320 of 2024'}
              </span>
            </div>
          </div>

          {/* CENTER: Navigation Links with Shop Category Summary Dropdown */}
          <nav className="hidden xl:flex items-center space-x-7 text-[15px] font-semibold text-stone-700">
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`relative py-2 whitespace-nowrap transition-colors duration-150 flex items-center gap-1 ${
                activeTab === 'home'
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-600 hover:text-emerald-600'
              }`}
            >
              <span>{t.nav.home}</span>
              {activeTab === 'home' && (
                <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-emerald-600 rounded-full animate-fadeIn" />
              )}
            </button>

            {/* 2. Shop with Integrated Category Summaries Dropdown */}
            <div className="relative" ref={shopDropdownRef}>
              <div
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                className="flex items-center"
              >
                <button
                  onClick={() => handleNavClick('shop')}
                  className={`relative py-2 whitespace-nowrap transition-colors duration-150 flex items-center gap-1 ${
                    activeTab === 'shop' || isShopDropdownOpen
                      ? 'text-emerald-800 font-bold'
                      : 'text-stone-600 hover:text-emerald-600'
                  }`}
                >
                  <span>{language === 'te' ? 'ఉత్పత్తులు (షాప్)' : 'Shop Catalog'}</span>
                  <ChevronDown 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsShopDropdownOpen(!isShopDropdownOpen);
                    }}
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180 text-emerald-700' : ''}`} 
                  />
                  {activeTab === 'shop' && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-emerald-600 rounded-full animate-fadeIn" />
                  )}
                </button>
              </div>

              {/* Shop Mega Menu Flyout with Category Health Summaries */}
              {isShopDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsShopDropdownOpen(false)}
                  className="absolute top-full -left-20 w-[720px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-stone-200/90 p-5 mt-1 z-50 animate-fadeIn"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                    <div>
                      <span className="text-xs font-black text-emerald-950 uppercase tracking-wider block">
                        {language === 'te'
                          ? 'మీ ఆరోగ్య అవసరానికి తగిన వర్గాన్ని నేరుగా ఎంచుకోండి'
                          : 'Choose by Category & Health Benefit'}
                      </span>
                      <p className="text-[11px] text-stone-500">
                        {language === 'te'
                          ? 'ప్రతి వర్గం యొక్క ప్రత్యేక ఆరోగ్య ప్రయోజన సారాంశం'
                          : 'Direct category navigation with nutritional summaries'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavClick('shop')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                    >
                      <span>{language === 'te' ? 'అన్ని ఉత్పత్తులు (ఆల్)' : 'View Full Catalog (All)'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => handleDirectCategoryClick(cat.id)}
                        className="p-3 rounded-2xl border border-stone-100 hover:border-emerald-300 bg-stone-50/60 hover:bg-emerald-50/70 transition-all cursor-pointer group flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 group-hover:border-emerald-400 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          {getCategoryIcon(cat.icon)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-emerald-900 truncate">
                              {language === 'te' ? cat.teluguName : cat.name}
                            </h4>
                            {cat.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          {/* Rich Health Benefit Summary */}
                          <p className="text-[10.5px] font-medium text-emerald-700 leading-tight mt-0.5">
                            {language === 'te' ? cat.benefitTe : cat.benefitEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Packages */}
            <button
              onClick={() => handleNavClick('monthly-pack')}
              className={`relative py-2 whitespace-nowrap transition-colors duration-150 flex items-center gap-1 ${
                activeTab === 'monthly-pack'
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-600 hover:text-emerald-600'
              }`}
            >
              <span>{language === 'te' ? 'నెలవారీ ప్యాకేజీలు' : 'Packages'}</span>
              {activeTab === 'monthly-pack' && (
                <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-emerald-600 rounded-full animate-fadeIn" />
              )}
            </button>

            {/* 4. Ready to Cook */}
            <button
              onClick={() => handleNavClick('ready-to-cook')}
              className={`relative py-2 whitespace-nowrap transition-colors duration-150 flex items-center gap-1 ${
                activeTab === 'ready-to-cook'
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-600 hover:text-emerald-600'
              }`}
            >
              <span>{language === 'te' ? 'రెడీ టు కుక్' : 'Ready to Cook'}</span>
              {activeTab === 'ready-to-cook' && (
                <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-emerald-600 rounded-full animate-fadeIn" />
              )}
            </button>

            {/* 5. About */}
            <button
              onClick={() => handleNavClick('about')}
              className={`relative py-2 whitespace-nowrap transition-colors duration-150 flex items-center gap-1 ${
                activeTab === 'about'
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-600 hover:text-emerald-600'
              }`}
            >
              <span>{language === 'te' ? 'మా గురించి' : 'About Us'}</span>
              {activeTab === 'about' && (
                <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-emerald-600 rounded-full animate-fadeIn" />
              )}
            </button>

            {/* 6. Contact */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`relative py-2 whitespace-nowrap transition-colors duration-150 flex items-center gap-1 ${
                activeTab === 'contact'
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-600 hover:text-emerald-600'
              }`}
            >
              <span>{language === 'te' ? 'సంప్రదించండి' : 'Contact Us'}</span>
              {activeTab === 'contact' && (
                <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-emerald-600 rounded-full animate-fadeIn" />
              )}
            </button>
          </nav>

          {/* RIGHT: Search, Language, Cart & Green Pill Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search Catalog"
              className="p-2 rounded-full text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 transition flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              title="Toggle English / Telugu"
              className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition flex items-center justify-center whitespace-nowrap font-telugu"
            >
              {language === 'en' ? 'తెలుగు' : 'English'}
            </button>

            {/* Customer Account / Sign In Pill */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition"
                  title={user?.email}
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden md:inline max-w-[90px] truncate">{user?.fullName.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 hidden group-hover:block z-50">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900 truncate">{user?.fullName}</p>
                    <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={onOpenMyOrders}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition flex items-center gap-2 mt-1"
                  >
                    <Package className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'te' ? 'నా ఆర్డర్లు' : 'My Orders'}</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition mt-0.5"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 transition"
                title="Sign In / Register"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">{language === 'te' ? 'సైన్ ఇన్' : 'Sign In'}</span>
              </button>
            )}

            {/* Admin Console Access */}
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              title="GVKSS Admin Operations Console"
              className={`p-2 rounded-full transition ${
                activeTab === 'admin'
                  ? 'bg-emerald-900 text-emerald-200 shadow-sm'
                  : 'text-stone-500 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Cart Icon with badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-2 rounded-full text-stone-800 hover:text-emerald-600 hover:bg-emerald-50 transition flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <span>{language === 'te' ? 'సంప్రదించండి' : 'Contact Us'}</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-stone-700 hover:bg-emerald-50 transition"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer with Integrated Shop Category Summaries */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-emerald-100 shadow-2xl px-5 pt-3 pb-6 space-y-2 animate-fadeIn max-h-[85vh] overflow-y-auto">
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition ${
              activeTab === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>{t.nav.home}</span>
          </button>

          {/* Expandable Shop with Category Summaries in Mobile */}
          <div className="border border-emerald-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => setIsMobileShopExpanded(!isMobileShopExpanded)}
              className="w-full text-left px-4 py-3 bg-emerald-50/70 text-emerald-900 font-bold text-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>{language === 'te' ? 'ఉత్పత్తులు (వర్గాల సారాంశం)' : 'Shop (Category Summaries)'}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isMobileShopExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isMobileShopExpanded && (
              <div className="p-2 space-y-1.5 bg-white max-h-[300px] overflow-y-auto">
                <button
                  onClick={() => handleNavClick('shop')}
                  className="w-full p-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center shadow-sm"
                >
                  {language === 'te' ? 'అన్ని ఉత్పత్తులు (ఆల్)' : 'View All Products'}
                </button>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleDirectCategoryClick(cat.id)}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50 transition cursor-pointer flex items-start gap-2.5 border border-stone-100"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white text-emerald-700 flex items-center justify-center shrink-0 border border-stone-200">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900">
                          {language === 'te' ? cat.teluguName : cat.name}
                        </span>
                        {cat.badge && (
                          <span className="text-[8.5px] font-bold px-1 rounded bg-emerald-100 text-emerald-800">
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-700 font-medium leading-tight mt-0.5">
                        {language === 'te' ? cat.benefitTe : cat.benefitEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Packages */}
          <button
            onClick={() => handleNavClick('monthly-pack')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition ${
              activeTab === 'monthly-pack' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>{language === 'te' ? 'నెలవారీ ప్యాకేజీలు' : 'Monthly Packages'}</span>
          </button>

          {/* Ready to Cook */}
          <button
            onClick={() => handleNavClick('ready-to-cook')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition ${
              activeTab === 'ready-to-cook' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>{t.nav.readyToCook}</span>
          </button>

          {/* About */}
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition ${
              activeTab === 'about' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>{language === 'te' ? 'మా గురించి' : 'About Us'}</span>
          </button>

          {/* Contact */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition ${
              activeTab === 'contact' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>{language === 'te' ? 'సంప్రదించండి' : 'Contact Us'}</span>
          </button>

          <div className="pt-3 border-t border-emerald-100 space-y-2">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm text-center shadow-md"
            >
              {language === 'te' ? 'సంప్రదించండి' : 'Contact Us'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
