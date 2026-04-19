export default function Header({ user, onLogout, onAddCoupon }) {
  const avatarUrl = user?.user_metadata?.avatar_url
  const name = user?.user_metadata?.full_name || user?.email

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="w-full px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-5xl">🎟️</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">מנהל קופונים</h1>
            <p className="text-base text-gray-400 leading-tight">כל הקופונים שלך במקום אחד</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onAddCoupon}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl text-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="text-xl leading-none">+</span>
            קופון חדש
          </button>

          <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-lg font-bold">
                {name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-base text-gray-700 hidden sm:block max-w-[200px] truncate">{name}</span>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-red-500 transition-colors text-xl mr-1"
              title="יציאה"
            >
              ↩
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
