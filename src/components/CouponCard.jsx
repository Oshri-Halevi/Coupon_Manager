import { useState } from 'react'
import { getCouponStatus, formatCurrency, formatDate, getDaysUntilExpiry, STATUS_CONFIG, CURRENCY_SYMBOLS } from '../lib/utils'

export default function CouponCard({ coupon, onEdit, onDelete, onUpdateUsage }) {
  const [copied, setCopied] = useState(false)
  const status = getCouponStatus(coupon)
  const config = STATUS_CONFIG[status]
  const daysLeft = getDaysUntilExpiry(coupon.expiry_date)
  const pct = coupon.discount_type === 'gift_card'
    ? Math.round((coupon.remaining_value / coupon.original_value) * 100)
    : null
  const sym = CURRENCY_SYMBOLS[coupon.currency] || '₪'

  const copyCode = async () => {
    if (!coupon.code) return
    await navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const valueDisplay = () => {
    if (coupon.discount_type === 'percentage') return `${coupon.original_value}% הנחה`
    if (coupon.discount_type === 'fixed') return `${sym}${coupon.original_value} הנחה`
    return `${sym}${coupon.original_value} קרדיט`
  }

  return (
    <div className={`bg-white rounded-2xl border ${config.border} shadow-sm overflow-hidden flex flex-col`}>
      <div className={`bg-gradient-to-l ${config.bar} h-2`} />

      <div className="p-6 flex-1 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-2xl leading-tight truncate">{coupon.store_name}</h3>
            {coupon.description && (
              <p className="text-gray-500 text-base mt-1 truncate">{coupon.description}</p>
            )}
          </div>
          <span className={`shrink-0 text-sm px-3 py-1 rounded-full font-medium ${config.bg}`}>
            {config.label}
          </span>
        </div>

        {coupon.code && (
          <div className="flex items-center gap-3">
            <button
              onClick={copyCode}
              className="flex-1 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-center font-mono text-lg tracking-widest text-gray-700 hover:bg-gray-100 transition-colors"
              title="לחץ להעתקה"
            >
              {coupon.code}
            </button>
            <button
              onClick={copyCode}
              className={`text-base px-3 py-2 rounded-lg transition-colors font-medium ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {copied ? '✓ הועתק' : 'העתק'}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-violet-700 font-bold text-xl">{valueDisplay()}</span>
          {coupon.category && (
            <span className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium">
              {coupon.category}
            </span>
          )}
        </div>

        {coupon.discount_type === 'gift_card' && (
          <div className="space-y-2">
            <div className="flex justify-between text-base text-gray-500">
              <span>יתרה: <span className="font-bold text-gray-800">{formatCurrency(coupon.remaining_value, coupon.currency)}</span></span>
              <span>{pct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-l ${config.bar} rounded-full progress-bar`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {coupon.expiry_date && (
          <div className={`text-base flex items-center gap-2 ${
            daysLeft !== null && daysLeft <= 0 ? 'text-red-500' :
            daysLeft !== null && daysLeft <= 7 ? 'text-amber-600' : 'text-gray-400'
          }`}>
            <span>📅</span>
            <span>
              {daysLeft !== null && daysLeft <= 0
                ? `פג תוקף לפני ${Math.abs(daysLeft)} ימים`
                : daysLeft !== null && daysLeft <= 7
                ? `פג בעוד ${daysLeft} ימים!`
                : `תוקף עד: ${formatDate(coupon.expiry_date)}`}
            </span>
          </div>
        )}

        {coupon.notes && (
          <p className="text-base text-gray-400 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
            {coupon.notes}
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end bg-gray-50">
        {['active', 'expiring_soon'].includes(status) && (
          <button
            onClick={() => onUpdateUsage(coupon)}
            className="text-base px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-medium"
          >
            עדכן שימוש
          </button>
        )}
        <button
          onClick={() => onEdit(coupon)}
          className="text-base px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          ערוך
        </button>
        <button
          onClick={() => onDelete(coupon.id)}
          className="text-base px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
        >
          מחק
        </button>
      </div>
    </div>
  )
}
