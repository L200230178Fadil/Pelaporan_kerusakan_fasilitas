import { Link, useLocation } from 'react-router-dom'
import { Building2, AlertTriangle, LayoutDashboard, Moon, Sun } from 'lucide-react'
import { clsx } from '../../utils/helpers'

const LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/laporan', label: 'Buat Laporan', icon: AlertTriangle },

]

export default function Navbar({ isDark, toggleDark }) {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur-md dark:bg-ink-950/80 dark:border-ink-900">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-4 h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mr-4">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
            <Building2 size={16} className="text-accent-400" />
          </div>
          <span className="font-display font-bold text-ink-900 text-base leading-none dark:text-white">
            Si<span className="text-brand-600">Peduli</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {LINKS.map(({ to, label, icon: Icon }) => {
            const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-ink-500 hover:text-ink-800 hover:bg-ink-50 dark:text-ink-400 dark:hover:text-ink-100 dark:hover:bg-ink-900'
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-ink-100 text-ink-500 hover:bg-ink-50 transition-all dark:border-ink-800 dark:text-ink-400 dark:hover:bg-ink-900"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <span className="hidden sm:block text-xs text-ink-400 font-mono ml-2">
            Gedung J — UMS
          </span>
        </div>
      </div>
    </header>
  )
}
