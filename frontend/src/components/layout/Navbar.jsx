import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, AlertTriangle, Menu, X,
  Bell, ChevronRight, GraduationCap
} from 'lucide-react'
import { clsx } from '../../utils/helpers'

const LINKS = [
  { to: '/',       label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/laporan', label: 'Buat Laporan', icon: AlertTriangle   },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Utility Bar (ala UMS) ─────────────────────── */}
      <div className="utility-bar hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/50 font-body tracking-wide">
              Universitas Muhammadiyah Surakarta
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[11px] text-white/50 hover:text-gold-400 transition-colors">
              Portal Akademik
            </a>
            <span className="text-white/20">|</span>
            <a href="#" className="text-[11px] text-white/50 hover:text-gold-400 transition-colors">
              MyUMS
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ───────────────────────────────── */}
      <header className="ums-header-bg sticky top-0 z-40 shadow-ums">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-[64px]">

            {/* Logo + Brand */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative">
                <img
                  src="/ums-logo.png"
                  alt="Logo UMS"
                  className="w-10 h-10 object-contain drop-shadow-lg
                             group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-white font-display font-bold text-base leading-none">
                  FKI
                </p>
                <p className="text-white/60 text-[10px] font-body mt-0.5 leading-none">
                  Fak. Komunikasi & Tek. Informatika
                </p>
              </div>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-white/15 mx-1" />

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1">
              {LINKS.map(({ to, label, icon: Icon }) => {
                const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={clsx(
                      'ums-nav-link',
                      active && 'active'
                    )}
                  >
                    <Icon size={15} />
                    {label}
                    {active && <ChevronRight size={12} className="text-gold-400" />}
                  </Link>
                )
              })}
            </nav>

            {/* Spacer */}
            <div className="flex-1 md:flex-none" />

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Notification */}
              <button className="relative w-8 h-8 flex items-center justify-center rounded-lg
                                  text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold-400 rounded-full
                                  animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg
                           text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="md:hidden glass border-t border-white/10"
               style={{ animation: 'slideDown 0.25s cubic-bezier(0.22,1,0.36,1)' }}>
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {LINKS.map(({ to, label, icon: Icon }) => {
                const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-white/15 text-gold-300'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              })}
              <div className="border-t border-white/10 mt-2 pt-2 flex items-center gap-3 px-4 pb-2">
                <GraduationCap size={14} className="text-white/40" />
                <span className="text-[11px] text-white/40">
                  Universitas Muhammadiyah Surakarta
                </span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
