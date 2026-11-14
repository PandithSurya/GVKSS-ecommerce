import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { formatINR, formatDate } from '@organic-store/shared-utils';
import { adminApi } from '../services/adminApi';

interface CustomersManagerProps {
  customers: any[];
  onRefreshCustomers: () => void;
  showToast: (msg: string) => void;
}

export const CustomersManager: React.FC<CustomersManagerProps> = ({
  customers,
  onRefreshCustomers,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const name = (c.name || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || email.includes(q) || phone.includes(q);
  });

  const handleToggleStatus = async (customer: any) => {
    const id = customer._id || customer.id;
    const currentStatus = customer.status || 'active';
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';

    const confirmed = window.confirm(
      `Are you sure you want to change account status for ${customer.name || customer.email} to ${nextStatus.toUpperCase()}?`
    );
    if (!confirmed) return;

    setIsUpdatingId(id);
    try {
      await adminApi.toggleCustomerStatus(id, nextStatus as any);
      showToast(`Customer account set to ${nextStatus}.`);
      onRefreshCustomers();
    } catch (err: any) {
      alert(err?.message || 'Failed to update customer status');
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-serif">Customer Directory & Spend Metrics</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified accounts, cumulative spend, order totals, and access authorization.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 sm:w-80"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200/60 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                <th className="py-3.5 px-4 text-center">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const id = c._id || c.id;
                  const orderCount = c.orderCount ?? c.totalOrders ?? 0;
                  const totalSpend = c.totalSpend ?? c.totalAmount ?? 0;
                  const status = c.status || 'active';
                  const isUpdating = isUpdatingId === id;

                  return (
                    <tr key={id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {(c.name || c.email || 'U').charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">{c.name || 'Organic Patron'}</p>
                            <p className="text-[11px] text-stone-500 font-mono">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-mono">
                        {c.phone || 'Not provided'}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-stone-800">
                        {orderCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-serif font-bold text-stone-900">
                        {formatINR(totalSpend)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                            status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          disabled={isUpdating}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition border ${
                            status === 'active'
                              ? 'text-stone-600 hover:text-red-700 hover:bg-red-50 border-stone-200'
                              : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                          }`}
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : status === 'active' ? (
                            'Suspend'
                          ) : (
                            'Activate'
                          )}
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
