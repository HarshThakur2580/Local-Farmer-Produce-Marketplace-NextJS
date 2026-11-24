'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import Badge from '@/components/admin/Badge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function AdminProductsPage() {
  const { products, categories, approveProduct, rejectProduct, updateProductDetails, deleteProduct } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [deleteDialogProduct, setDeleteDialogProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setEditPrice(prod.price);
    setEditStock(prod.stock);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductDetails(editingProduct.id, {
        price: parseFloat(editPrice) || editingProduct.price,
        stock: parseInt(editStock, 10) || editingProduct.stock,
      });
      setEditingProduct(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteDialogProduct) {
      deleteProduct(deleteDialogProduct.id);
      setDeleteDialogProduct(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Produce Catalog & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Audit agricultural items, approve incoming harvest submissions, adjust pricing/stock and moderate listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1.5 rounded-xl border border-green-200">
            {products.length} Total Produce Items
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by produce name, category or farmer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {['All', 'Approved', 'Pending', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  statusFilter === st
                    ? 'bg-white text-green-700 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Producer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Unit</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl select-none">{p.emoji || '🥦'}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{p.name}</p>
                          {p.isOrganic && (
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                              🌱 Organic
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-gray-700">
                      {p.farmerName}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-600 font-medium">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-green-700">
                      ₹{p.price.toFixed(2)}{' '}
                      <span className="text-gray-400 font-normal text-[10px]">/ {p.unit}</span>
                    </td>

                    <td className="py-3 px-4 font-bold text-gray-800">
                      <span className={p.stock < 50 ? 'text-amber-600 font-bold' : ''}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-yellow-500 font-bold">★ {p.rating || 'N/A'}</span>
                      {p.reviewsCount > 0 && (
                        <span className="text-[10px] text-gray-400 ml-1">({p.reviewsCount})</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <Badge status={p.status} />
                      {p.rejectionReason && (
                        <p className="text-[10px] text-rose-600 mt-1 line-clamp-1" title={p.rejectionReason}>
                          {p.rejectionReason}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {p.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => approveProduct(p.id)}
                              className="px-2.5 py-1 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectProduct(p.id, 'Super Admin Quality Audit Rejection')}
                              className="px-2 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteDialogProduct(p)}
                              className="px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete listing"
                            >
                              ✕
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Edit Produce: {editingProduct.name}
            </h3>
            <p className="text-xs text-gray-400 mb-4">Farmer: {editingProduct.farmerName}</p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Price in INR (₹ per {editingProduct.unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Current Stock Available ({editingProduct.unit} units)
                </label>
                <input
                  type="number"
                  required
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold"
                >
                  Update Product Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteDialogProduct)}
        title={`Remove Product: ${deleteDialogProduct?.name}?`}
        message="This action permanently deletes the produce listing from the marketplace catalog and cancels active customer cart references."
        confirmLabel="Confirm Delete"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogProduct(null)}
      />
    </div>
  );
}
