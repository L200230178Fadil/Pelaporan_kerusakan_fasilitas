import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'

export default function AppLayout() {
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isDark={dark} toggleDark={() => setDark(!dark)} />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-ink-100 py-4 text-center text-xs text-ink-400 font-body dark:border-ink-900">
        SiPeduli — Sistem Pelaporan Fasilitas Kampus &middot; Teknik Informatika UMS 2026
      </footer>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
        }}
      />
    </div>
  )
}
