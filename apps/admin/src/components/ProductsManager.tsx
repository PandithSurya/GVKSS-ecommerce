import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Loader2,
  Upload,
} from 'lucide-react';
import { formatINR } from '@organic-store/shared-utils';
import { adminApi } from '../services/adminApi';
import { ADMIN_CATEGORIES } from '../data/categories';

interface ProductsManagerProps {
  products: any[];
  onRefreshProducts: () => void;
  showToast: (msg: string) => void;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  onRefreshProducts,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const initialForm = {
    name: '',
    teluguName: '',
    category: 'millets',
    price: '',
    discountedPrice: '',
    quantity: '1 kg',
    unit: 'kg',
    sku: '',
    stockQuantity: '50',
    minThreshold: '10',
    primaryImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    description: '',
    shortDescription: '',
    ingredients: '',
    status: 'active',
    featured: false,
  };

  const [form, setForm] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setForm({
      name: p.name || '',
      teluguName: p.teluguName || '',
      category: p.category || 'millets',
      price: String(p.price || ''),
      discountedPrice: String(p.discountedPrice || p.originalPrice || ''),
      quantity: p.quantity || '1 kg',
      unit: p.unit || 'kg',
      sku: p.sku || '',
      stockQuantity: String(p.stock ?? p.stockQuantity ?? 50),
      minThreshold: String(p.minThreshold || 10),
      primaryImage: p.image || p.primaryImage || '',
      description: p.description || '',
      shortDescription: p.shortDescription || p.teluguDescription || '',
      ingredients: p.ingredients || '',
      status: p.status || (p.inStock ? 'active' : 'inactive'),
      featured: Boolean(p.featured || p.isFeatured),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      alert('Please fill out Name, Price, and Category.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        teluguName: form.teluguName,
        category: form.category,
        price: parseFloat(form.price),
        discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : undefined,
        quantity: form.quantity,
        unit: form.unit,
        sku: form.sku || `GVK-${Date.now().toString().slice(-6)}`,
        stockQuantity: parseInt(form.stockQuantity, 10) || 0,
        minThreshold: parseInt(form.minThreshold, 10) || 10,
        primaryImage: form.primaryImage,
        image: form.primaryImage,
        description: form.description,
        shortDescription: form.shortDescription,
        ingredients: form.ingredients,
        status: form.status,
        inStock: form.status === 'active',
        featured: form.featured,
        isFeatured: form.featured,
      };

      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        await adminApi.updateProduct(id, payload);
        showToast(`Product "${form.name}" updated successfully.`);
      } else {
        await adminApi.createProduct(payload);
        showToast(`Product "${form.name}" published successfully.`);
      }

      setIsModalOpen(false);
      onRefreshProducts();
    } catch (err: any) {
      alert(err?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (p: any) => {
    const id = p._id || p.id;
    const confirmed = window.confirm(`Are you sure you want to archive or remove "${p.name}"?`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await adminApi.deleteProduct(id);
      showToast(`Product "${p.name}" archived.`);
      onRefreshProducts();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.teluguName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-serif">Organic Catalog Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage product titles, prices, descriptions, imagery, and shelf availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-56"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {ADMIN_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Add Product Button */}
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200/60 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Quantity / Unit</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const id = p._id || p.id;
                  const stock = p.stockQuantity ?? p.stock ?? 0;
                  const isLow = stock <= (p.minThreshold || 10);

                  return (
                    <tr key={id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || p.primaryImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=100'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-stone-900">{p.name}</p>
                            {p.teluguName && (
                              <p className="text-[11px] text-stone-500">{p.teluguName}</p>
                            )}
                            {p.sku && (
                              <p className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 capitalize text-stone-600">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-stone-900 font-serif">{formatINR(p.price)}</p>
                        {p.discountedPrice && p.discountedPrice < p.price && (
                          <p className="text-[10px] text-stone-400 line-through">
                            {formatINR(p.discountedPrice)}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {p.quantity || '1 unit'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-semibold ${
                            stock === 0
                              ? 'text-red-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {stock} in stock
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                            p.status === 'active' || p.inStock
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                        >
                          {p.status || (p.inStock ? 'active' : 'inactive')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            disabled={deletingId === id}
                            className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Archive / Delete"
                          >
                            {deletingId === id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-stone-900 text-base">
                {editingProduct ? 'Edit Organic Product' : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Pure Foxtail Millets (Korralu)"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Telugu Name / వివరణ
                  </label>
                  <input
                    type="text"
                    value={form.teluguName}
                    onChange={(e) => setForm({ ...form, teluguName: e.target.value })}
                    placeholder="e.g. స్వచ్ఛమైన కొర్రలు"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {ADMIN_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="120"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    MRP / Original (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.discountedPrice}
                    onChange={(e) => setForm({ ...form, discountedPrice: e.target.value })}
                    placeholder="140"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pack Weight / Quantity
                  </label>
                  <input
                    type="text"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="e.g. 1 kg, 500 ml"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                    placeholder="50"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Min Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={form.minThreshold}
                    onChange={(e) => setForm({ ...form, minThreshold: e.target.value })}
                    placeholder="10"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={form.primaryImage}
                  onChange={(e) => setForm({ ...form, primaryImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe health benefits, organic source, farming method..."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.status === 'active'}
                    onChange={(e) => setForm({ ...form, status: e.target.checked ? 'active' : 'inactive' })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Active & Available for Customer Purchase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Featured on Storefront</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  {editingProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
