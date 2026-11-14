import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Settings,
  Users,
  LogOut,
  ChevronRight,
  Lock,
  QrCode,
  Plus,
  Edit,
  Trash2,
  FileText,
  Boxes,
  Layers,
  ArrowUpRight,
  X,
  Upload
} from 'lucide-react';
import { api, getAdminAccessToken, setAdminAccessToken } from '../../services/api';
import { categories } from '../../data/categories';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [adminEmail, setAdminEmail] = useState('admin@gvkss.org');
  const [adminPassword, setAdminPassword] = useState('AdminSecure@2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'orders' | 'products' | 'stock' | 'customers' | 'settings' | 'audit'>('overview');

  // Dashboard Data State
  const [stats, setStats] = useState<any>(null);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search and Filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [customerSearch, setCustomerSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isLoadingOrderDetail, setIsLoadingOrderDetail] = useState(false);
  const [rejectPaymentId, setRejectPaymentId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [trackingModalOrder, setTrackingModalOrder] = useState<any>(null);
  const [courierName, setCourierName] = useState('Direct Express Delivery');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Product CRUD Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    teluguName: '',
    slug: '',
    category: 'rice',
    price: '',
    discountedPrice: '',
    sku: '',
    stockQuantity: '50',
    minThreshold: '10',
    unit: 'kg',
    quantity: '1 kg',
    description: '',
    shortDescription: '',
    ingredients: '',
    nutritionalInfo: '',
    certificationDetails: '100% Certified Organic • PGS-India Verified',
    status: 'active',
    featured: false,
    primaryImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
  });

  // Stock Management Modal state
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [targetStockItem, setTargetStockItem] = useState<any>(null);
  const [unitsToAdd, setUnitsToAdd] = useState('50');
  const [stockReferenceNote, setStockReferenceNote] = useState('');
  const [isSubmittingStock, setIsSubmittingStock] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore Admin Session on Mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.admin.getSession();
        if (res?.data?.admin) {
          setAdminUser(res.data.admin);
          setIsAdminLoggedIn(true);
        }
      } catch {
        // No active admin session
      }
    };
    restoreSession();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const res = await api.admin.login({ email: adminEmail, password: adminPassword });
      if (res?.data?.admin) {
        setAdminUser(res.data.admin);
        setIsAdminLoggedIn(true);
        loadDashboardData();
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Admin authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminAccessToken(null);
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, paymentsRes, ordersRes, productsRes, inventoryRes, customersRes, settingsRes, auditRes] =
        await Promise.allSettled([
          api.admin.getDashboardStats(),
          api.admin.getPendingPayments(),
          api.admin.getOrders(),
          api.catalog.getProducts({ limit: 100 }),
          api.admin.getInventory(),
          api.admin.getCustomers(),
          api.admin.getSettings(),
          api.admin.getAuditLogs(),
        ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value?.data);
      if (paymentsRes.status === 'fulfilled') setPendingPayments(paymentsRes.value?.data || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value?.data?.orders || []);
      if (productsRes.status === 'fulfilled') setProducts(productsRes.value?.data || []);
      if (inventoryRes.status === 'fulfilled') setInventoryList(inventoryRes.value?.data || []);
      if (customersRes.status === 'fulfilled') setCustomers(customersRes.value?.data?.customers || []);
      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value?.data);
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value?.data?.logs || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadDashboardData();
    }
  }, [isAdminLoggedIn]);

  // Payment Verification Actions
  const handleConfirmPayment = async (paymentId: string) => {
    if (!paymentId || paymentId === 'undefined') {
      showToast('Error: Payment ID is missing.');
      return;
    }
    try {
      await api.admin.confirmPayment(paymentId, 'Verified against official bank credit.');
      showToast('Payment verified successfully! Order moved to CONFIRMED.');
      loadDashboardData();
      if (selectedOrder) {
        const updated = await api.admin.getOrderDetail(selectedOrder._id);
        if (updated?.data) setSelectedOrder(updated.data);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to verify payment');
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectPaymentId || rejectPaymentId === 'undefined' || !rejectionReason.trim()) {
      showToast('Please provide a valid rejection reason.');
      return;
    }
    try {
      await api.admin.rejectPayment(rejectPaymentId, rejectionReason.trim());
      showToast('Payment rejected. Customer notified.');
      setRejectPaymentId(null);
      setRejectionReason('');
      loadDashboardData();
      if (selectedOrder) {
        const updated = await api.admin.getOrderDetail(selectedOrder._id);
        if (updated?.data) setSelectedOrder(updated.data);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to reject payment');
    }
  };

  // Order Details Action
  const handleViewOrder = async (orderIdOrNumber: string) => {
    setIsLoadingOrderDetail(true);
    setSelectedOrder(null);
    try {
      const res = await api.admin.getOrderDetail(orderIdOrNumber);
      if (res?.data) {
        setSelectedOrder(res.data);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to load order details');
    } finally {
      setIsLoadingOrderDetail(false);
    }
  };

  // Order Status Transitions
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, status);
      showToast(`Order status updated to ${status}`);
      loadDashboardData();
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
        const updated = await api.admin.getOrderDetail(orderId);
        setSelectedOrder(updated.data);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update order status');
    }
  };

  // Tracking info
  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder || !trackingNumber.trim()) return;
    try {
      await api.admin.updateTracking(trackingModalOrder._id, courierName, trackingNumber.trim());
      showToast('Tracking details added and order marked as SHIPPED!');
      setTrackingModalOrder(null);
      setTrackingNumber('');
      loadDashboardData();
      if (selectedOrder && selectedOrder._id === trackingModalOrder._id) {
        const updated = await api.admin.getOrderDetail(trackingModalOrder._id);
        setSelectedOrder(updated.data);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update tracking');
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      teluguName: '',
      slug: '',
      category: 'rice',
      price: '',
      discountedPrice: '',
      sku: `GVK-${Date.now().toString().slice(-6)}`,
      stockQuantity: '50',
      minThreshold: '10',
      unit: 'kg',
      quantity: '1 kg',
      description: '',
      shortDescription: '',
      ingredients: '',
      nutritionalInfo: '',
      certificationDetails: '100% Certified Organic • PGS-India Verified',
      status: 'active',
      featured: false,
      primaryImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProductId(prod._id || prod.id);
    setProductForm({
      name: prod.name || '',
      teluguName: prod.teluguName || '',
      slug: prod.slug || '',
      category: prod.category || 'rice',
      price: String(prod.price || ''),
      discountedPrice: String(prod.discountedPrice || ''),
      sku: prod.sku || '',
      stockQuantity: String(prod.stockQuantity || 50),
      minThreshold: String(prod.minThreshold || 10),
      unit: prod.unit || 'kg',
      quantity: prod.quantity || '1 kg',
      description: prod.description || '',
      shortDescription: prod.shortDescription || '',
      ingredients: prod.ingredients || '',
      nutritionalInfo: prod.nutritionalInfo || '',
      certificationDetails: prod.certificationDetails || '100% Certified Organic',
      status: prod.status || 'active',
      featured: Boolean(prod.featured),
      primaryImage: prod.image || prod.primaryImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      showToast('Product name and price are required.');
      return;
    }

    try {
      const payload = {
        name: productForm.name.trim(),
        teluguName: productForm.teluguName.trim(),
        slug: productForm.slug.trim() || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: productForm.category,
        price: Number(productForm.price),
        discountedPrice: productForm.discountedPrice ? Number(productForm.discountedPrice) : undefined,
        sku: productForm.sku.trim(),
        stockQuantity: Number(productForm.stockQuantity || 0),
        minThreshold: Number(productForm.minThreshold || 10),
        unit: productForm.unit,
        quantity: productForm.quantity,
        description: productForm.description.trim(),
        shortDescription: productForm.shortDescription.trim(),
        ingredients: productForm.ingredients.trim(),
        nutritionalInfo: productForm.nutritionalInfo.trim(),
        certificationDetails: productForm.certificationDetails.trim(),
        status: productForm.status,
        featured: productForm.featured,
        image: productForm.primaryImage,
        primaryImage: productForm.primaryImage,
      };

      if (editingProductId) {
        await api.admin.updateProduct(editingProductId, payload);
        showToast('Product updated successfully!');
      } else {
        await api.admin.createProduct(payload);
        showToast('New product created successfully!');
      }

      setIsProductModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to archive this product? It will be safely archived without breaking past order histories.')) {
      return;
    }
    try {
      await api.admin.deleteProduct(productId);
      showToast('Product archived successfully.');
      loadDashboardData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete product');
    }
  };

  // Stock Inward Restock
  const handleOpenAddStock = (item: any) => {
    setTargetStockItem(item);
    setUnitsToAdd('50');
    setStockReferenceNote('Farm Harvest Inward Delivery');
    setIsAddStockModalOpen(true);
  };

  const handleConfirmAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStockItem || Number(unitsToAdd) <= 0) return;

    setIsSubmittingStock(true);
    try {
      await api.admin.addStock(
        targetStockItem.productId,
        Number(unitsToAdd),
        stockReferenceNote.trim() || 'Inward Batch'
      );
      showToast(`Added ${unitsToAdd} units to ${targetStockItem.productName}!`);
      setIsAddStockModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to add stock');
    } finally {
      setIsSubmittingStock(false);
    }
  };

  // Customer Management
  const handleToggleCustomer = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.admin.toggleCustomerStatus(userId, nextStatus);
      showToast(`Customer account marked as ${nextStatus}.`);
      loadDashboardData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to update customer status');
    }
  };

  // Filtered lists
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !orderSearch ||
      o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerSnapshot?.fullName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInventory = inventoryList.filter((inv) => {
    return (
      !stockSearch ||
      inv.productName?.toLowerCase().includes(stockSearch.toLowerCase()) ||
      inv.sku?.toLowerCase().includes(stockSearch.toLowerCase()) ||
      inv.category?.toLowerCase().includes(stockSearch.toLowerCase())
    );
  });

  const filteredCustomers = customers.filter((c) => {
    return (
      !customerSearch ||
      c.fullName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone?.includes(customerSearch)
    );
  });

  // 1. ADMIN LOGIN VIEW
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-stone-900 text-stone-100 font-sans">
        <div className="w-full max-w-md bg-stone-800/90 rounded-2xl p-8 border border-stone-700 shadow-2xl backdrop-blur-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">GVKSS Admin Console</h2>
            <p className="text-xs text-stone-400">Strict Role-Based Administrative & Payment Verification Desk</p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-300 font-bold mb-1">Administrative Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1">Passphrase</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono focus:border-emerald-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-900/40 disabled:opacity-50"
            >
              {isLoading ? 'Authenticating Privileges...' : 'Access Admin Console'}
            </button>
          </form>

          <div className="pt-4 border-t border-stone-700 flex justify-between items-center text-[11px] text-stone-400">
            <button onClick={onBackToStore} className="hover:text-emerald-400 transition flex items-center gap-1 font-bold">
              ← Return to Public Store
            </button>
            <span className="font-mono text-stone-500">Node/Mongo Atlas v2026</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN LOGGED-IN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 bg-stone-900/95 backdrop-blur-md text-white text-xs font-semibold rounded-xl shadow-xl border border-stone-800 flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700/60 border border-emerald-500 text-emerald-300 flex items-center justify-center font-black text-sm">
            GVK
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none">GVKSS Operations Console</h1>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Role: <span className="font-bold text-emerald-400">{adminUser?.roleName || 'SUPER_ADMIN'}</span> • {adminUser?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={loadDashboardData}
            title="Refresh All Database Metrics"
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          <button
            onClick={onBackToStore}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition font-bold"
          >
            Public Store View
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 transition flex items-center gap-1.5 font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-Header */}
      <nav className="bg-white border-b border-stone-200 px-6 flex items-center space-x-1 sm:space-x-4 overflow-x-auto text-xs font-bold text-stone-600 shadow-sm">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: Package },
          { id: 'payments', label: `UPI Verification Desk (${pendingPayments.length})`, icon: QrCode, badge: pendingPayments.length },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Clock },
          { id: 'stock', label: `Stock Management (${inventoryList.length})`, icon: Boxes },
          { id: 'products', label: `Products (${products.length})`, icon: Layers },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'settings', label: 'Store Settings', icon: Settings },
          { id: 'audit', label: 'Audit Trail', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
              {Boolean(tab.badge) && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-600 text-white font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* ========================================================= */}
        {/* 1. OVERVIEW TAB */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-stone-500">Gross Sales</span>
                <p className="text-2xl font-black text-stone-900">₹{stats?.totalSales || 0}</p>
                <span className="text-[11px] text-emerald-700 font-bold block">
                  UPI: ₹{stats?.upiCollections || 0} • COD: ₹{stats?.codCollections || 0}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-stone-500">Pending UPI Verifications</span>
                <p className="text-2xl font-black text-amber-600">{stats?.pendingVerifications || pendingPayments.length}</p>
                <span className="text-[11px] text-stone-500">Requires manual bank audit</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-stone-500">Total Orders</span>
                <p className="text-2xl font-black text-stone-900">{stats?.totalOrders || orders.length}</p>
                <span className="text-[11px] text-blue-700 font-bold block">
                  Delivered: {stats?.deliveredOrders || 0}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-stone-500">Low Stock Warnings</span>
                <p className="text-2xl font-black text-red-600">{stats?.lowStockCount || inventoryList.filter((i) => i.isLowStock).length}</p>
                <span className="text-[11px] text-stone-500">Items below restock threshold</span>
              </div>
            </div>

            {/* Quick Action: Pending UPI Payments Alert Box */}
            {pendingPayments.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-amber-950">
                      {pendingPayments.length} UPI Payment(s) Awaiting Bank Reference Verification
                    </h3>
                    <p className="text-xs text-amber-800">
                      Customers submitted transaction reference UTRs. Check your bank statement and confirm or reject payments.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition shrink-0"
                >
                  Go to Verification Desk →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. UPI PAYMENT VERIFICATION DESK */}
        {/* ========================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-stone-900">UPI QR Verification Desk</h3>
                <p className="text-xs text-stone-500">
                  Verify the exact amount and UTR reference number against your bank portal before confirming.
                </p>
              </div>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-stone-800">All Submitted Payments Clear</p>
                <p>No customer UPI transactions pending manual verification at this moment.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Payable</th>
                      <th className="py-3 px-4">Submitted UTR</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {pendingPayments.map((p) => {
                      const pId = p.paymentId || p._id || p.id;
                      return (
                      <tr key={pId || p.orderNumber} className="hover:bg-amber-50/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">{p.orderNumber}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-stone-900 block">{p.customerName}</span>
                          <span className="text-[11px] text-stone-500 block">{p.customerEmail}</span>
                        </td>
                        <td className="py-3 px-4 font-black text-emerald-800 text-sm">₹{p.amount}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-1 rounded-lg border border-stone-300">
                            {p.utrNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-500">
                          {p.submittedAt ? new Date(p.submittedAt).toLocaleString('en-IN') : 'Just now'}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleConfirmPayment(pId)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                          >
                            Confirm Payment
                          </button>
                          <button
                            onClick={() => setRejectPaymentId(pId)}
                            className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs transition"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. ORDER MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-stone-900">Order Management & Fulfillment</h3>
                <p className="text-xs text-stone-500">Enforces strict state transitions and courier dispatch tracking.</p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order #, customer..."
                    className="pl-8 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs outline-none focus:border-emerald-600"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-white border border-stone-200 text-xs font-bold outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING_PAYMENT">Pending Payment</option>
                  <option value="PROCESSING_PAYMENT_VERIFICATION">Verifying UPI</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PACKED">Packed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order Number</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Waybill / Tracking</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-900 block">{o.shippingAddress?.fullName}</span>
                        <span className="text-[11px] text-stone-500 block">{o.shippingAddress?.phone}</span>
                      </td>
                      <td className="py-3 px-4 font-black text-stone-900">₹{o.totalPayableAmount}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold block">{o.paymentMethod}</span>
                        <span className="text-[10px] text-stone-500 uppercase">{o.paymentStatus}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 border border-stone-200 text-stone-800">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                        {o.trackingNumber ? (
                          <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-blue-800">
                            {o.courierName}: {o.trackingNumber}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Not Dispatched</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {o.orderStatus === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o._id, 'PACKED')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px]"
                          >
                            Pack Order
                          </button>
                        )}
                        {o.orderStatus === 'PACKED' && (
                          <button
                            onClick={() => setTrackingModalOrder(o)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]"
                          >
                            Dispatch / Ship
                          </button>
                        )}
                        {o.orderStatus === 'SHIPPED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o._id, 'DELIVERED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                          >
                            Mark Delivered
                          </button>
                        )}
                        <button
                          onClick={() => handleViewOrder(o._id)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. STOCK MANAGEMENT (Dedicated Warehouse Tab) */}
        {/* ========================================================= */}
        {activeTab === 'stock' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-stone-900">Warehouse Stock & Inventory Control</h3>
                <p className="text-xs text-stone-500">Live physical stock, reserved units, and restock actions.</p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  placeholder="Search stock by product, SKU..."
                  className="pl-8 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Product Image</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Available Stock</th>
                    <th className="py-3 px-4">Reserved Stock</th>
                    <th className="py-3 px-4">Total Physical</th>
                    <th className="py-3 px-4">Low Stock Alert</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.inventoryId} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-xl border border-stone-200"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">{item.productName}</td>
                      <td className="py-3 px-4 font-mono text-stone-600">{item.sku}</td>
                      <td className="py-3 px-4 capitalize text-stone-600">{item.category}</td>
                      <td className="py-3 px-4 font-black text-stone-900 text-sm">
                        <span className={item.availableStock === 0 ? 'text-red-600' : 'text-emerald-800'}>
                          {item.availableStock}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-500">{item.reservedStock}</td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-800">{item.totalStock}</td>
                      <td className="py-3 px-4">
                        {item.isLowStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-200 flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Adequate
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-400 text-[11px]">
                        {new Date(item.updatedAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAddStock(item)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1 ml-auto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Stock</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. PRODUCT CATALOG MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-stone-900">Product Catalog Management</h3>
                <p className="text-xs text-stone-500">Add, edit, or archive products in the catalog.</p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-800/20 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Pack Size</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((prod) => (
                    <tr key={prod._id || prod.id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={prod.image || prod.primaryImage || '/images/products/placeholder.png'}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-xl border border-stone-200"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block">{prod.name}</span>
                          <span className="text-[11px] text-emerald-800 font-telugu block">{prod.teluguName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize text-stone-600">{prod.category}</td>
                      <td className="py-3 px-4 font-mono text-stone-500">{prod.sku}</td>
                      <td className="py-3 px-4 text-stone-600">{prod.quantity || prod.unit}</td>
                      <td className="py-3 px-4 font-black text-stone-900">₹{prod.price}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.status === 'active' || prod.available
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {prod.status === 'active' || prod.available ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id || prod.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition"
                          title="Archive Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. CUSTOMER MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'customers' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-stone-900">Registered Customer Accounts</h3>
                <p className="text-xs text-stone-500">Live order counts, purchase metrics, and account status.</p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customer name, email..."
                  className="pl-8 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Registration Date</th>
                    <th className="py-3 px-4">Total Orders</th>
                    <th className="py-3 px-4">Total Purchase (₹)</th>
                    <th className="py-3 px-4">Last Order Date</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCustomers.map((c) => (
                    <tr key={c._id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4 font-bold text-stone-900">{c.fullName}</td>
                      <td className="py-3 px-4 text-stone-600">{c.email}</td>
                      <td className="py-3 px-4 font-mono text-stone-700">{c.phone}</td>
                      <td className="py-3 px-4 text-stone-500">
                        {new Date(c.registrationDate || c.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-black text-stone-900">{c.orderCount || 0}</td>
                      <td className="py-3 px-4 font-black text-emerald-800">
                        ₹{c.totalPurchaseAmount !== undefined ? c.totalPurchaseAmount : 0}
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px]">
                        {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString('en-IN') : 'No orders yet'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleCustomer(c._id, c.status)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            c.status === 'active'
                              ? 'bg-red-50 hover:bg-red-100 text-red-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {c.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. STORE SETTINGS */}
        {/* ========================================================= */}
        {activeTab === 'settings' && settings && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 max-w-2xl animate-fadeIn">
            <h3 className="text-lg font-black text-stone-900">Storefront & Payment Configurations</h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900 block">Configured Business UPI Payee</span>
                <p className="font-mono text-emerald-800 font-bold">{settings.businessUpiId}</p>
                <p className="text-stone-500 text-[11px]">Display Payee: {settings.businessDisplayName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900 block">Cash on Delivery (COD) Rules</span>
                <p className="text-stone-700">
                  Status: <strong>{settings.isCodEnabled ? 'Enabled' : 'Disabled'}</strong>
                </p>
                <p className="text-stone-500 text-[11px]">
                  Limits: Min ₹{settings.codMinOrderAmount} • Max ₹{settings.codMaxOrderAmount}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900 block">Delivery Charge Rules</span>
                <p className="text-stone-700">Standard Delivery: ₹{settings.standardDeliveryFee}</p>
                <p className="text-stone-500 text-[11px]">Free Shipping Threshold: Orders above ₹{settings.freeDeliveryThreshold}</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 8. AUDIT TRAIL */}
        {/* ========================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-black text-stone-900">Immutable Security Audit Trail</h3>
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Operator</th>
                    <th className="py-3 px-4">Resource</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log._id}>
                      <td className="py-2.5 px-4 text-stone-500">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-4 font-bold text-stone-900">{log.action}</td>
                      <td className="py-2.5 px-4 text-stone-600">{log.adminEmail || 'System'}</td>
                      <td className="py-2.5 px-4 text-emerald-800">{log.resource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: ORDER DETAILS VIEW (Fixes Bug #4) */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-base text-stone-900">
                    Order {selectedOrder.orderNumber}
                  </h4>
                  <p className="text-xs text-stone-500">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Status Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Order Status</span>
                  <span className="font-bold text-stone-900">{selectedOrder.orderStatus}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Payment Method</span>
                  <span className="font-bold text-emerald-800">{selectedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Payment Status</span>
                  <span className="font-bold text-stone-900">{selectedOrder.paymentStatus}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Total Amount</span>
                  <span className="font-black text-emerald-900 text-sm">₹{selectedOrder.totalPayableAmount}</span>
                </div>
              </div>

              {/* Customer & Delivery Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200 space-y-1.5">
                  <h5 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider text-emerald-800">
                    Customer Information
                  </h5>
                  <p className="font-bold text-stone-900 text-sm">{selectedOrder.customerSnapshot?.fullName || selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-stone-600">Email: {selectedOrder.customerSnapshot?.email || selectedOrder.shippingAddress?.email || 'N/A'}</p>
                  <p className="text-stone-600 font-mono">Phone: {selectedOrder.customerSnapshot?.phone || selectedOrder.shippingAddress?.phone}</p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 space-y-1.5">
                  <h5 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider text-emerald-800">
                    Delivery Address
                  </h5>
                  <p className="text-stone-700 leading-relaxed">
                    {selectedOrder.shippingAddress?.houseStreet}, {selectedOrder.shippingAddress?.areaLocality}
                  </p>
                  <p className="text-stone-700">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - <strong className="font-mono">{selectedOrder.shippingAddress?.pinCode}</strong>
                  </p>
                  {selectedOrder.shippingAddress?.landmark && (
                    <p className="text-stone-500 italic">Landmark: {selectedOrder.shippingAddress.landmark}</p>
                  )}
                </div>
              </div>

              {/* Purchased Products */}
              <div className="space-y-2">
                <h5 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider text-emerald-800">
                  Purchased Items ({selectedOrder.items?.length || 0})
                </h5>
                <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 flex items-center justify-between hover:bg-stone-50">
                      <div>
                        <span className="font-bold text-stone-900 block">{item.name}</span>
                        <span className="text-[11px] font-mono text-stone-500">SKU: {item.sku} • {item.unitPack}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-stone-600 block">₹{item.unitPrice} × {item.quantity}</span>
                        <span className="font-bold text-stone-900 font-mono">
                          ₹{item.lineTotal ?? item.subtotal ?? (item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Bill Summary */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h6 className="font-bold text-stone-900 uppercase text-[10px] tracking-wider text-stone-500">
                    Payment & Bill Summary
                  </h6>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Items Subtotal</span>
                    <span className="font-mono font-bold text-stone-900">
                      ₹{selectedOrder.itemsSubtotal ?? selectedOrder.subtotal ?? (selectedOrder.items?.reduce((sum: number, it: any) => sum + (it.lineTotal ?? it.subtotal ?? (it.unitPrice * it.quantity)), 0) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Delivery Fee</span>
                    <span className="font-mono font-bold text-stone-900">
                      {(selectedOrder.deliveryFee ?? 0) === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}
                    </span>
                  </div>
                  {(selectedOrder.discountAmount ?? 0) > 0 && (
                    <div className="flex justify-between items-center text-emerald-700">
                      <span>Discount</span>
                      <span className="font-mono font-bold">-₹{selectedOrder.discountAmount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-stone-900 font-bold">
                    <span className="text-xs">Final Total Amount</span>
                    <span className="text-base font-black text-emerald-800 font-mono">
                      ₹{selectedOrder.totalPayableAmount ?? selectedOrder.totalAmount ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Verification Information */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <h5 className="font-bold text-emerald-950 uppercase text-[11px] tracking-wider">
                  Payment Verification Records
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-stone-700">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Method</span>
                    <strong className="font-bold">{selectedOrder.paymentMethod}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">UTR Reference</span>
                    <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-stone-300">
                      {selectedOrder.payment?.utrNumber || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Verification Status</span>
                    <span className="font-bold text-emerald-800">{selectedOrder.payment?.status || selectedOrder.paymentStatus}</span>
                  </div>
                </div>

                {selectedOrder.paymentVerification && (
                  <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-stone-600">
                    Verified by Operator: <strong className="text-stone-900">{selectedOrder.paymentVerification.adminId?.fullName || 'Admin'}</strong> on {new Date(selectedOrder.paymentVerification.createdAt).toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              {/* Courier & Tracking Information */}
              <div className="p-4 rounded-2xl border border-stone-200 space-y-2">
                <h5 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider text-emerald-800">
                  Shipping & Consignment Tracking
                </h5>
                {selectedOrder.trackingNumber ? (
                  <div className="flex items-center justify-between text-stone-700">
                    <div>
                      <p>Courier Partner: <strong>{selectedOrder.courierName}</strong></p>
                      <p className="font-mono text-xs text-blue-800 font-bold mt-0.5">
                        Consignment No: {selectedOrder.trackingNumber}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      Dispatched
                    </span>
                  </div>
                ) : (
                  <p className="text-stone-500 italic">No tracking consignment assigned yet.</p>
                )}
              </div>

              {/* Status Change Timeline */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider text-emerald-800">
                    Order Status History Timeline
                  </h5>
                  <div className="border border-stone-200 rounded-2xl p-3 divide-y divide-stone-100 font-mono text-[11px]">
                    {selectedOrder.statusHistory.map((hist: any, i: number) => (
                      <div key={i} className="py-2 flex items-center justify-between">
                        <div>
                          <strong className="text-stone-900">{hist.toStatus}</strong>
                          {hist.comment && <span className="text-stone-500 block">{hist.comment}</span>}
                        </div>
                        <span className="text-stone-400">
                          {new Date(hist.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedOrder.payment?.status === 'SUBMITTED_FOR_VERIFICATION' && (
                  <button
                    onClick={() => handleConfirmPayment(selectedOrder.payment?._id || selectedOrder.payment?.paymentId || selectedOrder._id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verify & Confirm Payment
                  </button>
                )}
                {selectedOrder.orderStatus === 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'PACKED')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                  >
                    Pack Order
                  </button>
                )}
                {selectedOrder.orderStatus === 'PACKED' && (
                  <button
                    onClick={() => {
                      setTrackingModalOrder(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Dispatch / Add Tracking
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT PRODUCT (Fixes Bug #2) */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
          >
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h4 className="font-bold text-base text-stone-900">
                {editingProductId ? 'Edit Product Catalog Item' : 'Add New Organic Product'}
              </h4>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Navara Red Rice"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Telugu Display Name</label>
                  <input
                    type="text"
                    value={productForm.teluguName}
                    onChange={(e) => setProductForm({ ...productForm, teluguName: e.target.value })}
                    placeholder="e.g. నవార ఎర్ర బియ్యం"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none focus:border-emerald-600 font-telugu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none focus:border-emerald-600 capitalize font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="120"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none focus:border-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discounted Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.discountedPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountedPrice: e.target.value })}
                    placeholder="Optional"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU Identifier *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none focus:border-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Pack Size / Unit</label>
                  <input
                    type="text"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                    placeholder="e.g. 1 kg or 500 ml"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Image URL / Cloudinary Asset *</label>
                <input
                  type="url"
                  required
                  value={productForm.primaryImage}
                  onChange={(e) => setProductForm({ ...productForm, primaryImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-[11px] outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Traditional heirloom grain cultivated with cow dung manure..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Ingredients</label>
                  <input
                    type="text"
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                    placeholder="e.g. 100% Whole Grain Red Rice"
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Certification Details</label>
                  <input
                    type="text"
                    value={productForm.certificationDetails}
                    onChange={(e) => setProductForm({ ...productForm, certificationDetails: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.status === 'active'}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.checked ? 'active' : 'inactive' })}
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="font-bold text-stone-800">Active (Visible on public store)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="font-bold text-stone-800">Featured Highlight</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
              >
                {editingProductId ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD STOCK MODAL (Fixes Bug #3) */}
      {/* ========================================================= */}
      {isAddStockModalOpen && targetStockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleConfirmAddStock}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="font-bold text-base text-stone-900">
                Inward Stock Addition
              </h4>
              <button
                type="button"
                onClick={() => setIsAddStockModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] text-stone-500 font-mono">SKU: {targetStockItem.sku}</span>
                <p className="font-bold text-stone-900 text-sm">{targetStockItem.productName}</p>
                <p className="text-stone-600">
                  Current Available Stock: <strong className="text-emerald-800 font-bold">{targetStockItem.availableStock} units</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Units Being Added *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={unitsToAdd}
                  onChange={(e) => setUnitsToAdd(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-sm outline-none focus:border-emerald-600"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  New Available Stock will become: <strong className="text-emerald-800">{targetStockItem.availableStock + Number(unitsToAdd || 0)} units</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Purchase / Inward Reference Note</label>
                <input
                  type="text"
                  value={stockReferenceNote}
                  onChange={(e) => setStockReferenceNote(e.target.value)}
                  placeholder="e.g. Batch #2026-FARM-NOV"
                  className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsAddStockModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingStock}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
              >
                {isSubmittingStock ? 'Updating Stock...' : 'Confirm Stock Addition'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: REJECT PAYMENT */}
      {/* ========================================================= */}
      {rejectPaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h4 className="font-bold text-base text-red-900">Reject Payment Submission</h4>
            <p className="text-xs text-stone-600">Please provide a clear reason for the customer (e.g. UTR not found on bank statement).</p>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. UTR reference not credited to GVKSS bank account."
              className="w-full p-3 rounded-xl border border-stone-300 text-xs sm:text-sm outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectPaymentId(null)}
                className="px-4 py-2 rounded-xl text-stone-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectPayment}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Reject Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: DISPATCH & TRACKING */}
      {/* ========================================================= */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleSaveTracking} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h4 className="font-bold text-base text-stone-900">Add Courier Tracking for {trackingModalOrder.orderNumber}</h4>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Courier Partner</label>
              <input
                type="text"
                required
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tracking Consignment Number / Waybill</label>
              <input
                type="text"
                required
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. DEL-HYD-998811"
                className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-xs sm:text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="px-4 py-2 rounded-xl text-stone-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Mark Shipped
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
