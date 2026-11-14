import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  Ban
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrowseShop: () => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  onBrowseShop,
}) => {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelModalOrder, setCancelModalOrder] = useState<any>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await api.orders.getMyOrders();
      if (res?.data?.orders) {
        setOrders(res.data.orders);
      } else if (Array.isArray(res?.data)) {
        setOrders(res.data);
      }
    } catch (err: any) {
      setActionError(err?.message || 'Failed to load order history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder || !cancelReason.trim()) return;

    try {
      setCancellingOrderId(cancelModalOrder.orderNumber);
      await api.orders.cancelOrder(cancelModalOrder.orderNumber, cancelReason.trim());
      setCancelModalOrder(null);
      setCancelReason('');
      fetchOrders();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to cancel order.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Delivered
          </span>
        );
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Truck className="w-3 h-3 text-blue-600" /> Shipped / In Transit
          </span>
        );
      case 'PACKED':
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Package className="w-3 h-3 text-amber-600" /> Confirmed & Processing
          </span>
        );
      case 'PROCESSING_PAYMENT_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" /> Verifying UPI Payment
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <Ban className="w-3 h-3 text-red-600" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
            <Clock className="w-3 h-3 text-stone-500" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 tracking-tight">
                {language === 'te' ? 'నా ఆర్డర్లు' : 'My Purchase History'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'te' ? 'మీ మునుపటి ఆర్డర్లు మరియు ట్రాకింగ్ వివరాలు' : 'Track current orders and review your past farm harvest deliveries.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              title="Refresh Orders"
              className="p-2 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-white border border-transparent hover:border-stone-200 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {actionError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-stone-600">Loading your order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <h4 className="font-bold text-stone-800 text-sm">No orders placed yet</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  You haven't ordered any natural products yet. Browse our unpolished grains, pure cold-pressed oils, and spices today!
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBrowseShop();
                }}
                className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition"
              >
                Browse Natural Shop
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const canCancel =
                  ['PENDING_PAYMENT', 'PROCESSING_PAYMENT_VERIFICATION', 'CONFIRMED'].includes(order.orderStatus);

                return (
                  <div
                    key={order._id || order.orderNumber}
                    className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-white hover:border-emerald-200 hover:shadow-md transition space-y-3"
                  >
                    {/* Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          • {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.orderStatus)}
                      </div>
                    </div>

                    {/* Middle: Items & Total */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-2 space-y-1.5">
                        <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                          Purchased Harvest
                        </p>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((it: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-stone-700 pr-2">
                              <span className="truncate max-w-[240px]">
                                {it.name} <span className="text-stone-400">× {it.quantity}</span>
                              </span>
                              <span className="font-bold">₹{it.subtotal || it.unitPrice * it.quantity}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-stone-600">Organic Harvest Box</p>
                        )}
                      </div>

                      <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-stone-100 pt-2 sm:pt-0 sm:pl-3">
                        <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                          Payment & Total
                        </p>
                        <div className="flex items-center gap-1.5 font-bold text-stone-800">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{order.paymentMethod === 'UPI' ? 'UPI QR Payment' : 'Cash on Delivery (COD)'}</span>
                        </div>
                        <p className="text-base font-black text-emerald-800">
                          ₹{order.totalPayableAmount}
                        </p>
                      </div>
                    </div>

                    {/* Courier Tracking Info if shipped */}
                    {order.trackingNumber && (
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-700" />
                          <span>
                            Shipped via <strong className="font-bold">{order.courierName || 'Courier Service'}</strong>
                          </span>
                        </div>
                        <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800">
                          AWB: {order.trackingNumber}
                        </span>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <span className="text-[11px] text-stone-500 truncate max-w-sm">
                        Deliver to: {order.shippingAddress?.fullName}, {order.shippingAddress?.city} ({order.shippingAddress?.pinCode})
                      </span>

                      {canCancel && (
                        <button
                          onClick={() => setCancelModalOrder(order)}
                          className="px-3 py-1 rounded-lg text-red-600 hover:bg-red-50 font-bold transition text-[11px]"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Cancel Order Prompt Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleCancelOrder}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200"
          >
            <h4 className="font-bold text-base text-stone-900">
              Cancel Order {cancelModalOrder.orderNumber}?
            </h4>
            <p className="text-xs text-stone-600">
              Are you sure you want to cancel this order? Any reserved stock will be returned to inventory.
            </p>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Reason for Cancellation
              </label>
              <textarea
                required
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., Ordered wrong pack size, want to change address."
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-emerald-600"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 rounded-xl text-stone-600 font-bold text-xs"
              >
                Keep Order
              </button>
              <button
                type="submit"
                disabled={Boolean(cancellingOrderId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
              >
                {cancellingOrderId ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
