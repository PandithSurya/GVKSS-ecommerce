import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { formatINR, formatDate, isValidUTR } from '@organic-store/shared-utils';
import { adminApi } from '../services/adminApi';

interface PaymentsDeskProps {
  pendingPayments: any[];
  onPaymentUpdated: () => void;
  showToast: (msg: string) => void;
}

export const PaymentsDesk: React.FC<PaymentsDeskProps> = ({
  pendingPayments,
  onPaymentUpdated,
  showToast,
}) => {
  const [rejectModalPayment, setRejectModalPayment] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('UTR not found on merchant bank statement');
  const [customReason, setCustomReason] = useState('');
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleConfirmPayment = async (payment: any) => {
    const paymentId = payment._id || payment.id;
    if (!paymentId) return;

    const confirmed = window.confirm(
      `Confirm receipt of ${formatINR(payment.amount || payment.order?.totalAmount)} for Order #${payment.order?.orderNumber || payment.orderNumber}? Ensure funds reflect in your account before confirming.`
    );
    if (!confirmed) return;

    setIsProcessingId(paymentId);
    try {
      await adminApi.confirmPayment(paymentId, 'Verified against merchant bank statement by administrator');
      showToast(`Payment for Order #${payment.order?.orderNumber || payment.orderNumber} confirmed successfully.`);
      onPaymentUpdated();
    } catch (err: any) {
      alert(err?.message || 'Failed to confirm payment');
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectModalPayment) return;
    const paymentId = rejectModalPayment._id || rejectModalPayment.id;
    const reason = rejectionReason === 'Other' ? customReason : rejectionReason;

    if (!reason || !reason.trim()) {
      alert('Please provide a reason for rejecting this payment.');
      return;
    }

    setIsProcessingId(paymentId);
    try {
      await adminApi.rejectPayment(paymentId, reason);
      showToast('Payment rejected. Customer will be notified to re-submit or contact support.');
      setRejectModalPayment(null);
      setCustomReason('');
      onPaymentUpdated();
    } catch (err: any) {
      alert(err?.message || 'Failed to reject payment');
    } finally {
      setIsProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Instructions Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">UPI Payment Verification Desk</h2>
            </div>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl">
              Manual dual-check workflow. Cross-reference the 12-digit UTR with your merchant bank statement/soundbox. Only confirm after credit is physically verified.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
              {pendingPayments.length} Pending Audit
            </span>
          </div>
        </div>
      </div>

      {/* Pending Payments Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200/60 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Submitted UTR / Ref</th>
                <th className="py-3.5 px-4">Submission Time</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-semibold text-stone-700">Verification Desk Clear</p>
                    <p className="text-xs text-stone-400 mt-0.5">All customer UPI payments have been verified.</p>
                  </td>
                </tr>
              ) : (
                pendingPayments.map((payment) => {
                  const paymentId = payment._id || payment.id;
                  const order = payment.order || {};
                  const orderNumber = order.orderNumber || payment.orderNumber || 'N/A';
                  const customerName = order.customerName || payment.customerName || 'Customer';
                  const customerPhone = order.phone || payment.customerPhone || 'N/A';
                  const utr = payment.utrNumber || payment.utr || 'Pending';
                  const amount = payment.amount || order.totalAmount || 0;
                  const isProcessing = isProcessingId === paymentId;
                  const utrValid = isValidUTR(utr);

                  return (
                    <tr key={paymentId} className="hover:bg-amber-50/40 transition">
                      <td className="py-4 px-4 font-mono font-medium text-stone-900">
                        {orderNumber}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-stone-800">{customerName}</p>
                        <p className="text-[11px] text-stone-500 font-mono">{customerPhone}</p>
                      </td>
                      <td className="py-4 px-4 font-bold text-sm text-stone-900 font-serif">
                        {formatINR(amount)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${
                            utrValid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-700'
                          }`}>
                            {utr}
                          </span>
                          <button
                            onClick={() => handleCopyUtr(utr)}
                            title="Copy UTR"
                            className="p-1 text-stone-400 hover:text-stone-700 rounded transition"
                          >
                            {copiedUtr === utr ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-stone-500">
                        {formatDate(payment.createdAt || payment.submittedAt)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                          <Clock className="w-3 h-3" />
                          Pending Audit
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleConfirmPayment(payment)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs shadow-sm transition disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Confirm Credit
                          </button>
                          <button
                            onClick={() => setRejectModalPayment(payment)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 rounded-lg font-medium text-xs transition border border-stone-200"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
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

      {/* Reject Payment Modal */}
      {rejectModalPayment && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Reject UPI Payment</h3>
                <p className="text-xs text-stone-500 font-mono">
                  Order #{rejectModalPayment.order?.orderNumber || rejectModalPayment.orderNumber}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-4">
              Please select or enter the specific reason for rejecting this payment submission. This reason will be recorded in the audit trail and visible to the customer.
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-semibold text-stone-700">Reason</label>
              {[
                'UTR not found on merchant bank statement',
                'Amount received does not match order total',
                'Duplicate UTR already claimed in another order',
                'Transaction failed or reversed at bank',
                'Other',
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="rejectionReason"
                    checked={rejectionReason === reason}
                    onChange={() => setRejectionReason(reason)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {rejectionReason === 'Other' && (
                <textarea
                  rows={3}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Explain why this payment cannot be confirmed..."
                  className="w-full mt-2 p-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectModalPayment(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayment}
                disabled={isProcessingId !== null}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {isProcessingId ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
