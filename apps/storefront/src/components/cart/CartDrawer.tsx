import React from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
  onBrowseShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onOpenCheckout,
  onBrowseShop
}) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    cartCount
  } = useCart();
  const { language, t } = useLanguage();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 1000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleWhatsAppOrderCart = () => {
    if (cart.length === 0) return;

    let message = `Namaste GVKSS! I would like to order the following items:\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} (${item.product.teluguName}) - Qty: ${item.quantity} x ${item.product.quantity} = Rs. ${item.product.price * item.quantity}\n`;
    });
    message += `\nSubtotal: Rs. ${subtotal}\n\nPlease confirm availability and delivery timeframe.`;

    window.open(
      `https://wa.me/919391628344?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-emerald-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-sans font-bold text-lg text-stone-900">
                  {t.cart.title}
                </h2>
                <span className="text-xs text-emerald-800 font-semibold">
                  {cartCount} {t.items}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart drawer"
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="px-5 py-3 bg-emerald-50/80 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                {remainingForFreeDelivery === 0 ? (
                  <span className="text-emerald-700 font-bold">
                    🎉 {language === 'te' ? 'ఉచిత డెలివరీ అర్హత పొందారు!' : 'Eligible for Free Delivery (up to 5km)!'}
                  </span>
                ) : (
                  <span>
                    {language === 'te'
                      ? `ఉచిత డెలివరీ కోసం ఇంకో ₹${remainingForFreeDelivery} జోడించండి`
                      : `Add ₹${remainingForFreeDelivery} more for Free Delivery!`}
                  </span>
                )}
              </span>
              <span>{Math.round(deliveryProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${deliveryProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-emerald-50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-stone-900">
                    {t.cart.emptyTitle}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                    {t.cart.emptySub}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onBrowseShop();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition shadow-sm hover:shadow-md"
                >
                  {t.cart.startShopping}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="py-3.5 flex items-center gap-3.5 group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-emerald-100 shrink-0 bg-emerald-50/30"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-emerald-800 font-telugu truncate">
                      {item.product.teluguName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                      <span>{item.product.quantity}</span>
                      <span>•</span>
                      <span className="font-bold text-stone-900">
                        ₹{item.product.price}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="inline-flex items-center border border-emerald-200 rounded-full bg-white overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="px-2 py-1 hover:bg-emerald-50 text-stone-600 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-xs text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 py-1 hover:bg-emerald-50 text-stone-600 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-red-600 transition p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-emerald-900">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-emerald-100 bg-emerald-50/30 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>{t.subtotal}</span>
                  <span className="font-bold text-stone-800">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Delivery</span>
                  <span className="text-emerald-700 font-semibold">
                    {subtotal >= 1000 ? 'FREE (0-5km)' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-sm sm:text-base font-extrabold text-stone-950">
                  <span>{t.total}</span>
                  <span className="text-lg sm:text-xl text-emerald-900">
                    ₹{subtotal}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <span>{t.cart.checkoutBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick WhatsApp Checkout */}
              <button
                onClick={handleWhatsAppOrderCart}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{t.orderOnWhatsApp}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
