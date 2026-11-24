'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import Badge from '@/components/admin/Badge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function AdminApprovalsPage() {
  const { farmers, products, approveFarmer, rejectFarmer, approveProduct, rejectProduct } = useAdmin();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'farmers' | 'products'
  const [rejectDialog, setRejectDialog] = useState(null); // { type: 'farmer'|'product', item }
  const [rejectReason, setRejectReason] = useState('');

  const pendingFarmers = farmers.filter((f) => f.status === 'Pending');
  const pendingProducts = products.filter((p) => p.status === 'Pending');

  const totalPending = pendingFarmers.length + pendingProducts.length;

  const handleConfirmReject = () => {
    if (!rejectDialog) return;
    if (rejectDialog.type === 'farmer') {
      rejectFarmer(rejectDialog.item.id, rejectReason || 'Documentation audit incomplete');
    } else {
      rejectProduct(rejectDialog.item.id, rejectReason || 'Quality standards not met');
    }
    setRejectDialog(null);
    setRejectReason('');
  };

  const handleApproveAll = () => {
    if (confirm(`Approve all ${totalPending} pending items currently in the queue?`)) {
      pendingFarmers.forEach((f) => approveFarmer(f.id));
      pendingProducts.forEach((p) => approveProduct(p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⏳</span>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Approvals & Quality Verification Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Audit newly submitted farmer producer accounts and seasonal agricultural listings before customer release.
          </p>
        </div>

        {totalPending > 0 && (
          <button
            onClick={handleApproveAll}
            className="self-start sm:self-auto bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <span>✓</span> Approve All ({totalPending})
          </button>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'all', label: 'All Pending Items', count: totalPending },
          { id: 'farmers', label: 'Farmer Applications', count: pendingFarmers.length },
          { id: 'products', label: 'Produce Listings', count: pendingProducts.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-green-600 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {totalPending === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            🎉
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Queue is Clear!</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
            All submitted farmer applications and produce listings have been verified and processed.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/admin/farmers"
              className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-200"
            >
              View Verified Farmers
            </Link>
            <Link
              href="/admin/products"
              className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl text-xs hover:bg-green-700"
            >
              Browse Active Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Farmers Section */}
          {(activeTab === 'all' || activeTab === 'farmers') && pendingFarmers.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span>👨‍🌾</span> Farmer Applications Awaiting Verification ({pendingFarmers.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-3xl flex items-center justify-center flex-shrink-0">
                            {farmer.emoji || '👨‍🌾'}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{farmer.name}</h3>
                            <p className="text-xs font-semibold text-green-700">{farmer.farmName}</p>
                            <p className="text-[11px] text-gray-400">📍 {farmer.location}</p>
                          </div>
                        </div>
                        <Badge status="Pending" />
                      </div>

                      <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 mb-4 space-y-1">
                        <p><strong>Official Contact:</strong> {farmer.email} · {farmer.phone}</p>
                        <p><strong>Submitted Docs:</strong> {farmer.verificationDocs}</p>
                        <p><strong>Applied On:</strong> {farmer.joinedDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setRejectDialog({ type: 'farmer', item: farmer })}
                        className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-xl transition"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={() => approveFarmer(farmer.id)}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                      >
                        ✓ Verify & Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Products Section */}
          {(activeTab === 'all' || activeTab === 'products') && pendingProducts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span>🥦</span> Produce Listings Awaiting Approval ({pendingProducts.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-green-50 overflow-hidden border border-gray-100 flex items-center justify-center flex-shrink-0">
                            {prod.image ? (
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-3xl">{prod.emoji || '🥦'}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{prod.name}</h3>
                            <p className="text-xs text-gray-500">By {prod.farmerName}</p>
                            <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                              {prod.category}
                            </span>
                          </div>
                        </div>
                        <Badge status="Pending" />
                      </div>

                      <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-1 text-gray-600 mb-4">
                        <p>
                          <strong>Price:</strong> ₹{prod.price.toFixed(2)} / {prod.unit}
                        </p>
                        <p><strong>Stock Available:</strong> {prod.stock} units</p>
                        <p><strong>Organic Certified:</strong> {prod.isOrganic ? 'Yes' : 'Conventional'}</p>
                        <p><strong>Submitted Date:</strong> {prod.createdAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setRejectDialog({ type: 'product', item: prod })}
                        className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-xl transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveProduct(prod.id)}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                      >
                        ✓ Approve Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(rejectDialog)}
        title={
          rejectDialog?.type === 'farmer'
            ? `Reject Farmer Application: ${rejectDialog?.item?.name}?`
            : `Reject Produce Listing: ${rejectDialog?.item?.name}?`
        }
        message="Please provide a clear reason for rejecting this submission. This note will be recorded in the security audit logs and communicated to the applicant."
        confirmLabel="Confirm Rejection"
        confirmVariant="danger"
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectDialog(null)}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Reason for Rejection
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Incomplete certification documents, incorrect product classification"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
