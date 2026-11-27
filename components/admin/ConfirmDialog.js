'use client';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  confirmVariant = 'danger', // 'danger' | 'primary' | 'warning'
  onConfirm,
  onCancel,
  children,
}) {
  if (!isOpen) return null;

  let btnColor = 'bg-rose-600 hover:bg-rose-700 text-white';
  if (confirmVariant === 'primary') {
    btnColor = 'bg-green-600 hover:bg-green-700 text-white';
  } else if (confirmVariant === 'warning') {
    btnColor = 'bg-amber-600 hover:bg-amber-700 text-white';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#fffef8] rounded-[2rem] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#155d38]/12 relative">
        <div className="w-12 h-12 rounded-full bg-[#f4511e]/10 text-[#b63814] flex items-center justify-center text-xl font-black mb-5">
          !
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">{message}</p>

        {children && <div className="mb-6">{children}</div>}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition ${btnColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
