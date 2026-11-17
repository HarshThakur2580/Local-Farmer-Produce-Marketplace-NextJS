'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import Badge from '@/components/admin/Badge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const PERMITTED_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, resolveOrderComplaint } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [complaintModalOrder, setComplaintModalOrder] = useState(null);
  const [complaintNotes, setComplaintNotes] = useState('');
  const [cancelDialogOrder, setCancelDialogOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.farmerName.toLowerCase().includes(q) ||
        o.itemsSummary.toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter === 'Complaints') {
        matchesStatus = o.complaintStatus === 'Open';
      } else if (statusFilter !== 'All') {
        matchesStatus = o.status === statusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === 'Cancelled') {
      const ord = orders.find((o) => o.id === orderId);
      setCancelDialogOrder(ord);
      return;
    }
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleConfirmCancel = () => {
    if (cancelDialogOrder) {
      updateOrderStatus(cancelDialogOrder.id, 'Cancelled');
      setCancelDialogOrder(null);
    }
  };

  const handleResolveComplaint = (e) => {
    e.preventDefault();
    if (complaintModalOrder) {
      resolveOrderComplaint(complaintModalOrder.id, complaintNotes || 'Customer satisfied with replacement/resolution.');
      setComplaintModalOrder(null);
      setComplaintNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Order Fulfillment & Logistics
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track customer deliveries, update permitted dispatch stages, arbitrate farmer-customer complaints and process cancellations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1.5 rounded-xl border border-green-200">
            {orders.length} Total Orders Recorded
          </span>
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
            placeholder="Search by Order ID, buyer name, farmer or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Complaints'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-green-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st === 'Complaints' ? '⚠️ Complaints' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Producer</th>
                <th className="py-3 px-4">Produce Summary</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Fulfillment Stage</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No orders found matching filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {ord.id}
                      {ord.complaintStatus === 'Open' && (
                        <span className="ml-1 text-[10px] text-rose-600 font-bold">⚠️ Open Issue</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-800">{ord.customerName}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{ord.customerEmail}</p>
                    </td>

                    <td className="py-3 px-4 font-medium text-gray-600">
                      {ord.farmerName}
                    </td>

                    <td className="py-3 px-4 max-w-[180px]">
                      <p className="truncate text-gray-600" title={ord.itemsSummary}>
                        {ord.itemsSummary}
                      </p>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        ({ord.itemsCount} items)
                      </span>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-green-700">
                      ₹{ord.total.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      {/* Permitted Status Transition Dropdown */}
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="border border-gray-200 bg-white rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-green-500 cursor-pointer"
                      >
                        {PERMITTED_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <Badge status={ord.paymentStatus} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                        >
                          Details
                        </button>

                        {ord.complaintStatus === 'Open' && (
                          <button
                            onClick={() => {
                              setComplaintModalOrder(ord);
                              setComplaintNotes(ord.complaintNotes || '');
                            }}
                            className="px-2 py-1 text-xs font-bold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                          >
                            Resolve
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

      {/* Order Details Slide-out / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📦</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order #{selectedOrder.id}</h3>
                <p className="text-xs text-gray-400">Placed on {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-gray-600">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})</p>
                <p><strong>Destination:</strong> {selectedOrder.deliveryAddress}</p>
                <p><strong>Producer Farm:</strong> {selectedOrder.farmerName}</p>
                <p><strong>Produce Items:</strong> {selectedOrder.itemsSummary}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod} (<Badge status={selectedOrder.paymentStatus} />)</p>
                <p><strong>Total Amount:</strong> <span className="font-extrabold text-green-700 text-sm">₹{selectedOrder.total.toFixed(2)}</span></p>
              </div>

              {selectedOrder.complaintNotes && (
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-900">
                  <p className="font-bold mb-1">Issue / Complaint Record:</p>
                  <p>{selectedOrder.complaintNotes}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Change Order Stage (Permitted Transitions)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PERMITTED_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                        selectedOrder.status === st
                          ? 'bg-green-600 text-white border-green-600 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-6 mt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Resolution Modal */}
      {complaintModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Arbitrate Customer Complaint: #{complaintModalOrder.id}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Buyer: {complaintModalOrder.customerName} · Farmer: {complaintModalOrder.farmerName}
            </p>

            <form onSubmit={handleResolveComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Resolution Notes & Audit Summary
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Farmer agreed to issue harvest credit, replacement dispatched."
                  value={complaintNotes}
                  onChange={(e) => setComplaintNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setComplaintModalOrder(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold"
                >
                  Mark Complaint Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Order Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancelDialogOrder)}
        title={`Cancel Order #${cancelDialogOrder?.id}?`}
        message={`Are you sure you want to cancel this order placed by ${cancelDialogOrder?.customerName}? This will halt shipping dispatch from ${cancelDialogOrder?.farmerName} and mark payment for review.`}
        confirmLabel="Confirm Cancellation"
        confirmVariant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelDialogOrder(null)}
      />
    </div>
  );
}
