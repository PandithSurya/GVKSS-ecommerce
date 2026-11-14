import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  XCircle,
  Loader2,
  X,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface InventoryManagerProps {
  inventory: any[];
  onRefreshInventory: () => void;
  showToast: (msg: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  inventory,
  onRefreshInventory,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');
  const [selectedItemForAdd, setSelectedItemForAdd] = useState<any | null>(null);
  const [unitsToAdd, setUnitsToAdd] = useState('50');
  const [referenceNote, setReferenceNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter items
  const filteredInventory = inventory.filter((item) => {
    const p = item.product || item;
    const name = (item.productName || item.name || p.name || '').toLowerCase();
    const sku = (item.sku || p.sku || '').toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) || sku.includes(searchTerm.toLowerCase());

    const stock = item.availableStock ?? item.stockQuantity ?? p.stockQuantity ?? p.stock ?? 0;
    const minThreshold = item.lowStockThreshold ?? item.minThreshold ?? p.minThreshold ?? 10;

    let matchesFilter = true;
    if (stockFilter === 'LOW') {
      matchesFilter = stock > 0 && stock <= minThreshold;
    } else if (stockFilter === 'OUT') {
      matchesFilter = stock <= 0;
    }

    return matchesSearch && matchesFilter;
  });

  const lowStockCount = inventory.filter((item) => {
    const p = item.product || item;
    const stock = item.availableStock ?? item.stockQuantity ?? p.stockQuantity ?? p.stock ?? 0;
    const min = item.lowStockThreshold ?? item.minThreshold ?? p.minThreshold ?? 10;
    return stock > 0 && stock <= min;
  }).length;

  const outOfStockCount = inventory.filter((item) => {
    const p = item.product || item;
    const stock = item.availableStock ?? item.stockQuantity ?? p.stockQuantity ?? p.stock ?? 0;
    return stock <= 0;
  }).length;

  const handleOpenAddStock = (item: any) => {
    setSelectedItemForAdd(item);
    setUnitsToAdd('50');
    setReferenceNote('');
  };

  const handleSubmitAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForAdd) return;

    const qty = parseInt(unitsToAdd, 10);
    if (!qty || qty <= 0) {
      alert('Please enter a valid positive number of units to add.');
      return;
    }

    const p = selectedItemForAdd.product || selectedItemForAdd;
    const productId =
      selectedItemForAdd.productId ||
      selectedItemForAdd._id ||
      selectedItemForAdd.id ||
      p._id ||
      p.id ||
      selectedItemForAdd.inventoryId;

    if (!productId || productId === 'undefined') {
      alert('Cannot determine valid product ID for this inventory item.');
      return;
    }

    const productName =
      selectedItemForAdd.productName ||
      selectedItemForAdd.name ||
      p.name ||
      'Organic Product';

    setIsSubmitting(true);
    try {
      await adminApi.addStock(
        productId,
        qty,
        referenceNote || 'Restock received from verified organic farmer collective'
      );
      showToast(`Added ${qty} units of "${productName}" to inventory.`);
      setSelectedItemForAdd(null);
      onRefreshInventory();
    } catch (err: any) {
      alert(err?.message || 'Failed to update inventory ledger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Tracked SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-stone-900">{inventory.length}</p>
          <p className="text-xs text-stone-500 mt-1">Live stock ledger items</p>
        </div>

        <div
          onClick={() => setStockFilter('LOW')}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm cursor-pointer hover:border-amber-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Low Stock SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">{lowStockCount}</p>
          <p className="text-xs text-amber-700 mt-1">Below safe threshold</p>
        </div>

        <div
          onClick={() => setStockFilter('OUT')}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm cursor-pointer hover:border-red-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Depleted / Out</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">{outOfStockCount}</p>
          <p className="text-xs text-red-600 mt-1">Zero units available for sale</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-serif">Inventory & Warehouse Stock Ledger</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Atomic reservation, replenishments, and low-inventory safety alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by product, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setStockFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                stockFilter === 'ALL' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter('LOW')}
              className={`px-3 py-1.5 rounded-lg transition ${
                stockFilter === 'LOW' ? 'bg-amber-500 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter('OUT')}
              className={`px-3 py-1.5 rounded-lg transition ${
                stockFilter === 'OUT' ? 'bg-red-600 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200/60 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Item & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">In-Stock</th>
                <th className="py-3.5 px-4 text-center">Reserved</th>
                <th className="py-3.5 px-4 text-center">Available</th>
                <th className="py-3.5 px-4 text-center">Min Threshold</th>
                <th className="py-3.5 px-4">Health Status</th>
                <th className="py-3.5 px-4 text-right">Replenish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No inventory records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const p = item.product || item;
                  const itemId =
                    item.inventoryId ||
                    item.productId ||
                    item._id ||
                    item.id ||
                    p._id ||
                    p.id;
                  const productName =
                    item.productName ||
                    item.name ||
                    p.name ||
                    'Organic Product';
                  const sku = item.sku || p.sku || 'N/A';
                  const category = item.category || p.category || 'General';
                  const image =
                    item.image ||
                    p.image ||
                    item.primaryImage ||
                    p.primaryImage ||
                    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=100';

                  const totalStock =
                    item.totalStock ??
                    item.stockQuantity ??
                    p.stockQuantity ??
                    p.stock ??
                    0;
                  const reserved =
                    item.reservedStock ??
                    item.reservedQuantity ??
                    p.reservedStock ??
                    0;
                  const available =
                    item.availableStock ??
                    Math.max(0, totalStock - reserved);
                  const min =
                    item.lowStockThreshold ??
                    item.minThreshold ??
                    p.minThreshold ??
                    10;

                  const isOut = available <= 0;
                  const isLow = !isOut && available <= min;

                  return (
                    <tr key={itemId} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={image}
                            alt={productName}
                            className="w-9 h-9 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-stone-900">{productName}</p>
                            <p className="text-[10px] text-stone-400 font-mono">
                              SKU: {sku} • {item.quantity || p.quantity || '1 unit'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 capitalize text-stone-600">
                        {category}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-stone-900 font-mono">
                        {totalStock}
                      </td>
                      <td className="py-3.5 px-4 text-center text-stone-500 font-mono">
                        {reserved}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-700 font-mono">
                        {available}
                      </td>
                      <td className="py-3.5 px-4 text-center text-stone-500 font-mono">
                        {min}
                      </td>
                      <td className="py-3.5 px-4">
                        {isOut ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800 border border-red-200">
                            Depleted (0)
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenAddStock(item)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 rounded-lg text-xs font-semibold transition border border-emerald-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Stock</span>
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

      {/* Add Stock Modal */}
      {selectedItemForAdd && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-bold text-stone-900 text-base">
                Replenish Inventory Ledger
              </h3>
              <button
                onClick={() => setSelectedItemForAdd(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <p className="text-xs text-stone-500">Target Product:</p>
              <p className="font-bold text-stone-900 text-sm">
                {selectedItemForAdd.productName ||
                  selectedItemForAdd.name ||
                  (selectedItemForAdd.product && selectedItemForAdd.product.name) ||
                  'Organic Product'}
              </p>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                Current Available Stock:{' '}
                {selectedItemForAdd.availableStock ??
                  selectedItemForAdd.stockQuantity ??
                  selectedItemForAdd.totalStock ??
                  0}{' '}
                units
              </p>
            </div>

            <form onSubmit={handleSubmitAddStock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Units to Add *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={unitsToAdd}
                  onChange={(e) => setUnitsToAdd(e.target.value)}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-base font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reference Note / Procurement Batch
                </label>
                <textarea
                  rows={3}
                  value={referenceNote}
                  onChange={(e) => setReferenceNote(e.target.value)}
                  placeholder="e.g. Received 50kg batch from farmer collective #AP-2026-B4"
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForAdd(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Update Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
