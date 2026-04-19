import { useState } from 'react'
import { formatCurrency, CURRENCY_SYMBOLS } from '../lib/utils'

export default function UpdateUsageModal({ coupon, onClose, onUpdate }) {
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isGiftCard = coupon.discount_type === 'gift_card'
  const sym = CURRENCY_SYMBOLS[coupon.currency] || '₪'

  const remaining = Number(coupon.remaining_value)
  const spent = Number(amount) || 0
  const preview = Math.max(0, remaining - spent)

  const handleMarkUsed = async () => {
    setSaving(true)
    try {
      await onUpdate(coupon.id, remaining, 0)
      onClose()
    } catch (err) {
      setError('אירעה שגיאה, נסה שוב')
    } finally {
      setSaving(false)
    }
  }

  const handlePartialUse = async (e) => {
    e.preventDefault()
    setError('')
    if (!amount || amount === '')
      return setError('יש להזין סכום שהוצאת')
    if (isNaN(amount))
      return setError('יש להזין מספר בלבד')
    if (spent <= 0)
      return setError('הסכום חייב להיות גדול מ-0')
    if (spent > remaining)
      return setError(`הסכום (${sym}${spent}) גדול מהיתרה הנוכחית (${sym}${remaining})`)

    setSaving(true)
    try {
      await onUpdate(coupon.id, spent, preview)
      onClose()
    } catch (err) {
      setError('אירעה שגיאה, נסה שוב')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">עדכון שימוש</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="text-sm text-gray-500">חנות</div>
            <div className="text-lg font-bold text-gray-900">{coupon.store_name}</div>
            {coupon.code && (
              <div className="font-mono text-sm text-violet-700 bg-violet-50 px-3 py-1 rounded-lg inline-block">
                {coupon.code}
              </div>
            )}
          </div>

          {isGiftCard && (
            <div className="bg-violet-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">יתרה נוכחית:</span>
                <span className="font-bold text-violet-700">{formatCurrency(remaining, coupon.currency)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-violet-400 to-indigo-500 rounded-full"
                  style={{ width: `${(remaining / coupon.original_value) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 text-left">
                מתוך {formatCurrency(coupon.original_value, coupon.currency)}
              </div>
            </div>
          )}

          {isGiftCard ? (
            <form onSubmit={handlePartialUse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  כמה הוצאת עכשיו?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    min="0.01"
                    max={remaining}
                    step="0.01"
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-violet-300 pl-10"
                    autoFocus
                  />
                  <span className="absolute left-3 top-3.5 text-gray-400">{sym}</span>
                </div>
              </div>

              {amount && !isNaN(amount) && spent > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-500 mb-1">יתרה חדשה</div>
                  <div className="text-3xl font-bold text-emerald-700">
                    {formatCurrency(preview, coupon.currency)}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleMarkUsed}
                  disabled={saving}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  סמן כנוצל לגמרי
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'שומר...' : 'עדכן יתרה'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                {coupon.discount_type === 'percentage'
                  ? `קופון הנחה של ${coupon.original_value}%. לאחר שהשתמשת בו, סמן אותו כנוצל.`
                  : `קופון הנחה של ${sym}${coupon.original_value}. לאחר שהשתמשת בו, סמן אותו כנוצל.`}
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handleMarkUsed}
                disabled={saving}
                className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'שומר...' : '✓ סמן כנוצל'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
