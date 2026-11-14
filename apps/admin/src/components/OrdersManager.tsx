import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Truck,
  Package,
  Calendar,
  User,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  X,
  Loader2,
  FileText,
} from 'lucide-react';
import { formatINR, formatDate } from '@organic-store/shared-utils';
import { adminApi } from '../services/adminApi';

interface OrdersManagerProps {
  orders: any[];
  selectedOrder: any | null;
  onSelectOrder: (order: any | null) => void;
  onRefreshOrders: () => void;
  showToast: (msg: string) => void;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders,
  selectedOrder,
  onSelectOrder,
  onRefreshOrders,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setOrderStatusFilter] = useState('ALL');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusComment, setStatusComment] = useState('');

  // Shipping tracking modal / fields inside detail
  const [courierName, setCourierName] = useState('Direct Express Delivery');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.phone || '').includes(searchTerm);

    const currentStatus = (order.orderStatus || order.status || '').toLowerCase();
    const matchesStatus =
      statusFilter === 'ALL' || currentStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (order: any) => {
    onSelectOrder(order);
    setNewStatus(order.orderStatus || order.status || 'pending');
    setCourierName(order.courierPartner || order.courierName || 'Direct Express Delivery');
    setTrackingNumber(order.trackingNumber || '');
    setEstimatedDelivery(order.estimatedDelivery || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    const orderId = selectedOrder._id || selectedOrder.id;

    setIsUpdatingStatus(true);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus, statusComment || undefined);
      showToast(`Order status updated to ${newStatus.toUpperCase()}`);
      onRefreshOrders();
      // Update local selectedOrder representation
      onSelectOrder({
        ...selectedOrder,
        orderStatus: newStatus,
        status: newStatus,
      });
      setStatusComment('');
    } catch (err: any) {
      alert(err?.message || 'Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder) return;
    const orderId = selectedOrder._id || selectedOrder.id;

    if (!trackingNumber.trim()) {
      alert('Please enter a valid tracking number or consignment reference.');
      return;
    }

    setIsUpdatingTracking(true);
    try {
      await adminApi.updateTracking(orderId, courierName, trackingNumber, estimatedDelivery);
      showToast('Consignment tracking details updated successfully');
      onRefreshOrders();
      onSelectOrder({
        ...selectedOrder,
        courierPartner: courierName,
        trackingNumber,
        estimatedDelivery,
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to update tracking details');
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  const statusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    const classes: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-stone-100 text-stone-700 border-stone-200',
    };
    return (
      <span
        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
          classes[s] || 'bg-stone-100 text-stone-700'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-serif">Customer Orders Directory</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage dispatch, delivery tracking, items breakdown, and order lifecycle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by order #, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52 sm:w-64"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={statusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-stone-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200/60 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemCount = (order.items || []).reduce(
                    (acc: number, item: any) => acc + (item.quantity || 1),
                    0
                  );
                  const total = order.totalAmount ?? order.total ?? 0;

                  return (
                    <tr
                      key={order._id || order.id || order.orderNumber}
                      className="hover:bg-stone-50/70 transition cursor-pointer"
                      onClick={() => handleOpenDetail(order)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-stone-800">{order.customerName}</p>
                        <p className="text-[11px] text-stone-500 font-mono">{order.phone}</p>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-medium">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900 font-serif">
                        {formatINR(total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="uppercase text-[10px] font-bold text-stone-700">
                            {order.paymentMethod}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {statusBadge(order.orderStatus || order.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenDetail(order)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition border border-stone-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                  #
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 text-base font-mono">
                      {selectedOrder.orderNumber}
                    </h3>
                    {statusBadge(selectedOrder.orderStatus || selectedOrder.status)}
                  </div>
                  <p className="text-xs text-stone-500">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Customer & Delivery Address Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-stone-700 font-semibold text-xs uppercase tracking-wider">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Customer Information</span>
                  </div>
                  <p className="text-sm font-bold text-stone-900">{selectedOrder.customerName}</p>
                  <p className="text-xs text-stone-600 font-mono">Phone: {selectedOrder.phone}</p>
                  {selectedOrder.secondaryPhone && (
                    <p className="text-xs text-stone-600 font-mono">
                      Alt Phone: {selectedOrder.secondaryPhone}
                    </p>
                  )}
                  {selectedOrder.email && (
                    <p className="text-xs text-stone-600">Email: {selectedOrder.email}</p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-stone-700 font-semibold text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-line">
                    {selectedOrder.deliveryAddress}
                  </p>
                  {selectedOrder.notes && (
                    <div className="pt-2 border-t border-stone-200 text-xs text-stone-500 italic">
                      Special Notes: &ldquo;{selectedOrder.notes}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div>
                <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-3">
                  Ordered Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Product</th>
                        <th className="py-2.5 px-3">Unit Price</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(selectedOrder.items || []).map((item: any, idx: number) => {
                        const unitPrice = item.price || item.unitPrice || 0;
                        const qty = item.quantity || 1;
                        const lineTotal = item.lineTotal || item.subtotal || unitPrice * qty;

                        return (
                          <tr key={idx} className="hover:bg-stone-50/50">
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2.5">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-stone-900">{item.name}</p>
                                  {item.teluguName && (
                                    <p className="text-[10px] text-stone-500">{item.teluguName}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-stone-700">{formatINR(unitPrice)}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-stone-800">{qty}</td>
                            <td className="py-2.5 px-3 text-right font-semibold text-stone-900 font-serif">
                              {formatINR(lineTotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bill Financial Summary */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Subtotal:</span>
                  <span>{formatINR(selectedOrder.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Delivery Charges:</span>
                  <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : formatINR(selectedOrder.deliveryFee || 0)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700">
                    <span>Discount:</span>
                    <span>-{formatINR(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                  <span className="font-bold text-sm text-stone-900">Total Amount Payable:</span>
                  <span className="font-serif font-bold text-lg text-emerald-800">
                    {formatINR(selectedOrder.totalAmount ?? selectedOrder.total ?? 0)}
                  </span>
                </div>
              </div>

              {/* Payment Status & Details */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
                <div className="flex items-center gap-2 text-stone-700 font-semibold text-xs uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Payment Information</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-stone-500 block">Method:</span>
                    <span className="font-bold uppercase text-stone-800">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Payment Status:</span>
                    <span className="font-semibold capitalize text-stone-800">
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  {selectedOrder.utrNumber && (
                    <div>
                      <span className="text-stone-500 block">Submitted UTR:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {selectedOrder.utrNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status Update Controls */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-3">
                <div className="flex items-center gap-2 text-stone-700 font-semibold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Update Order Lifecycle Status</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full sm:w-48 p-2 text-xs border border-stone-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="pending">PENDING</option>
                    <option value="confirmed">CONFIRMED</option>
                    <option value="shipped">SHIPPED</option>
                    <option value="delivered">DELIVERED</option>
                    <option value="cancelled">CANCELLED</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Status update note (optional)..."
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    className="w-full flex-1 p-2 text-xs border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdatingStatus}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {isUpdatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    Save Status
                  </button>
                </div>
              </div>

              {/* Courier Tracking Dispatch Form */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-3">
                <div className="flex items-center gap-2 text-stone-700 font-semibold text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Consignment & Courier Dispatch Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Courier Partner</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. DTDC, Delhivery, Direct Express"
                      className="w-full p-2 text-xs border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Tracking Number / Waybill</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. DEL78912301"
                      className="w-full p-2 text-xs border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Est. Delivery Date</label>
                    <input
                      type="text"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      placeholder="e.g. 2026-11-20 or 3 Days"
                      className="w-full p-2 text-xs border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateTracking}
                    disabled={isUpdatingTracking}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isUpdatingTracking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    Update Tracking Info
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end shrink-0">
              <button
                onClick={() => onSelectOrder(null)}
                className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-xl transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
