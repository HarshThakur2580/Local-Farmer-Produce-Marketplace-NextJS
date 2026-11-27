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
      className={`bg-[#fffef8] rounded-[1.5rem] border border-[#155d38]/10 p-5 shadow-[0_14px_35px_rgba(9,65,38,.06)] transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#155d38]/30 hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-black text-[#607068] uppercase tracking-[0.12em]">
          {title}
        </span>
        <div className="w-10 h-10 rounded-full bg-[#e5f7e8] text-[#155d38] flex items-center justify-center text-xl select-none">
          <Icon name={icon || 'chart'} className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-3xl sm:text-4xl font-black text-[#10251a] tracking-[-0.055em]">
          {value}
        </h3>
        {badge && (
          <span className="text-xs bg-[#f4511e]/10 text-[#a83816] font-black px-2.5 py-1 rounded-full">
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
import Icon from '@/components/Icon';

