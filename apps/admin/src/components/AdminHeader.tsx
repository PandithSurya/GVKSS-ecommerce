import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  Settings,
  ShieldAlert,
  RotateCw,
  LogOut,
  Sparkles,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'payments'
  | 'orders'
  | 'products'
  | 'inventory'
  | 'customers'
  | 'settings'
  | 'audit';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminUser: any;
  pendingPaymentsCount: number;
  lowStockCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onTabChange,
  adminUser,
  pendingPaymentsCount,
  lowStockCount,
  onRefresh,
  isRefreshing,
  onLogout,
}) => {
  const tabs = [
    {
      id: 'overview' as AdminTab,
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'payments' as AdminTab,
      label: 'Payment Desk',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders',
      icon: ShoppingBag,
    },
    {
      id: 'products' as AdminTab,
      label: 'Products',
      icon: Package,
    },
    {
      id: 'inventory' as AdminTab,
      label: 'Stock & Inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'customers' as AdminTab,
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Settings',
      icon: Settings,
    },
    {
      id: 'audit' as AdminTab,
      label: 'Audit Trail',
      icon: ShieldAlert,
    },
  ];

  return (
    <header className="glass-header sticky top-0 z-30">
      {/* Top tier brand and session bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-stone-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-stone-900">GVKSS</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Operations, Verification & Centralized Logistics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh live data"
              className="p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-stone-900">{adminUser?.name || 'Administrator'}</p>
                <p className="text-[10px] text-stone-500 tracking-wide font-mono">
                  {adminUser?.roleName || 'SUPER_ADMIN'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {(adminUser?.name || 'A').charAt(0)}
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={onLogout}
              className="ml-2 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-red-700 hover:bg-red-50 rounded-lg border border-stone-300 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation tabs row */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-800/20'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      tab.badgeColor || 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
