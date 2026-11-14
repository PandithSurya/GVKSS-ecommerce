import React, { useState, useEffect, useCallback } from 'react';
import { adminApi, setAdminAccessToken } from './services/adminApi';
import { AdminLogin } from './components/AdminLogin';
import { AdminHeader, AdminTab } from './components/AdminHeader';
import { DashboardOverview } from './components/DashboardOverview';
import { PaymentsDesk } from './components/PaymentsDesk';
import { OrdersManager } from './components/OrdersManager';
import { ProductsManager } from './components/ProductsManager';
import { InventoryManager } from './components/InventoryManager';
import { CustomersManager } from './components/CustomersManager';
import { StoreSettingsManager } from './components/StoreSettingsManager';
import { AuditLogsViewer } from './components/AuditLogsViewer';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Application Data State
  const [stats, setStats] = useState<any>(null);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // UI state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore Admin Session on Mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await adminApi.getSession();
        if (res?.data?.admin) {
          setAdminUser(res.data.admin);
          setIsAdminLoggedIn(true);
        }
      } catch {
        // No active session, stay on login
      } finally {
        setIsInitializing(false);
      }
    };
    restoreSession();
  }, []);

  // Fetch Dashboard & Entity Datasets
  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        statsRes,
        pendingRes,
        ordersRes,
        productsRes,
        inventoryRes,
        customersRes,
        settingsRes,
        auditRes,
      ] = await Promise.allSettled([
        adminApi.getDashboardStats(),
        adminApi.getPendingPayments(),
        adminApi.getOrders({ limit: 100 }),
        adminApi.getProducts(),
        adminApi.getInventory(),
        adminApi.getCustomers(),
        adminApi.getSettings(),
        adminApi.getAuditLogs(1),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (pendingRes.status === 'fulfilled' && pendingRes.value?.data) {
        setPendingPayments(pendingRes.value.data);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
        setOrders(ordersRes.value.data?.orders || ordersRes.value.data || []);
      }
      if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
        setProducts(productsRes.value.data?.products || productsRes.value.data || []);
      }
      if (inventoryRes.status === 'fulfilled' && inventoryRes.value?.data) {
        setInventory(inventoryRes.value.data?.inventory || inventoryRes.value.data || []);
      }
      if (customersRes.status === 'fulfilled' && customersRes.value?.data) {
        setCustomers(customersRes.value.data?.customers || customersRes.value.data || []);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data) {
        setSettings(settingsRes.value.data);
      }
      if (auditRes.status === 'fulfilled' && auditRes.value?.data) {
        setAuditLogs(auditRes.value.data?.logs || auditRes.value.data || []);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAllData();
    }
  }, [isAdminLoggedIn, loadAllData]);

  const handleLoginSuccess = (admin: any) => {
    setAdminUser(admin);
    setIsAdminLoggedIn(true);
    showToast(`Welcome back, ${admin.name || 'Administrator'}`);
  };

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      setAdminAccessToken(null);
      setAdminUser(null);
      setIsAdminLoggedIn(false);
      setActiveTab('overview');
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-stone-300">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
        <p className="text-xs font-mono tracking-wider uppercase text-stone-400">
          Initializing Admin Environment...
        </p>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const lowStockCount = inventory.filter((item) => {
    const p = item.product || item;
    const stock = item.stockQuantity ?? p.stockQuantity ?? p.stock ?? 0;
    const min = item.minThreshold ?? p.minThreshold ?? 10;
    return stock > 0 && stock <= min;
  }).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header & Navigation */}
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        adminUser={adminUser}
        pendingPaymentsCount={pendingPayments.length}
        lowStockCount={lowStockCount}
        onRefresh={loadAllData}
        isRefreshing={isRefreshing}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            stats={stats}
            pendingPaymentsCount={pendingPayments.length}
            lowStockCount={lowStockCount}
            recentOrders={orders}
            onNavigateToPayments={() => setActiveTab('payments')}
            onNavigateToStock={() => setActiveTab('inventory')}
            onViewOrder={(order) => {
              setSelectedOrder(order);
              setActiveTab('orders');
            }}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsDesk
            pendingPayments={pendingPayments}
            onPaymentUpdated={loadAllData}
            showToast={showToast}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersManager
            orders={orders}
            selectedOrder={selectedOrder}
            onSelectOrder={setSelectedOrder}
            onRefreshOrders={loadAllData}
            showToast={showToast}
          />
        )}

        {activeTab === 'products' && (
          <ProductsManager
            products={products}
            onRefreshProducts={loadAllData}
            showToast={showToast}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager
            inventory={inventory}
            onRefreshInventory={loadAllData}
            showToast={showToast}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersManager
            customers={customers}
            onRefreshCustomers={loadAllData}
            showToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <StoreSettingsManager
            settings={settings}
            onRefreshSettings={loadAllData}
            showToast={showToast}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogsViewer logs={auditLogs} onRefreshLogs={loadAllData} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© 2026 GVKSS Organics. Centralized Operations Console.</p>
          <p className="font-mono text-stone-400">
            Node.js/Express Central Backend • Port 5000 • MongoDB Atlas
          </p>
        </div>
      </footer>
    </div>
  );
};
