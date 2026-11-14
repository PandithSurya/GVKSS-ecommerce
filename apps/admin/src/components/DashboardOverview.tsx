import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  Eye,
} from 'lucide-react';
import { formatINR, formatDate } from '@organic-store/shared-utils';

interface DashboardOverviewProps {
  stats: any;
  pendingPaymentsCount: number;
  lowStockCount: number;
  recentOrders: any[];
  onNavigateToPayments: () => void;
  onNavigateToStock: () => void;
  onViewOrder: (order: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  pendingPaymentsCount,
  lowStockCount,
  recentOrders,
  onNavigateToPayments,
  onNavigateToStock,
  onViewOrder,
}) => {
  const totalSales = stats?.totalSales || stats?.grossRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const confirmedCount = stats?.statusBreakdown?.confirmed || 0;
  const shippedCount = stats?.statusBreakdown?.shipped || 0;
  const deliveredCount = stats?.statusBreakdown?.delivered || 0;

  return (
    <div className="space-y-6">
      {/* Alert banner for pending payment verification */}
      {pendingPaymentsCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                {pendingPaymentsCount} UPI Payment{pendingPaymentsCount > 1 ? 's' : ''} Awaiting Manual Bank Verification
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Customers have submitted UTR numbers. Verify against your merchant bank statement before releasing stock for fulfillment.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToPayments}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition shadow-sm self-start sm:self-auto shrink-0"
          >
            Open Payment Desk
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Gross Sales */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-serif text-stone-900">
            {formatINR(totalSales)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
            <span>Aggregated across completed orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-stone-900">
            {totalOrders}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
            <span>{deliveredCount} delivered successfully</span>
          </div>
        </div>

        {/* Pending Verifications */}
        <div
          onClick={onNavigateToPayments}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:border-amber-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Pending UTRs</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-600">
            {pendingPaymentsCount}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-amber-700">
            <span>Requires manual verification</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={onNavigateToStock}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:border-red-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Low Stock SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-red-600">
            {lowStockCount}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
            <span>Below safe threshold</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Fulfillment pipeline overview */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 mb-4">Fulfillment Pipeline</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Pending / Awaiting</span>
            </div>
            <p className="text-lg font-bold text-stone-800 mt-1">
              {stats?.statusBreakdown?.pending || pendingPaymentsCount || 0}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Confirmed / Packing</span>
            </div>
            <p className="text-lg font-bold text-stone-800 mt-1">
              {confirmedCount}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
              <Truck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Dispatched / In Transit</span>
            </div>
            <p className="text-lg font-bold text-stone-800 mt-1">
              {shippedCount}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Delivered</span>
            </div>
            <p className="text-lg font-bold text-stone-800 mt-1">
              {deliveredCount}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Recent Customer Orders</h3>
          <span className="text-xs text-stone-500">Latest activity</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200/60 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                recentOrders.slice(0, 6).map((order) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-100 text-amber-800 border-amber-200',
                    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
                    shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    cancelled: 'bg-stone-100 text-stone-700 border-stone-200',
                  };

                  return (
                    <tr key={order._id || order.id || order.orderNumber} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-4 font-mono font-medium text-stone-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-stone-800">{order.customerName}</p>
                        <p className="text-[11px] text-stone-500">{order.phone}</p>
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {formatINR(order.totalAmount || order.total)}
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-stone-600">
                        {order.paymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${
                            statusColors[order.orderStatus || order.status] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {order.orderStatus || order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
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
    </div>
  );
};
