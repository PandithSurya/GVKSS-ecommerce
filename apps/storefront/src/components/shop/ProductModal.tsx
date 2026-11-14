import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Leaf
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';
import { categories } from '../../data/categories';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onBuyNow
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const categoryInfo = product ? categories.find(c => c.id === product.category) : null;

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
    onClose();
  };

  const handleWhatsApp = () => {
    const text = `Namaste! I would like to order: ${product.name} (${product.teluguName}) - Qty: ${quantity} x ${product.quantity} - Total: Rs. ${product.price * quantity}`;
    window.open(
      `https://wa.me/919391628344?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-emerald-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200/90 z-10 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-stone-600 hover:text-stone-950 hover:bg-stone-100 shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="p-6 sm:p-8 bg-emerald-50/30 flex items-center justify-center relative">
            <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden shadow-inner bg-white p-2 border border-emerald-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            {/* Availability pill */}
            <div className="absolute bottom-4 left-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ✓ {t.inStock}
              </span>
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  {product.category.replace('-', ' ')}
                </span>
                <h2 className="font-sans font-black text-xl sm:text-2xl text-stone-900 leading-snug">
                  {product.name}
                </h2>
                <p className="text-sm font-bold text-emerald-800 font-telugu mt-0.5">
                  {product.teluguName}
                </p>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-emerald-50">
                <span className="text-3xl font-black text-emerald-900">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-stone-500 font-bold">
                  / {product.quantity}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {language === 'te'
                  ? product.teluguDescription
                  : product.description}
              </p>

              {/* Health & Dietary Summary Box */}
              {categoryInfo && (
                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{language === 'te' ? 'ఆరోగ్య & పోషక సారాంశం' : 'Health & Nutrition Summary'}</span>
                  </div>
                  <p className="text-xs font-extrabold text-emerald-800 leading-snug">
                    {language === 'te' ? categoryInfo.benefitTe : categoryInfo.benefitEn}
                  </p>
                  <p className="text-[11px] text-stone-600 leading-tight">
                    {language === 'te' ? categoryInfo.teluguDescription : categoryInfo.description}
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="space-y-1.5 pt-1 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GVKSS Certified Organic Farm Produce</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No Chemical Fertilizers, Additives, or Maida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Doorstep Delivery on orders above ₹1,000/-</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-emerald-50">
              {/* Quantity selector */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">Quantity:</span>
                <div className="inline-flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-stone-100 text-stone-600 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 font-black text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-stone-100 text-stone-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-200" />
                  <span>Add to Cart (₹{product.price * quantity})</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-950 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Zap className="w-4 h-4 text-emerald-300" />
                  <span>{t.buyNow}</span>
                </button>
              </div>

              {/* WhatsApp Quick Order */}
              <button
                onClick={handleWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Order this item on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
