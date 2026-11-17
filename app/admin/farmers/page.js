'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import Badge from '@/components/admin/Badge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function AdminFarmersPage() {
  const { farmers, approveFarmer, rejectFarmer, toggleSuspendFarmer } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedFarmerDetails, setSelectedFarmerDetails] = useState(null);
  const [actionDialog, setActionDialog] = useState(null); // { type: 'reject'|'suspend'|'approve', farmer }
  const [actionReason, setActionReason] = useState('');

  const filteredFarmers = useMemo(() => {
    return farmers.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.farmName.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [farmers, searchQuery, statusFilter]);

  const handleExecuteAction = () => {
    if (!actionDialog) return;
    const { type, farmer } = actionDialog;

    if (type === 'approve') {
      approveFarmer(farmer.id);
    } else if (type === 'reject') {
      rejectFarmer(farmer.id, actionReason || 'Verification failed');
    } else if (type === 'suspend') {
      toggleSuspendFarmer(farmer.id, actionReason || 'Compliance suspension');
    }

    setActionDialog(null);
    setActionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Farmer & Producer Oversight
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Verify agricultural licenses, manage farmer store approvals, review compliance and suspend violators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/approvals"
            className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1.5 rounded-xl border border-amber-200 hover:bg-amber-100 transition flex items-center gap-1.5"
          >
            <span>⏳</span>
            <span>
              {farmers.filter((f) => f.status === 'Pending').length} Pending Verifications
            </span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by farmer name, farm, region, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-gray-400 font-medium mr-1">Status:</span>
          {['All', 'Approved', 'Pending', 'Suspended'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-green-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Farmers Grid / Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Producer / Farm</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Verification Credentials</th>
                <th className="py-3 px-4">Catalog</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No farmers found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-green-50 border border-green-100 text-2xl flex items-center justify-center flex-shrink-0 select-none">
                          {f.emoji || '👨‍🌾'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{f.name}</p>
                          <p className="text-xs text-green-700 font-semibold">{f.farmName}</p>
                          <p className="text-[10px] text-gray-400">{f.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      <p className="font-medium">📍 {f.location}</p>
                      <p className="text-[10px] text-gray-400">{f.phone}</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="flex items-center gap-1.5 mb-1">
                        {f.verified ? (
                          <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                            ✓ Verified APEDA/FSSAI
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                            ⚠️ Awaiting Audit
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1" title={f.verificationDocs}>
                        {f.verificationDocs}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-gray-800">
                      <Link
                        href={`/admin/products`}
                        className="hover:underline text-green-700 font-semibold"
                      >
                        {f.totalProducts} items
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-green-800">
                      ₹{f.totalRevenue ? f.totalRevenue.toLocaleString() : '0'}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={f.status} />
                      {f.suspensionReason && (
                        <p className="text-[10px] text-rose-600 mt-1 line-clamp-1" title={f.suspensionReason}>
                          {f.suspensionReason}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {f.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => approveFarmer(f.id)}
                              className="px-2.5 py-1 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setActionDialog({ type: 'reject', farmer: f })}
                              className="px-2 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setSelectedFarmerDetails(f)}
                              className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                            >
                              Audit
                            </button>
                            <button
                              onClick={() => setActionDialog({ type: 'suspend', farmer: f })}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                                f.status === 'Approved'
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {f.status === 'Approved' ? 'Suspend' : 'Reactivate'}
                            </button>
                          </>
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

      {/* Farmer Audit Details Modal */}
      {selectedFarmerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedFarmerDetails(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selectedFarmerDetails.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedFarmerDetails.name}
                </h3>
                <p className="text-xs text-green-700 font-semibold">
                  {selectedFarmerDetails.farmName} · {selectedFarmerDetails.location}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-600 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p><strong>Producer ID:</strong> {selectedFarmerDetails.id}</p>
              <p><strong>Official Email:</strong> {selectedFarmerDetails.email}</p>
              <p><strong>Contact Phone:</strong> {selectedFarmerDetails.phone}</p>
              <p><strong>Verification Documents:</strong> {selectedFarmerDetails.verificationDocs}</p>
              <p><strong>Platform Status:</strong> <Badge status={selectedFarmerDetails.status} /></p>
              <p><strong>Lifetime Farm Payouts:</strong> ₹{selectedFarmerDetails.totalRevenue.toLocaleString()}</p>
              <p><strong>Rating:</strong> ★ {selectedFarmerDetails.rating} / 5.0</p>
            </div>

            <div className="flex justify-end gap-2">
              <Link
                href={`/farmers/${selectedFarmerDetails.id}`}
                target="_blank"
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                View Public Storefront Page ↗
              </Link>
              <button
                type="button"
                onClick={() => setSelectedFarmerDetails(null)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(actionDialog)}
        title={
          actionDialog?.type === 'reject'
            ? `Reject Farmer Application: ${actionDialog?.farmer?.name}?`
            : actionDialog?.farmer?.status === 'Approved'
            ? `Suspend Farmer Account: ${actionDialog?.farmer?.name}?`
            : `Reactivate Farmer Account: ${actionDialog?.farmer?.name}?`
        }
        message={
          actionDialog?.type === 'reject'
            ? 'Rejecting this producer application will notify the applicant and keep their record marked as Rejected in compliance logs.'
            : actionDialog?.farmer?.status === 'Approved'
            ? 'Suspending this producer will immediately pause all their active produce listings from appearing in the customer marketplace.'
            : 'Reactivating this producer will restore their product catalog visibility in the marketplace.'
        }
        confirmLabel={
          actionDialog?.type === 'reject'
            ? 'Confirm Rejection'
            : actionDialog?.farmer?.status === 'Approved'
            ? 'Confirm Suspension'
            : 'Reactivate Account'
        }
        confirmVariant={actionDialog?.type === 'reject' || actionDialog?.farmer?.status === 'Approved' ? 'danger' : 'primary'}
        onConfirm={handleExecuteAction}
        onCancel={() => setActionDialog(null)}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Reason / Audit Notes
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Expired land documentation, pesticide audit flag"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
