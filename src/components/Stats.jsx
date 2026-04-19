import { getCouponStatus, formatCurrency } from '../lib/utils'

export default function Stats({ coupons }) {
  const active = coupons.filter(c => getCouponStatus(c) === 'active')
  const expiringSoon = coupons.filter(c => getCouponStatus(c) === 'expiring_soon')
  const used = coupons.filter(c => ['used', 'expired'].includes(getCouponStatus(c)))

  const totalGiftCardValue = coupons
    .filter(c => c.discount_type === 'gift_card' && ['active', 'expiring_soon'].includes(getCouponStatus(c)))
    .reduce((sum, c) => sum + Number(c.remaining_value), 0)

  const stats = [
    { label: 'קופונים פעילים', value: active.length, icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'פגים בקרוב', value: expiringSoon.length, icon: '⏰', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'יתרת קרדיט פעיל', value: formatCurrency(totalGiftCardValue), icon: '💳', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
    { label: 'שומשו / פגו', value: used.length, icon: '📦', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((s) => (
        <div key={s.label} className={`${s.bg} rounded-2xl p-6 border ${s.border}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-base font-medium">{s.label}</span>
            <span className="text-4xl">{s.icon}</span>
          </div>
          <div className={`text-5xl font-bold ${s.color}`}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}
