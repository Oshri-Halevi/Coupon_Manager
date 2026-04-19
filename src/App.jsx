import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Header from './components/Header'
import Stats from './components/Stats'
import Filters from './components/Filters'
import CouponList from './components/CouponList'
import CouponModal from './components/CouponModal'
import UpdateUsageModal from './components/UpdateUsageModal'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [coupons, setCoupons] = useState([])
  const [couponsLoading, setCouponsLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [updatingCoupon, setUpdatingCoupon] = useState(null)
  const [filters, setFilters] = useState({ search: '', category: '', status: 'all' })
  const [sort, setSort] = useState({ field: 'expiry_date', direction: 'asc' })
  const [view, setView] = useState('grid')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchCoupons = useCallback(async () => {
    if (!user) return
    setCouponsLoading(true)
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setCoupons(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setCouponsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) fetchCoupons()
  }, [user, fetchCoupons])

  const addCoupon = async (data) => {
    const { error } = await supabase.from('coupons').insert({ ...data, user_id: user.id })
    if (error) throw error
    await fetchCoupons()
  }

  const updateCoupon = async (id, data) => {
    const { error } = await supabase.from('coupons').update(data).eq('id', id)
    if (error) throw error
    await fetchCoupons()
  }

  const deleteCoupon = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק קופון זה?')) return
    const { error } = await supabase.from('coupons').delete().eq('id', id)
    if (error) throw error
    await fetchCoupons()
  }

  const updateUsage = async (id, amountUsed, newRemaining) => {
    const { error } = await supabase
      .from('coupons')
      .update({ remaining_value: newRemaining, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    await fetchCoupons()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-2xl">🎟️ טוען...</div>
      </div>
    )
  }

  if (!user) return <Auth />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={() => supabase.auth.signOut()} onAddCoupon={() => setShowAddModal(true)} />

      <main className="w-full px-6 sm:px-10 py-8">
        <Stats coupons={coupons} />
        <Filters
          filters={filters}
          sort={sort}
          view={view}
          onFiltersChange={setFilters}
          onSortChange={setSort}
          onViewChange={setView}
        />
        <CouponList
          coupons={coupons}
          loading={couponsLoading}
          filters={filters}
          sort={sort}
          view={view}
          onEdit={setEditingCoupon}
          onDelete={deleteCoupon}
          onUpdateUsage={setUpdatingCoupon}
        />
      </main>

      {(showAddModal || editingCoupon) && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => { setShowAddModal(false); setEditingCoupon(null) }}
          onSave={editingCoupon
            ? (data) => updateCoupon(editingCoupon.id, data)
            : addCoupon}
        />
      )}

      {updatingCoupon && (
        <UpdateUsageModal
          coupon={updatingCoupon}
          onClose={() => setUpdatingCoupon(null)}
          onUpdate={updateUsage}
        />
      )}
    </div>
  )
}
