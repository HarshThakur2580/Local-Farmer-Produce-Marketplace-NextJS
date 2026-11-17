'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import Badge from '@/components/admin/Badge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '🥕',
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', icon: '🥕' });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon || '🥕',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: formData.description,
        icon: formData.icon,
      });
    } else {
      addCategory(formData);
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Produce Category Taxonomy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Organize agricultural goods into discoverable classifications for customers and vendor listing forms.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="self-start sm:self-auto bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
        >
          <span>＋</span> Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-200"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 text-3xl flex items-center justify-center flex-shrink-0 select-none">
                  {cat.icon || '🥕'}
                </div>
                <Badge status={cat.status || 'Active'} />
              </div>

              <h3 className="font-extrabold text-gray-900 text-base mb-1">{cat.name}</h3>
              <p className="text-xs text-green-700 font-mono mb-2">slug: /{cat.slug}</p>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{cat.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-gray-700">
                📦 {cat.productsCount || 0} active products
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-bold rounded-lg transition"
                  title="Delete category"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {editingCategory ? 'Edit Category' : 'Create Produce Category'}
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Categories define how products are organized across the marketplace.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Icon</label>
                  <input
                    type="text"
                    required
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full text-center text-xl py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Tubers & Roots"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                      })
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono text-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short description of agricultural items under this classification..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title={`Delete Category: ${deleteTarget?.name}?`}
        message="Deleting this category will remove it from the product filtering navigation and unassign linked produce listings."
        confirmLabel="Confirm Delete"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
