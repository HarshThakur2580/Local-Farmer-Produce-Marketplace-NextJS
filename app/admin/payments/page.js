'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import Badge from '@/components/admin/Badge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatCard from '@/components/admin/StatCard';

export default function AdminPaymentsPage() {
  const { payments, totalRevenue, platformEarnings, processRefund, releaseFarmerPayout, holdFarmerPayout } = useAdmin();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'payouts' | 'refunds'
  const [searchQuery, setSearchQuery] = useState('');
  const [refundDialogPayment, setRefundDialogPayment] = useState(null);
  const [holdDialogPayment, setHoldDialogPayment] = useState(null);
  const [holdReason, setHoldReason] = useState('Quality dispute verification pending');

  const pendingPayoutsTotal = useMemo(() => {
    return payments
      .filter((p) => p.payoutStatus === 'Scheduled' || p.payoutStatus === 'On Hold')
      .reduce((sum, p) => sum + p.netPayout, 0);
  }, [payments]);

  const totalRefunded = useMemo(() => {
    return payments
      .filter((p) => p.status === 'Refunded')
      .reduce((sum, p) => sum + p.grossAmount, 0);
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q);

      let matchesTab = true;
      if (activeTab === 'payouts') matchesTab = p.status === 'Completed';
      if (activeTab === 'refunds') matchesTab = p.status === 'Refunded';

      return matchesSearch && matchesTab;
    });
  }, [payments, searchQuery, activeTab]);

  const handleConfirmRefund = () => {
    if (refundDialogPayment) {
      processRefund(refundDialogPayment.id);
      setRefundDialogPayment(null);
    }
  };

  const handleConfirmHold = () => {
    if (holdDialogPayment) {
      holdFarmerPayout(holdDialogPayment.id, holdReason);
      setHoldDialogPayment(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Financial Ledger & Farmer Payouts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Reconcile agricultural transactions, disburse producer earnings, manage platform commissions and issue refunds.
          </p>
        </div>

        <button
          onClick={() => alert('Financial reconciliation report (CSV) exported.')}
          className="self-start sm:self-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
        >
          <span>📥</span> Export Ledger (CSV)
        </button>
      </div>

      {/* Financial Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Sales"
          value={`₹${totalRevenue.toFixed(2)}`}
          icon="💰"
          change="+28%"
          changeType="positive"
          subtitle="processed volume"
        />
        <StatCard
          title="Platform Fees (10%)"
          value={`₹${platformEarnings.toFixed(2)}`}
          icon="🏦"
          change="+10%"
          changeType="positive"
          subtitle="marketplace revenue"
        />
        <StatCard
          title="Pending Payouts"
          value={`₹${pendingPayoutsTotal.toFixed(2)}`}
          icon="⏳"
          changeType="neutral"
          subtitle="scheduled disbursements"
        />
        <StatCard
          title="Refund Records"
          value={`₹${totalRefunded.toFixed(2)}`}
          icon="↩️"
          changeType="negative"
          subtitle="dispute resolutions"
        />
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by Transaction ID, Order ID, buyer or farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'payouts', label: 'Farmer Disbursements' },
            { id: 'refunds', label: 'Refund Records' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Consumer</th>
                <th className="py-3 px-4">Producer (Beneficiary)</th>
                <th className="py-3 px-4">Gross Sale</th>
                <th className="py-3 px-4">Platform Fee</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payout Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    No transactions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{p.id}</td>

                    <td className="py-3 px-4 font-mono text-green-700 font-semibold">{p.orderId}</td>

                    <td className="py-3 px-4 font-medium">{p.customerName}</td>

                    <td className="py-3 px-4 font-bold text-gray-800">{p.farmerName}</td>

                    <td className="py-3 px-4 font-bold text-gray-900">₹{p.grossAmount.toFixed(2)}</td>

                    <td className="py-3 px-4 text-emerald-700 font-semibold">
                      ₹{p.platformFee.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 font-extrabold text-green-700">
                      ₹{p.netPayout.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <Badge status={p.status} />
                    </td>

                    <td className="py-3 px-4">
                      <Badge status={p.payoutStatus} />
                      {p.holdReason && (
                        <p className="text-[10px] text-purple-700 mt-0.5 line-clamp-1" title={p.holdReason}>
                          {p.holdReason}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {p.status === 'Completed' && p.payoutStatus !== 'Paid' && (
                          <button
                            onClick={() => releaseFarmerPayout(p.id)}
                            className="px-2.5 py-1 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                          >
                            Release Payout
                          </button>
                        )}

                        {p.status === 'Completed' && p.payoutStatus === 'Scheduled' && (
                          <button
                            onClick={() => setHoldDialogPayment(p)}
                            className="px-2 py-1 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition"
                          >
                            Hold
                          </button>
                        )}

                        {p.status === 'Completed' && (
                          <button
                            onClick={() => setRefundDialogPayment(p)}
                            className="px-2 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Refund Dialog */}
      <ConfirmDialog
        isOpen={Boolean(refundDialogPayment)}
        title={`Process Refund of ₹${refundDialogPayment?.grossAmount.toFixed(2)}?`}
        message={`Are you sure you want to issue a full refund to ${refundDialogPayment?.customerName} for order ${refundDialogPayment?.orderId}? This will cancel the associated farmer payout to ${refundDialogPayment?.farmerName}.`}
        confirmLabel="Confirm Full Refund"
        confirmVariant="danger"
        onConfirm={handleConfirmRefund}
        onCancel={() => setRefundDialogPayment(null)}
      />

      {/* Hold Payout Dialog */}
      <ConfirmDialog
        isOpen={Boolean(holdDialogPayment)}
        title={`Hold Farmer Payout for ${holdDialogPayment?.farmerName}?`}
        message="Placing a temporary hold will pause the automated bank transfer until audit release."
        confirmLabel="Confirm Payout Hold"
        confirmVariant="warning"
        onConfirm={handleConfirmHold}
        onCancel={() => setHoldDialogPayment(null)}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Reason for Hold
          </label>
          <input
            type="text"
            required
            value={holdReason}
            onChange={(e) => setHoldReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
