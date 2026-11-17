export default function Badge({ status, text }) {
  const label = text || status;
  const s = (status || '').toLowerCase();

  let colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';

  if (s === 'approved' || s === 'active' || s === 'completed' || s === 'paid' || s === 'delivered' || s === 'resolved') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (s === 'pending' || s === 'scheduled' || s === 'confirmed' || s === 'open') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (s === 'suspended' || s === 'rejected' || s === 'cancelled' || s === 'refunded' || s === 'flagged') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (s === 'shipped') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (s === 'on hold') {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
