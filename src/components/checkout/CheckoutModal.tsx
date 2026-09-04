import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Order, OrderCustomerInfo } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderComplete
}) => {
  const { cart, subtotal, clearCart } = useCart();
  const { language, t } = useLanguage();

  const [customer, setCustomer] = useState<OrderCustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Hyderabad',
    pincode: '500060',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const deliveryFee = subtotal >= 1000 ? 0 : 50;
  const orderTotal = subtotal + deliveryFee;

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!customer.name.trim()) errors.name = 'Please enter your name';
    if (!customer.phone.trim() || customer.phone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!customer.address.trim()) errors.address = 'Please enter delivery address';
    if (!customer.city.trim()) errors.city = 'Please specify city/area';
    if (!customer.pincode.trim() || customer.pincode.length !== 6) {
      errors.pincode = 'Please enter 6-digit pincode';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `SNG-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        orderId,
        customer,
        items: [...cart],
        subtotal,
        deliveryFee,
        total: orderTotal,
        paymentMethod,
        date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'confirmed'
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      clearCart();
      setIsSubmitting(false);
      onOrderComplete(newOrder);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-emerald-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 z-10 my-6">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-lg sm:text-xl">
                {t.checkout.title}
              </h2>
              <p className="text-xs text-emerald-200">{t.checkout.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrder} className="p-5 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Customer Details */}
          <div>
            <h3 className="font-sans font-bold text-base text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>{language === 'te' ? 'కస్టమర్ మరియు డెలివరీ వివరాలు' : 'Delivery Address'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.checkout.name}
                </label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                  placeholder="e.g. Ramesh Reddy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                />
                {formErrors.name && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.checkout.phone}
                </label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  placeholder="e.g. 9391628344"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                />
                {formErrors.phone && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.checkout.email}
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.checkout.city}
                </label>
                <input
                  type="text"
                  required
                  value={customer.city}
                  onChange={(e) =>
                    setCustomer({ ...customer, city: e.target.value })
                  }
                  placeholder="e.g. Saroornagar, Hyderabad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.checkout.address}
                </label>
                <textarea
                  required
                  rows={2}
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  placeholder="House/Flat No, Apartment name, Street, Landmark"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm resize-none"
                ></textarea>
                {formErrors.address && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.checkout.pincode}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={customer.pincode}
                  onChange={(e) =>
                    setCustomer({ ...customer, pincode: e.target.value })
                  }
                  placeholder="500060"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.checkout.notes}
                </label>
                <input
                  type="text"
                  value={customer.notes}
                  onChange={(e) =>
                    setCustomer({ ...customer, notes: e.target.value })
                  }
                  placeholder="e.g. Ring bell, deliver in morning"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="font-sans font-bold text-base text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>{t.checkout.paymentMethod}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-5 h-5 text-emerald-800" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">
                    {t.checkout.cod}
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {t.checkout.codDesc}
                  </p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <QrCode className="w-5 h-5 text-emerald-700" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">
                    UPI / PhonePe / GPay
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {t.checkout.upiDesc}
                  </p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'card'
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-emerald-700" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">
                    Cards & Net Banking
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Secure simulated checkout
                  </p>
                </div>
              </label>
            </div>

            {paymentMethod === 'upi' && (
              <div className="mt-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-4">
                <div className="w-16 h-16 bg-white p-1 rounded-xl border border-emerald-300 shrink-0 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-emerald-800" />
                </div>
                <div className="text-xs text-emerald-950">
                  <span className="font-bold block">
                    Merchant UPI ID: gvkssorganics@upi
                  </span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    You can pay upon delivery or scan directly via Google Pay / PhonePe.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Breakdown */}
          <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal ({cart.length} unique items)</span>
              <span className="font-bold text-stone-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Home Delivery</span>
              <span className="font-bold text-emerald-700">
                {deliveryFee === 0 ? 'FREE (Special Offer)' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-emerald-200 flex justify-between text-sm sm:text-base font-black text-stone-900">
              <span>Total Payable Amount</span>
              <span className="text-emerald-900">₹{orderTotal}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-4 px-6 rounded-full bg-emerald-600 text-white font-bold text-sm sm:text-base hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-green-glow active:scale-98 disabled:bg-stone-300"
          >
            {isSubmitting ? (
              <span>Placing your order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>
                  {t.checkout.placeOrder} (₹{orderTotal})
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
