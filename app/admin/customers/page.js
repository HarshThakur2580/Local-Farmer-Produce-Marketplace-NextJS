'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import Badge from '@/components/admin/Badge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Icon from '@/components/Icon';

export default function AdminCustomersPage() {
  const { customers, toggleSuspendCustomer, updateCustomerNotes } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [suspendDialogTarget, setSuspendDialogTarget] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('Terms of service violation');
  const [editAddress, setEditAddress] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditAddress(customer.address || '');
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    if (selectedCustomer) {
      updateCustomerNotes(selectedCustomer.id, editAddress);
      setSelectedCustomer(null);
    }
  };

  const handleConfirmSuspension = () => {
    if (suspendDialogTarget) {
      toggleSuspendCustomer(suspendDialogTarget.id, suspensionReason);
      setSuspendDialogTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Customer Account Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Audit registered marketplace consumers, manage account statuses, order history and security flags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1.5 rounded-xl border border-green-200">
            {customers.length} Registered Buyers
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
            placeholder="Search by name, email, phone or delivery address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Status:</span>
          {['All', 'Active', 'Suspended'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
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

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No customers found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{c.name}</p>
                          <p className="text-[10px] text-gray-400">Joined {c.joinedDate}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <p>{c.email}</p>
                      <p className="text-gray-400">{c.phone}</p>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 max-w-[160px] truncate" title={c.address}>
                      {c.address}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-gray-800">
                      {c.ordersCount} orders
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-green-700">
                      ₹{c.totalSpent.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={c.status} />
                      {c.suspensionReason && (
                        <p className="text-[10px] text-rose-600 mt-0.5 line-clamp-1" title={c.suspensionReason}>
                          {c.suspensionReason}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setSuspendDialogTarget(c)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                            c.status === 'Active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {c.status === 'Active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Customer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Edit Customer Profile: {selectedCustomer.name}
            </h3>
            <p className="text-xs text-gray-400 mb-4">Email: {selectedCustomer.email}</p>

            <form onSubmit={handleSaveNotes} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Delivery Address
                </label>
                <textarea
                  rows={3}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-1 text-gray-600">
                <p><strong>Total Orders:</strong> {selectedCustomer.ordersCount}</p>
                <p><strong>Lifetime Volume:</strong> ₹{selectedCustomer.totalSpent.toFixed(2)}</p>
                <p><strong>Account Status:</strong> {selectedCustomer.status}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(suspendDialogTarget)}
        title={
          suspendDialogTarget?.status === 'Active'
            ? `Suspend Customer: ${suspendDialogTarget?.name}?`
            : `Reactivate Customer: ${suspendDialogTarget?.name}?`
        }
        message={
          suspendDialogTarget?.status === 'Active'
            ? 'Suspended accounts cannot place new marketplace orders or access active cart sessions. You can reactivate this customer at any time.'
            : 'Reactivating this account will restore marketplace purchasing privileges immediately.'
        }
        confirmLabel={suspendDialogTarget?.status === 'Active' ? 'Confirm Suspension' : 'Reactivate Account'}
        confirmVariant={suspendDialogTarget?.status === 'Active' ? 'danger' : 'primary'}
        onConfirm={handleConfirmSuspension}
        onCancel={() => setSuspendDialogTarget(null)}
      >
        {suspendDialogTarget?.status === 'Active' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reason for Suspension (recorded in audit log)
            </label>
            <input
              type="text"
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}
