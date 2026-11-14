import React, { useState, useEffect } from 'react';
import {
  Settings,
  CreditCard,
  QrCode,
  Truck,
  Building,
  Save,
  Loader2,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react';
import { formatINR } from '@organic-store/shared-utils';
import { adminApi } from '../services/adminApi';

interface StoreSettingsManagerProps {
  settings: any;
  onRefreshSettings: () => void;
  showToast: (msg: string) => void;
}

export const StoreSettingsManager: React.FC<StoreSettingsManagerProps> = ({
  settings,
  onRefreshSettings,
  showToast,
}) => {
  const [form, setForm] = useState({
    storeName: 'GVKSS Organic Products',
    supportEmail: 'contact@gvkss.org',
    supportPhone: '+91 94943 00473',
    upiId: '9494300473@okbizaxis',
    payeeName: 'GVKSS Organics Producer Co',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9494300473@okbizaxis&pn=GVKSS%20Organics&cu=INR',
    codEnabled: true,
    codExtraCharge: 0,
    deliveryFee: 50,
    freeShippingThreshold: 999,
    deliveryPincodes: '500001, 500002, 500034, 500081, 500082, 500084, 500032',
    taxPercentage: 0,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        storeName: settings.storeName || 'GVKSS Organic Products',
        supportEmail: settings.supportEmail || 'contact@gvkss.org',
        supportPhone: settings.supportPhone || '+91 94943 00473',
        upiId: settings.upiId || settings.payment?.upiId || '9494300473@okbizaxis',
        payeeName: settings.payeeName || settings.payment?.payeeName || 'GVKSS Organics Producer Co',
        qrCodeUrl:
          settings.qrCodeUrl ||
          settings.payment?.qrCodeUrl ||
          'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9494300473@okbizaxis&pn=GVKSS%20Organics&cu=INR',
        codEnabled: settings.codEnabled ?? settings.payment?.codEnabled ?? true,
        codExtraCharge: settings.codExtraCharge ?? settings.payment?.codExtraCharge ?? 0,
        deliveryFee: settings.deliveryFee ?? settings.shipping?.defaultFee ?? 50,
        freeShippingThreshold: settings.freeShippingThreshold ?? settings.shipping?.freeThreshold ?? 999,
        deliveryPincodes: Array.isArray(settings.deliveryPincodes)
          ? settings.deliveryPincodes.join(', ')
          : settings.deliveryPincodes || '500001, 500002, 500034, 500081, 500082, 500084, 500032',
        taxPercentage: settings.taxPercentage ?? 0,
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        storeName: form.storeName,
        supportEmail: form.supportEmail,
        supportPhone: form.supportPhone,
        upiId: form.upiId,
        payeeName: form.payeeName,
        qrCodeUrl: form.qrCodeUrl,
        codEnabled: form.codEnabled,
        codExtraCharge: Number(form.codExtraCharge),
        deliveryFee: Number(form.deliveryFee),
        freeShippingThreshold: Number(form.freeShippingThreshold),
        deliveryPincodes: form.deliveryPincodes
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
        taxPercentage: Number(form.taxPercentage),
      };

      await adminApi.updateSettings(payload);
      showToast('Store & payment parameters updated successfully.');
      onRefreshSettings();
    } catch (err: any) {
      alert(err?.message || 'Failed to update store settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-serif">Store Configuration & Logistics</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure merchant UPI credentials, free shipping limits, COD eligibility, and contact details.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 self-start md:self-auto"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UPI Payment Gateway Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">UPI Merchant & QR Configuration</h3>
              <p className="text-[11px] text-stone-500">Rendered on customer checkout page for manual payments</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Merchant UPI ID (VPA) *
              </label>
              <input
                type="text"
                required
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                placeholder="e.g. gvkss@okaxis"
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Official Payee Name *
              </label>
              <input
                type="text"
                required
                value={form.payeeName}
                onChange={(e) => setForm({ ...form, payeeName: e.target.value })}
                placeholder="e.g. GVKSS Organics Producer Co."
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                UPI QR Code Image URL
              </label>
              <input
                type="text"
                value={form.qrCodeUrl}
                onChange={(e) => setForm({ ...form, qrCodeUrl: e.target.value })}
                placeholder="https://..."
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* QR Code Live Preview */}
            <div className="pt-2 flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <img
                src={form.qrCodeUrl}
                alt="UPI QR Code"
                className="w-20 h-20 rounded-lg bg-white p-1 border border-stone-200 object-contain shrink-0"
              />
              <div className="text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-stone-900">Checkout Preview</p>
                <p className="text-[11px] font-mono text-emerald-700">{form.upiId}</p>
                <p className="text-[11px] text-stone-500">{form.payeeName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping, Delivery & COD Settings */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Shipping, Logistics & COD Rules</h3>
              <p className="text-[11px] text-stone-500">Thresholds applied dynamically at checkout calculation</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Standard Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.deliveryFee}
                  onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Free Shipping Over (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.freeShippingThreshold}
                  onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={form.codEnabled}
                  onChange={(e) => setForm({ ...form, codEnabled: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Enable Cash on Delivery (COD) Option</span>
              </label>

              {form.codEnabled && (
                <div className="pl-6 pt-1">
                  <label className="block text-[11px] text-stone-500 mb-1">
                    Additional COD Handling Fee (₹, optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.codExtraCharge}
                    onChange={(e) => setForm({ ...form, codExtraCharge: Number(e.target.value) })}
                    className="w-32 p-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Serviced Delivery PIN Codes (comma separated)
              </label>
              <textarea
                rows={2}
                value={form.deliveryPincodes}
                onChange={(e) => setForm({ ...form, deliveryPincodes: e.target.value })}
                placeholder="500001, 500002, 500034..."
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Store Business Profile */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Store Business Profile & Customer Support</h3>
              <p className="text-[11px] text-stone-500">Contact details shown on order receipts and customer invoices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Store Business Title
              </label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Support Helpline / WhatsApp
              </label>
              <input
                type="text"
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
