export default function StatCard({
  title,
  value,
  icon,
  change,
  changeType = 'positive',
  subtitle,
  badge,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-green-300 hover:shadow-md' : 'hover:shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center text-xl select-none">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {value}
        </h3>
        {badge && (
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {(change || subtitle) && (
        <div className="flex items-center gap-2 mt-2 text-xs">
          {change && (
            <span
              className={`font-semibold inline-flex items-center gap-0.5 ${
                changeType === 'positive'
                  ? 'text-emerald-600'
                  : changeType === 'negative'
                  ? 'text-rose-600'
                  : 'text-gray-600'
              }`}
            >
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {change}
            </span>
          )}
          {subtitle && <span className="text-gray-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
