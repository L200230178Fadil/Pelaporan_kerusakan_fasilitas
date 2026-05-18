import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, AlertTriangle,
  Wrench, LogOut, ChevronRight, Building2
} from 'lucide-react'
// import { useAuth } from '../../contexts/AuthContext'
// import toast from 'react-hot-toast'
import { clsx } from '../../utils/helpers'

const NAV_ITEMS = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/fasilitas',  icon: Package,         label: 'Inventaris Fasilitas' },
  { to: '/laporan',    icon: AlertTriangle,   label: 'Laporan Kerusakan' },
  { to: '/monitoring', icon: Wrench,          label: 'Monitoring Perbaikan' },
]

export default function Sidebar({ open, onClose }) {
  // const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  // const handleLogout = async () => {
  //   await logout()
  //   toast.success('Berhasil keluar.')
  //   navigate('/login')
  // }

  const content = (
    <aside className="flex flex-col h-full bg-white border-r border-surface-100 w-[260px] flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-100">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-surface-900 leading-tight text-sm">SiPeduli</p>
          <p className="text-[10px] text-surface-400 uppercase tracking-wider">Fasilitas Kampus</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={clsx(isActive ? 'text-primary-600' : 'text-surface-400 group-hover:text-surface-600')} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-primary-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      {/* <div className="px-3 py-4 border-t border-surface-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-50">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary-700">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
            <p className="text-[11px] text-surface-400 capitalize">{user?.role || 'Pengguna'}</p>
          </div>
          <button onClick={handleLogout} title="Keluar" className="p-1.5 hover:bg-surface-200 rounded-lg transition-colors">
            <LogOut size={15} className="text-surface-400" />
          </button>
        </div>
      </div> */}
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex">{content}</div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
          <div className="relative animate-slide-up">{content}</div>
        </div>
      )}
    </>
  )
}
