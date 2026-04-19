export const CATEGORIES = [
  'מזון ומשקאות',
  'קניות',
  'בידור',
  'נסיעות ותחבורה',
  'טכנולוגיה',
  'יופי וטיפוח',
  'ספורט ובריאות',
  'מסעדות',
  'חינוך',
  'אחר',
]

export const DISCOUNT_TYPES = {
  percentage: 'הנחה באחוזים (%)',
  fixed: 'הנחה בסכום קבוע',
  gift_card: 'כרטיס מתנה / קרדיט',
}

export const CURRENCIES = ['ILS', 'USD', 'EUR']

export const CURRENCY_SYMBOLS = { ILS: '₪', USD: '$', EUR: '€' }

export const getCouponStatus = (coupon) => {
  if (coupon.remaining_value === 0) return 'used'
  if (coupon.expiry_date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(coupon.expiry_date)
    if (expiry < today) return 'expired'
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 7) return 'expiring_soon'
  }
  return 'active'
}

export const getDaysUntilExpiry = (dateStr) => {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(dateStr) - today) / (1000 * 60 * 60 * 24))
}

export const formatCurrency = (amount, currency = 'ILS') => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (dateStr) => {
  if (!dateStr) return null
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export const STATUS_CONFIG = {
  active: {
    label: 'פעיל',
    bg: 'bg-emerald-100 text-emerald-800',
    bar: 'from-emerald-400 to-teal-500',
    border: 'border-emerald-200',
  },
  expiring_soon: {
    label: 'פג בקרוב',
    bg: 'bg-amber-100 text-amber-800',
    bar: 'from-amber-400 to-orange-500',
    border: 'border-amber-200',
  },
  expired: {
    label: 'פג תוקף',
    bg: 'bg-red-100 text-red-700',
    bar: 'from-red-400 to-rose-500',
    border: 'border-red-200',
  },
  used: {
    label: 'נוצל',
    bg: 'bg-gray-100 text-gray-500',
    bar: 'from-gray-300 to-gray-400',
    border: 'border-gray-200',
  },
}
