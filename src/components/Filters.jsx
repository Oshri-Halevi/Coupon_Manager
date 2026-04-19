import { CATEGORIES } from '../lib/utils'

const STATUS_OPTIONS = [
  { value: 'all', label: 'הכל' },
  { value: 'active', label: 'פעיל' },
  { value: 'expiring_soon', label: 'פג בקרוב' },
  { value: 'expired', label: 'פג תוקף' },
  { value: 'used', label: 'נוצל' },
]

const SORT_OPTIONS = [
  { value: 'expiry_date', label: 'תאריך תפוגה' },
  { value: 'remaining_value', label: 'ערך' },
  { value: 'store_name', label: 'שם חנות' },
  { value: 'created_at', label: 'תאריך הוספה' },
]

export default function Filters({ filters, sort, view, onFiltersChange, onSortChange, onViewChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="חיפוש לפי חנות או קוד..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-lg focus:outline-none focus:ring-2 focus:ring-violet-300 pr-12"
          />
          <span className="absolute right-4 top-3.5 text-gray-400 text-xl">🔍</span>
        </div>

        <select
          value={filters.category}
          onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3.5 text-lg focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
        >
          <option value="">כל הקטגוריות</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex items-center gap-3">
          <select
            value={sort.field}
            onChange={(e) => onSortChange({ ...sort, field: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-3.5 text-lg focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            onClick={() => onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            className="border border-gray-200 rounded-xl px-4 py-3.5 text-xl hover:bg-gray-50 transition-colors"
          >
            {sort.direction === 'asc' ? '↑' : '↓'}
          </button>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => onViewChange('grid')}
              className={`px-4 py-3.5 text-xl transition-colors ${view === 'grid' ? 'bg-violet-600 text-white' : 'hover:bg-gray-50'}`}
            >⊞</button>
            <button
              onClick={() => onViewChange('list')}
              className={`px-4 py-3.5 text-xl transition-colors ${view === 'list' ? 'bg-violet-600 text-white' : 'hover:bg-gray-50'}`}
            >☰</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {STATUS_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => onFiltersChange({ ...filters, status: o.value })}
            className={`px-5 py-2.5 rounded-full text-base font-medium transition-colors ${
              filters.status === o.value
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
