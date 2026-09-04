import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AppLoader } from './components/ui/AppLoader';
import { TopBanner } from './components/layout/TopBanner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingActions } from './components/layout/FloatingActions';
import { FloatingBackground } from './components/ui/FloatingBackground';
import { Hero } from './components/home/Hero';
import { BalancedDietSection } from './components/home/BalancedDietSection';
import { OrganicProcessShowcase } from './components/home/OrganicProcessShowcase';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedPacks } from './components/home/FeaturedPacks';
import { ReadyToCookPromo } from './components/home/ReadyToCookPromo';
import { ReadyToEatPromo } from './components/home/ReadyToEatPromo';
import { NaturalProductsShowcase } from './components/home/NaturalProductsShowcase';
import { TrustSection } from './components/home/TrustSection';
import { HomeDeliveryBanner } from './components/home/HomeDeliveryBanner';
import { ShopView } from './components/pages/ShopView';
import { MonthlyPackView } from './components/pages/MonthlyPackView';
import { ReadyToCookView } from './components/pages/ReadyToCookView';
import { NaturalProductsView } from './components/pages/NaturalProductsView';
import { AboutView } from './components/pages/AboutView';
import { ContactView } from './components/pages/ContactView';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderReceipt } from './components/checkout/OrderReceipt';
import { ProductModal } from './components/shop/ProductModal';
import { SearchModal } from './components/ui/SearchModal';
import { Toast } from './components/ui/Toast';
import type { Product, CategoryId, Order } from './types';
import { useCart } from './context/CartContext';

type LoadStage = 'loading' | 'background_only' | 'ready';

const MainAppContent: React.FC = () => {
  const [loadStage, setLoadStage] = useState<LoadStage>('loading');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const { addToCart } = useCart();

  // Handle clean transition: loader -> background only -> elements pop out
  const handleLoaderFinished = () => {
    setLoadStage('background_only');
  };

  useEffect(() => {
    if (loadStage === 'background_only') {
      // Allow background to be seen cleanly first, then trigger element pop out
      const timer = setTimeout(() => {
        setLoadStage('ready');
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [loadStage]);

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductDetails = (product: Product) => {
    setModalProduct(product);
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* 1. Initial Organic Brand Loader */}
      {loadStage === 'loading' && (
        <AppLoader onLoadingComplete={handleLoaderFinished} />
      )}

      {/* 2. Main Page Container */}
      <div className="min-h-screen flex flex-col bg-transparent text-stone-900 font-sans selection:bg-emerald-600 selection:text-white relative">
        
        {/* Background (Always present, revealed cleanly when loader finishes) */}
        <FloatingBackground />

        {/* 3. Individual Elements Pop Out (Only after background_only stage) */}
        {loadStage === 'ready' && (
          <>
            {/* Top Notification Banner (Pops Down from Above) */}
            <TopBanner />

            {/* Main Navigation Header (Pops in) */}
            <Header
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              onSelectCategory={handleSelectCategory}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Dynamic Main Body Content */}
            <main key={activeTab} className="flex-1 animate-view-transition">
              {activeTab === 'home' && (
                <div>
                  {/* 1. Hero Section with Individual Elements Popping Out */}
                  <Hero
                    onShopClick={() => handleTabChange('shop')}
                    onPackClick={() => handleTabChange('monthly-pack')}
                    onDeliveryClick={() => handleTabChange('contact')}
                  />

                  {/* 2. Balanced Diet Feature Section */}
                  <BalancedDietSection
                    onOrderClick={() => handleTabChange('shop')}
                  />

                  {/* 3. Visual Organic Preparation Process */}
                  <OrganicProcessShowcase
                    onExploreShop={() => handleTabChange('shop')}
                  />

                  {/* 4. Categories Grid */}
                  <CategoryGrid onSelectCategory={handleSelectCategory} />

                  {/* 5. Monthly Provision Packs */}
                  <FeaturedPacks />

                  {/* 6. Ready-to-Cook Highlights */}
                  <ReadyToCookPromo
                    onOpenDetails={handleOpenProductDetails}
                    onViewAll={() => handleTabChange('ready-to-cook')}
                  />

                  {/* 7. Ready-to-Eat Snacks */}
                  <ReadyToEatPromo
                    onOpenDetails={handleOpenProductDetails}
                    onViewAll={() => handleTabChange('ready-to-cook')}
                  />

                  {/* 8. Natural Dairy, Ghee & Honey Showcase */}
                  <NaturalProductsShowcase
                    onOpenDetails={handleOpenProductDetails}
                    onViewAll={() => handleTabChange('natural-products')}
                  />

                  {/* 9. Trust & Women Farmer Story */}
                  <TrustSection />

                  {/* 10. Home Delivery Banner */}
                  <HomeDeliveryBanner />
                </div>
              )}

              {activeTab === 'shop' && (
                <ShopView
                  key={`shop-${selectedCategory}`}
                  initialCategory={selectedCategory}
                  onOpenDetails={handleOpenProductDetails}
                />
              )}

              {activeTab === 'categories' && (
                <div className="py-12 bg-transparent min-h-screen">
                  <CategoryGrid onSelectCategory={handleSelectCategory} />
                </div>
              )}

              {activeTab === 'monthly-pack' && <MonthlyPackView />}

              {activeTab === 'ready-to-cook' && (
                <ReadyToCookView
                  defaultSubtab="cook"
                  onOpenDetails={handleOpenProductDetails}
                />
              )}

              {activeTab === 'natural-products' && (
                <NaturalProductsView onOpenDetails={handleOpenProductDetails} />
              )}

              {activeTab === 'about' && <AboutView />}

              {activeTab === 'contact' && <ContactView />}
            </main>

            {/* Footer */}
            <Footer
              setActiveTab={handleTabChange}
              onSelectCategory={handleSelectCategory}
            />

            {/* Floating Action Buttons */}
            <FloatingActions />

            {/* Cart Drawer Slide-over */}
            <CartDrawer
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onBrowseShop={() => handleTabChange('shop')}
            />

            {/* Checkout Modal */}
            <CheckoutModal
              isOpen={isCheckoutOpen}
              onClose={() => setIsCheckoutOpen(false)}
              onOrderComplete={(order) => setCompletedOrder(order)}
            />

            {/* Order Confirmation & Receipt */}
            <OrderReceipt
              order={completedOrder}
              onClose={() => setCompletedOrder(null)}
              onContinueShopping={() => {
                setCompletedOrder(null);
                handleTabChange('shop');
              }}
            />

            {/* Product Details Modal */}
            <ProductModal
              product={modalProduct}
              onClose={() => setModalProduct(null)}
              onBuyNow={handleBuyNow}
            />

            {/* Live Search Modal */}
            <SearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onSelectProduct={handleOpenProductDetails}
            />

            {/* Toast Notification */}
            <Toast />
          </>
        )}
      </div>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </LanguageProvider>
  );
};

export default App;
