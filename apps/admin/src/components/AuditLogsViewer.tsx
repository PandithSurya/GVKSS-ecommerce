import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Clock,
  User,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { formatDate } from '@organic-store/shared-utils';

interface AuditLogsViewerProps {
  logs: any[];
  onRefreshLogs: () => void;
}

export const AuditLogsViewer: React.FC<AuditLogsViewerProps> = ({
  logs,
  onRefreshLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) => {
    const action = (log.action || '').toLowerCase();
    const admin = (log.adminEmail || log.performedBy || '').toLowerCase();
    const ip = (log.ipAddress || '').toLowerCase();
    const target = (log.targetEntity || log.entityId || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    return action.includes(q) || admin.includes(q) || ip.includes(q) || target.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 font-serif">Security Audit & Activity Trail</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Immutable log of staff logins, payment verifications, status modifications, and inventory adjustments.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200/60 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Staff / Admin</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Details / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No security audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => {
                  const action = log.action || 'EVENT';
                  const isPayment = action.includes('PAYMENT');
                  const isAuth = action.includes('LOGIN') || action.includes('AUTH');
                  const isInventory = action.includes('STOCK') || action.includes('INVENTORY');

                  return (
                    <tr key={log._id || log.id || idx} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4 text-stone-500 font-mono">
                        {formatDate(log.createdAt || log.timestamp)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider font-mono border ${
                            isPayment
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : isAuth
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : isInventory
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          {action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-stone-800">{log.adminEmail || log.performedBy || 'System'}</p>
                        {log.role && (
                          <p className="text-[10px] text-stone-400 font-mono">{log.role}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-600">
                        {log.targetEntity || log.entityId || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 text-[11px] max-w-xs truncate">
                        {log.details || JSON.stringify(log.metadata || {})}
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
