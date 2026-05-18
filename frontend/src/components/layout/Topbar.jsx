import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/':           'Dashboard',
  '/fasilitas':  'Inventaris Fasilitas',
  '/laporan':    'Laporan Kerusakan',
  '/monitoring': 'Monitoring Perbaikan',
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'Halaman'

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3.5 bg-white/90 backdrop-blur border-b border-surface-100">
      {/* Mobile menu toggle */}
      <button onClick={onMenuClick} className="p-2 hover:bg-surface-100 rounded-lg transition-colors lg:hidden">
        <Menu size={20} className="text-surface-600" />
      </button>

      <h1 className="font-display font-semibold text-surface-900 text-base flex-1">{title}</h1>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button className="p-2 hover:bg-surface-100 rounded-lg transition-colors relative">
          <Bell size={18} className="text-surface-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
