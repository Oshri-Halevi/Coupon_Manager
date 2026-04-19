import { useState, useEffect } from 'react'
import { CATEGORIES, DISCOUNT_TYPES, CURRENCIES } from '../lib/utils'

const defaultForm = {
  store_name: '',
  code: '',
  description: '',
  discount_type: 'gift_card',
  original_value: '',
  remaining_value: '',
  currency: 'ILS',
  category: '',
  expiry_date: '',
  notes: '',
}

export default function CouponModal({ coupon, onClose, onSave }) {
  const isEdit = !!coupon
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (coupon) {
      setForm({
        store_name: coupon.store_name || '',
        code: coupon.code || '',
        description: coupon.description || '',
        discount_type: coupon.discount_type || 'gift_card',
        original_value: coupon.original_value || '',
        remaining_value: coupon.remaining_value || '',
        currency: coupon.currency || 'ILS',
        category: coupon.category || '',
        expiry_date: coupon.expiry_date || '',
        notes: coupon.notes || '',
      })
    }
  }, [coupon])

  const set = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val }
      if (key === 'original_value' && !isEdit) {
        next.remaining_value = val
      }
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.store_name.trim())
      return setError('שם החנות הוא שדה חובה')
    if (!form.original_value || form.original_value === '')
      return setError('יש להזין ערך לקופון')
    if (isNaN(form.original_value) || Number(form.original_value) <= 0)
      return setError('הערך חייב להיות מספר חיובי')
    if (form.discount_type === 'percentage' && Number(form.original_value) > 100)
      return setError('אחוז הנחה לא יכול לעלות על 100%')
    if (form.discount_type === 'percentage' && Number(form.original_value) < 1)
      return setError('אחוז הנחה חייב להיות לפחות 1%')
    if (isEdit && form.remaining_value === '')
      return setError('יש להזין יתרה נוכחית')
    if (isEdit && Number(form.remaining_value) < 0)
      return setError('היתרה לא יכולה להיות שלילית')
    if (isEdit && Number(form.remaining_value) > Number(form.original_value))
      return setError('היתרה לא יכולה להיות גדולה מהערך המקורי')

    setSaving(true)
    try {
      const payload = {
        ...form,
        original_value: Number(form.original_value),
        remaining_value: isEdit ? Number(form.remaining_value) : Number(form.original_value),
        expiry_date: form.expiry_date || null,
        code: form.code || null,
        description: form.description || null,
        category: form.category || null,
        notes: form.notes || null,
        updated_at: new Date().toISOString(),
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      setError('אירעה שגיאה בשמירה, נסה שוב')
    } finally {
      setSaving(false)
    }
  }

  const showCurrency = form.discount_type !== 'percentage'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'עריכת קופון' : 'קופון חדש'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">חנות / עסק *</label>
              <input
                type="text"
                value={form.store_name}
                onChange={e => set('store_name', e.target.value)}
                placeholder="לדוגמה: זארה, שופרסל, אמזון..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סוג הטבה *</label>
              <select
                value={form.discount_type}
                onChange={e => set('discount_type', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
              >
                {Object.entries(DISCOUNT_TYPES).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.discount_type === 'percentage' ? 'אחוז הנחה *' : 'ערך *'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.original_value}
                  onChange={e => set('original_value', e.target.value)}
                  min="0"
                  step="any"
                  placeholder={form.discount_type === 'percentage' ? '20' : '100'}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 pl-8"
                  required
                />
                <span className="absolute left-3 top-2 text-gray-400 text-sm">
                  {form.discount_type === 'percentage' ? '%' : form.currency === 'USD' ? '$' : form.currency === 'EUR' ? '€' : '₪'}
                </span>
              </div>
            </div>

            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">יתרה נוכחית</label>
                <input
                  type="number"
                  value={form.remaining_value}
                  onChange={e => set('remaining_value', e.target.value)}
                  min="0"
                  step="any"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            )}

            {showCurrency && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מטבע</label>
                <select
                  value={form.currency}
                  onChange={e => set('currency', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            <div className={showCurrency ? 'col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1">קוד קופון</label>
              <input
                type="text"
                value={form.code}
                onChange={e => set('code', e.target.value.toUpperCase())}
                placeholder="SAVE20"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-300 uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
              >
                <option value="">ללא קטגוריה</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תאריך תפוגה</label>
              <input
                type="date"
                value={form.expiry_date}
                onChange={e => set('expiry_date', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור קצר</label>
              <input
                type="text"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="לדוגמה: הנחה על כל הנעליים"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={2}
                placeholder="כל הערה נוספת שתרצה לזכור..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
        </form>

        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'שומר...' : isEdit ? 'שמור שינויים' : 'הוסף קופון'}
          </button>
        </div>
      </div>
    </div>
  )
}
