import { useMemo } from 'react'
import CouponCard from './CouponCard'
import { getCouponStatus, formatCurrency, formatDate, STATUS_CONFIG, CURRENCY_SYMBOLS } from '../lib/utils'

function ListRow({ coupon, onEdit, onDelete, onUpdateUsage }) {
  const status = getCouponStatus(coupon)
  const config = STATUS_CONFIG[status]
  const sym = CURRENCY_SYMBOLS[coupon.currency] || '₪'

  const valueDisplay = () => {
    if (coupon.discount_type === 'percentage') return `${coupon.original_value}%`
    return formatCurrency(coupon.original_value, coupon.currency)
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="font-semibold text-gray-900">{coupon.store_name}</div>
        {coupon.description && <div className="text-xs text-gray-400">{coupon.description}</div>}
      </td>
      <td className="px-4 py-3">
        {coupon.code ? (
          <button
            onClick={() => navigator.clipboard.writeText(coupon.code)}
            className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200 transition-colors"
            title="העתק"
          >
            {coupon.code}
          </button>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-violet-700 font-medium">{valueDisplay()}</td>
      <td className="px-4 py-3">
        {coupon.discount_type === 'gift_card'
          ? <span className="text-emerald-700 font-medium">{formatCurrency(coupon.remaining_value, coupon.currency)}</span>
          : <span className="text-gray-400 text-sm">—</span>}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(coupon.expiry_date) || '—'}</td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.bg}`}>
          {config.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          {['active', 'expiring_soon'].includes(status) && (
            <button
              onClick={() => onUpdateUsage(coupon)}
              className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded hover:bg-violet-200 transition-colors"
            >
              עדכן
            </button>
          )}
          <button onClick={() => onEdit(coupon)} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">ערוך</button>
          <button onClick={() => onDelete(coupon.id)} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">מחק</button>
        </div>
      </td>
    </tr>
  )
}

export default function CouponList({ coupons, loading, filters, sort, view, onEdit, onDelete, onUpdateUsage }) {
  const filtered = useMemo(() => {
    let result = [...coupons]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(c =>
        c.store_name.toLowerCase().includes(q) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      )
    }

    if (filters.category) {
      result = result.filter(c => c.category === filters.category)
    }

    if (filters.status !== 'all') {
      result = result.filter(c => getCouponStatus(c) === filters.status)
    }

    result.sort((a, b) => {
      let aVal, bVal
      switch (sort.field) {
        case 'expiry_date':
          aVal = a.expiry_date ? new Date(a.expiry_date).getTime() : Infinity
          bVal = b.expiry_date ? new Date(b.expiry_date).getTime() : Infinity
          break
        case 'remaining_value':
          aVal = Number(a.remaining_value)
          bVal = Number(b.remaining_value)
          break
        case 'store_name':
          aVal = a.store_name.toLowerCase()
          bVal = b.store_name.toLowerCase()
          break
        default:
          aVal = new Date(a.created_at).getTime()
          bVal = new Date(b.created_at).getTime()
      }
      if (sort.direction === 'asc') return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    })

    return result
  }, [coupons, filters, sort])

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-4xl mb-3">⏳</div>
        <p>טוען קופונים...</p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-4">{coupons.length === 0 ? '🎟️' : '🔍'}</div>
        <p className="text-lg font-medium text-gray-500">
          {coupons.length === 0 ? 'עדיין אין קופונים' : 'לא נמצאו קופונים תואמים'}
        </p>
        <p className="text-sm mt-1">
          {coupons.length === 0 ? 'לחץ על "קופון חדש" כדי להוסיף את הראשון' : 'נסה לשנות את הפילטרים'}
        </p>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['חנות', 'קוד', 'ערך', 'יתרה', 'תפוגה', 'סטטוס', 'פעולות'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <ListRow key={c.id} coupon={c} onEdit={onEdit} onDelete={onDelete} onUpdateUsage={onUpdateUsage} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
          מציג {filtered.length} מתוך {coupons.length} קופונים
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(c => (
          <CouponCard key={c.id} coupon={c} onEdit={onEdit} onDelete={onDelete} onUpdateUsage={onUpdateUsage} />
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-4">
        מציג {filtered.length} מתוך {coupons.length} קופונים
      </p>
    </div>
  )
}
