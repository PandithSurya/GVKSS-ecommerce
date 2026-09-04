import React from 'react';
import {
  Eye,
  Plus,
  Check,
  Sparkles,
  MessageCircle,
  Leaf
} from 'lucide-react';
import type { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/categories';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails
}) => {
  const { language, t } = useLanguage();
  const { addToCart, cart } = useCart();

  const cartItem = cart.find(item => item.product.id === product.id);
  const isInCart = Boolean(cartItem);
  const categoryInfo = categories.find(c => c.id === product.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;
    addToCart(product, 1);
  };

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Namaste! I would like to order: ${product.name} (${product.teluguName}) - ${product.quantity} - Rs. ${product.price}`;
    window.open(`https://wa.me/919391628344?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-3xl border border-stone-200/80 hover:border-emerald-400 shadow-sm hover:shadow-foodie transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative transform hover:-translate-y-1.5"
    >
      <div>
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-sm">
              <Sparkles className="w-3 h-3" />
              {language === 'te' ? 'ప్రత్యేకం' : 'Special'}
            </span>
          )}
          {product.isReadyToCook && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {language === 'te' ? 'రెడీ టు కుక్' : 'Ready to Cook'}
            </span>
          )}
          {product.isReadyToEat && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
              {language === 'te' ? 'రెడీ టు ఈట్' : 'Snack'}
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-emerald-50/20 p-3 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
            }}
          />

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="absolute inset-0 m-auto w-28 h-9 rounded-full bg-emerald-950/85 backdrop-blur-sm text-white text-xs font-bold flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:bg-emerald-950"
          >
            <Eye className="w-4 h-4 text-emerald-300" />
            <span>{t.quickView}</span>
          </button>

          {/* Quantity Badge */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-extrabold text-stone-800 shadow-sm border border-stone-200/80">
            {product.quantity}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <div className="mb-1.5">
            <h3 className="font-sans font-bold text-sm sm:text-base text-stone-900 group-hover:text-emerald-700 transition line-clamp-1 leading-snug">
              {product.name}
            </h3>
            <p className="text-xs font-semibold text-emerald-800 font-telugu line-clamp-1 mt-0.5">
              {product.teluguName}
            </p>
          </div>

          {/* Health & Benefit Summary Chip */}
          {categoryInfo && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-semibold text-emerald-800 border border-emerald-100/80 mb-2 max-w-full truncate">
              <Leaf className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              <span className="truncate">{language === 'te' ? categoryInfo.benefitTe : categoryInfo.benefitEn}</span>
            </div>
          )}

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {language === 'te' ? product.teluguDescription : product.description}
          </p>
        </div>
      </div>

      {/* Price & Action Row */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3 border-t border-emerald-50 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-lg sm:text-xl text-emerald-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 font-semibold block">
              / {product.unit}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* WhatsApp Inquiry */}
            <button
              onClick={handleWhatsAppEnquiry}
              title="Order on WhatsApp"
              className="p-2.5 rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Green Pill Add-to-Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.available}
              className={`px-3.5 py-2 rounded-full text-xs font-black transition flex items-center gap-1 shadow-sm ${
                !product.available
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : isInCart
                  ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-green-glow active:scale-95'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>({cartItem?.quantity})</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addToCart}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
