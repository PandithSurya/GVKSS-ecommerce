import React from 'react';
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  Leaf
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { businessInfo } from '../../data/businessInfo';
import type { Order } from '../../types';

interface OrderReceiptProps {
  order: Order | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({
  order,
  onClose,
  onContinueShopping
}) => {
  const { language } = useLanguage();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppSendReceipt = () => {
    let msg = `*GVKSS ORDER CONFIRMATION*\n`;
    msg += `Order ID: ${order.orderId}\n`;
    msg += `Date: ${order.date}\n`;
    msg += `Customer: ${order.customer.name} (${order.customer.phone})\n`;
    msg += `Delivery Address: ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}\n\n`;
    msg += `*ITEMS ORDERED:*\n`;
    order.items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.name} (${item.product.teluguName}) - Qty: ${item.quantity} x ${item.product.quantity} = Rs. ${item.product.price * item.quantity}\n`;
    });
    msg += `\n*Subtotal:* Rs. ${order.subtotal}\n`;
    msg += `*Delivery Fee:* Rs. ${order.deliveryFee}\n`;
    msg += `*Total Amount:* Rs. ${order.total}\n`;
    msg += `*Payment Mode:* ${order.paymentMethod.toUpperCase()}\n\n`;
    msg += `Please deliver as soon as possible. Thank you!`;

    window.open(
      `https://wa.me/919391628344?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-emerald-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 z-10 my-6 print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Success Banner */}
        <div className="p-6 bg-emerald-700 text-white text-center print:bg-white print:text-black">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto mb-3 text-white">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-sans font-black text-2xl">
            {language === 'te' ? 'ఆర్డర్ విజయవంతంగా నమోదు చేయబడింది!' : 'Order Placed Successfully!'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md mx-auto">
            {language === 'te'
              ? 'మీ ఆర్డర్ నిర్ధారించబడింది. త్వరలోనే మా ప్రతినిధి మీతో సంప్రదిస్తారు.'
              : 'Thank you for ordering natural & organic products from GVKSS.'}
          </p>
        </div>

        {/* Invoice Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto print:max-h-none print:p-0">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border border-emerald-300 shadow-sm shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Gau Vishwa Kalyan Samrakshana Samithi Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-sans font-black text-xl text-stone-900 block leading-tight">
                  GVKSS
                </span>
                <span className="text-[10px] text-emerald-800 font-bold block tracking-wider">
                  Go Vishwa Kalyana Voluntary Service Organization • Regd. No. 320 of 2024
                </span>
                <p className="text-xs text-stone-600 max-w-xs mt-0.5">
                  Shop No. 7, Janapriya Soudha, Saroornagar, Hyderabad - 500060
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-500 uppercase tracking-wider block font-bold">
                Invoice / Order ID
              </span>
              <span className="font-mono font-black text-lg text-emerald-800 block">
                {order.orderId}
              </span>
              <span className="text-xs text-stone-500 block">{order.date}</span>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Customer Information
              </span>
              <p className="font-bold text-stone-900 text-sm">
                {order.customer.name}
              </p>
              <p className="text-stone-600 font-mono mt-0.5">
                +91 {order.customer.phone}
              </p>
              {order.customer.email && (
                <p className="text-stone-500">{order.customer.email}</p>
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                Delivery Location
              </span>
              <p className="text-stone-800 leading-relaxed">
                {order.customer.address}, {order.customer.city} -{' '}
                <strong className="font-bold">{order.customer.pincode}</strong>
              </p>
              {order.customer.notes && (
                <p className="text-stone-500 italic mt-1">
                  Note: {order.customer.notes}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="font-bold text-sm text-stone-900 mb-2">
              Items Ordered ({order.items.length})
            </h4>
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3.5">Product</th>
                    <th className="py-2.5 px-3.5 text-center">Unit Pack</th>
                    <th className="py-2.5 px-3.5 text-center">Qty</th>
                    <th className="py-2.5 px-3.5 text-right">Price</th>
                    <th className="py-2.5 px-3.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3.5">
                        <span className="font-bold text-stone-900 block">
                          {item.product.name}
                        </span>
                        <span className="text-[11px] text-emerald-800 font-telugu block">
                          {item.product.teluguName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-center text-stone-600">
                        {item.product.quantity}
                      </td>
                      <td className="py-2.5 px-3.5 text-center font-bold text-stone-900">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-stone-600">
                        ₹{item.product.price}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-black text-stone-900">
                        ₹{item.product.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charges</span>
                <span className="font-bold text-emerald-700">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-black text-stone-900">
                <span>Total</span>
                <span className="text-emerald-900">₹{order.total}</span>
              </div>
              <div className="text-[11px] text-stone-500 text-right">
                Payment Mode:{' '}
                <strong className="text-stone-800 uppercase">
                  {order.paymentMethod}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-emerald-50/50 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-full bg-white border border-stone-300 text-stone-800 font-bold text-xs hover:bg-stone-50 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handleWhatsAppSendReceipt}
              className="py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-green-glow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send to WhatsApp</span>
            </button>
          </div>

          <button
            onClick={onContinueShopping}
            className="py-2.5 px-5 rounded-full bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
          >
            {language === 'te' ? 'షాపింగ్ కొనసాగించండి' : 'Continue Shopping'}
          </button>
        </div>
      </div>
    </div>
  );
};
