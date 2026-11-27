'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import Icon from '@/components/Icon';
import Badge from '@/components/admin/Badge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function AdminReviewsPage() {
  const { reviews, moderateReview, deleteReview } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.farmerName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchQuery, statusFilter]);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteReview(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Customer Reviews & Content Moderation
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Ensure marketplace integrity, verify genuine customer experiences and moderate spam or abusive comments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-rose-50 text-rose-700 font-bold px-3 py-1.5 rounded-xl border border-rose-200">
            {reviews.filter((r) => r.status === 'Flagged').length} Flagged for Review
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            <Icon name="search" className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by customer, product, farm or review content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['All', 'Approved', 'Flagged'].map((st) => (
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

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs text-gray-400">
            No reviews match the selected filters.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-xs transition duration-200 ${
                rev.status === 'Flagged' ? 'border-rose-200 bg-rose-50/20' : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{rev.customerName}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-green-700 font-semibold">
                      reviewed {rev.productName}
                    </span>
                    <span className="text-xs text-gray-400">({rev.farmerName})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon key={i} name="star" className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'opacity-25'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400">{rev.date}</span>
                    {rev.reportCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                        <Icon name="warning" className="w-3.5 h-3.5" /> Reported {rev.reportCount} times
                      </span>
                    )}
                  </div>
                </div>

                <Badge status={rev.status} />
              </div>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 mb-4">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                {rev.status !== 'Approved' && (
                  <button
                    onClick={() => moderateReview(rev.id, 'Approved')}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    Approve review
                  </button>
                )}

                {rev.status !== 'Flagged' && (
                  <button
                    onClick={() => moderateReview(rev.id, 'Flagged')}
                    className="px-3 py-1.5 border border-amber-200 text-amber-800 hover:bg-amber-50 text-xs font-semibold rounded-xl transition"
                  >
                    Flag as Suspicious
                  </button>
                )}

                <button
                  onClick={() => setDeleteTarget(rev)}
                  className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-xl transition"
                >
                  Delete Content
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Permanently Delete Review?"
        message="This action removes the review and any associated rating impact from the product catalog."
        confirmLabel="Confirm Delete"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
