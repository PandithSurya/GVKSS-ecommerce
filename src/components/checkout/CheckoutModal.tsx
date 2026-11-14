import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
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
  const { user, isAuthenticated, setIsAuthModalOpen, setAuthMode } = useAuth();

  const [customer, setCustomer] = useState<OrderCustomerInfo>({
    name: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: 'Hyderabad',
    pincode: '500060',
    notes: ''
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        name: prev.name || user.fullName,
        phone: prev.phone || user.phone,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // UPI QR & UTR state
  const [step, setStep] = useState<'FORM' | 'UPI_QR'>('FORM');
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);
  const [upiQrDetails, setUpiQrDetails] = useState<any>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = subtotal >= 1000 ? 0 : 50;
  const orderTotal = subtotal + deliveryFee;

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!customer.name.trim()) errors.name = 'Please enter your name';
    if (!customer.phone.trim() || customer.phone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    }
    if (!customer.address.trim()) errors.address = 'Please enter delivery address';
    if (!customer.city.trim()) errors.city = 'Please specify city/area';
    if (!customer.pincode.trim() || customer.pincode.length !== 6) {
      errors.pincode = 'Please enter 6-digit pincode';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      setApiError('Please sign in or create an account to proceed with your order.');
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    const itemsPayload = cart.map((item) => ({
      productId: (item.product as any)._id || item.product.id,
      quantity: item.quantity,
    }));

    const shippingAddressPayload = {
      fullName: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email.trim(),
      houseStreet: customer.address.trim(),
      areaLocality: customer.city.trim(),
      city: customer.city.trim(),
      state: 'Telangana',
      pinCode: customer.pincode.trim(),
      notes: customer.notes?.trim(),
    };

    try {
      if (paymentMethod === 'upi') {
        // Step 1 for UPI: Create order and retrieve dynamic QR code
        const res = await api.checkout.placeOrder({
          shippingAddress: shippingAddressPayload,
          items: itemsPayload,
          paymentMethod: 'UPI',
        });

        if (res?.data?.order) {
          setPendingOrderData(res.data.order);
          setUpiQrDetails(res.data.upiDetails);
          setStep('UPI_QR');
        }
      } else {
        // Cash on Delivery: Direct transactional order confirmation
        const res = await api.checkout.placeOrder({
          shippingAddress: shippingAddressPayload,
          items: itemsPayload,
          paymentMethod: 'COD',
        });

        if (res?.data?.order) {
          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch {}

          const confirmedOrder: Order = {
            orderId: res.data.order.orderNumber,
            customer,
            items: [...cart],
            subtotal: res.data.order.itemsSubtotal,
            deliveryFee: res.data.order.deliveryFee,
            total: res.data.order.totalPayableAmount,
            paymentMethod: 'cod',
            date: new Date().toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: 'confirmed',
            paymentStatus: 'COD_PENDING',
          };

          clearCart();
          onOrderComplete(confirmedOrder);
          onClose();
        }
      }
    } catch (err: any) {
      setApiError(err?.message || 'Failed to place order. Please check item stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 10) {
      setApiError('Please enter a valid 12-digit UPI UTR transaction reference number.');
      return;
    }

    setIsSubmittingUtr(true);
    setApiError(null);

    try {
      await api.payments.submitUtr(pendingOrderData.orderNumber, utrNumber.trim());

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}

      const processingOrder: Order = {
        orderId: pendingOrderData.orderNumber,
        customer,
        items: [...cart],
        subtotal: pendingOrderData.itemsSubtotal,
        deliveryFee: pendingOrderData.deliveryFee,
        total: pendingOrderData.totalPayableAmount,
        paymentMethod: 'upi',
        date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'processing',
        paymentStatus: 'SUBMITTED_FOR_VERIFICATION',
        utrNumber: utrNumber.trim(),
      };

      clearCart();
      onOrderComplete(processingOrder);
      onClose();
    } catch (err: any) {
      setApiError(err?.message || 'Failed to submit UTR. Replay is prevented.');
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-emerald-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200/90 z-10 my-6">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-lg sm:text-xl">
                {step === 'UPI_QR' ? 'UPI QR Payment & UTR Submission' : t.checkout.title}
              </h2>
              <p className="text-xs text-emerald-200">
                {step === 'UPI_QR'
                  ? `Order #${pendingOrderData?.orderNumber} • Scan & Pay via any UPI App`
                  : t.checkout.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {apiError && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {/* STEP 1: CUSTOMER DETAILS & PAYMENT METHOD */}
        {step === 'FORM' && (
          !isAuthenticated || !user ? (
            <div className="p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8 text-amber-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-stone-900 tracking-tight">
                  {language === 'te' ? 'ఆర్డర్ పూర్తి చేయడానికి సైన్ ఇన్ అవసరం' : 'Please Sign In to Complete Your Order'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  {language === 'te'
                    ? 'మీ ఆర్డర్ స్థితి ట్రాకింగ్ మరియు సురక్షిత చెల్లింపు ధృవీకరణ కోసం దయచేసి సైన్ ఇన్ చేయండి లేదా రిజిస్టర్ చేసుకోండి. మీ కార్ట్ సురక్షితంగా సేవ్ చేయబడింది.'
                    : 'To ensure proper dispatch, order tracking updates, and verified farm delivery, customer login is required. Your selected cart items are safe.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{language === 'te' ? 'సైన్ ఇన్ చేయండి' : 'Sign In Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition"
                >
                  {language === 'te' ? 'కొత్త ఖాతా సృష్టించండి' : 'Create New Account'}
                </button>
              </div>
            </div>
          ) : (
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.checkout.name}</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                  />
                  {formErrors.name && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.checkout.phone}</label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="e.g. 9391628344"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                  />
                  {formErrors.phone && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.checkout.email}</label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                  />
                  {formErrors.email && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.checkout.city}</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="e.g. Saroornagar, Hyderabad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.checkout.address}</label>
                  <textarea
                    required
                    rows={2}
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="House/Flat No, Apartment name, Street, Landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm resize-none"
                  ></textarea>
                  {formErrors.address && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.checkout.pincode}</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={customer.pincode}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                    placeholder="500060"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm"
                  />
                  {formErrors.pincode && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.pincode}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.checkout.notes}</label>
                  <input
                    type="text"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <h4 className="font-bold text-xs text-stone-900">{t.checkout.cod}</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">Pay securely upon delivery at your doorstep</p>
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
                    <h4 className="font-bold text-xs text-stone-900">UPI QR Code (GPay, PhonePe, Paytm)</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">Scan live QR code & submit 12-digit UTR</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Pricing Totals */}
            <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({cart.length} items)</span>
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

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:bg-stone-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>
                    {paymentMethod === 'upi' ? 'Continue to UPI QR Payment' : t.checkout.placeOrder} (₹{orderTotal})
                  </span>
                </>
              )}
            </button>
          </form>
          )
        )}

        {/* STEP 2: UPI QR CODE & 12-DIGIT UTR SUBMISSION */}
        {step === 'UPI_QR' && upiQrDetails && (
          <form onSubmit={handleSubmitUtr} className="p-6 sm:p-8 space-y-5 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Step 2 of 2: Scan QR & Enter UTR Reference
              </span>
              <h3 className="text-lg font-black text-stone-900">Scan & Pay ₹{upiQrDetails.amount}</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">{upiQrDetails.instructions}</p>
            </div>

            {/* Dynamic QR Code Display */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm">
                <img
                  src={upiQrDetails.qrCodeDataUrl}
                  alt="UPI Payment QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="mt-3 text-center">
                <span className="text-[11px] font-bold text-stone-500 uppercase block">Official Merchant UPI ID</span>
                <span className="font-mono font-bold text-xs sm:text-sm text-stone-900 bg-white px-3 py-1 rounded-lg border border-stone-200 inline-block mt-0.5">
                  {upiQrDetails.upiId}
                </span>
                <span className="text-[10px] text-stone-500 block mt-1">
                  Payee: {upiQrDetails.merchantName}
                </span>
              </div>
            </div>

            {/* UTR Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                Enter 12-Digit Bank Transaction Reference (UTR / Ref No.) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={22}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 429019284712"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 font-mono text-sm tracking-wider uppercase outline-none"
              />
              <p className="text-[11px] text-stone-500">
                You can copy the 12-digit UTR from your Google Pay, PhonePe, or Paytm receipt.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="py-3 px-5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmittingUtr || !utrNumber.trim()}
                className="flex-1 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:bg-stone-300"
              >
                {isSubmittingUtr ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Reference...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Submit UTR & Complete Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
