import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import { GraduationCap, MapPin, Phone, Mail } from 'lucide-react'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-100">
      <Navbar />

      {/* ── Main Content ───────────────────────────── */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="ums-header-bg text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/ums-logo.png" alt="UMS" className="w-10 h-10 object-contain" />
                <div>
                  <p className="font-display font-bold text-white text-base leading-tight">FKI</p>
                  <p className="text-white/50 text-[11px] leading-tight">
                    Fak. Komunikasi & Tek. Informatika
                  </p>
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed max-w-xs">
                Sistem Pelaporan Fasilitas Kampus — memudahkan civitas akademika 
                dalam melaporkan dan memantau perbaikan fasilitas Gedung FKI.
              </p>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
                <div className="w-5 h-0.5 bg-gold-500" />
                Informasi
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/55 text-xs leading-relaxed">
                    Jl. A. Yani Tromol Pos I Pabelan,<br />
                    Kartasura, Surakarta 57102
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={13} className="text-gold-400 flex-shrink-0" />
                  <span className="text-white/55 text-xs">(0271) 717417</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={13} className="text-gold-400 flex-shrink-0" />
                  <span className="text-white/55 text-xs">info@ums.ac.id</span>
                </div>
              </div>
            </div>

            {/* Link */}
            <div>
              <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
                <div className="w-5 h-0.5 bg-gold-500" />
                Tautan
              </h3>
              <ul className="space-y-2">
                {[
                  ['Portal UMS', 'https://www.ums.ac.id'],
                  ['Sistem Akademik', '#'],
                  ['elearning.ums.ac.id', '#'],
                  ['Perpustakaan Digital', '#'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-white/50 text-xs hover:text-gold-400 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row
                          items-center justify-between gap-2">
            <p className="text-white/35 text-[11px] text-center">
              © 2026 Fakultas Komunikasi dan Teknik Informatika — Universitas Muhammadiyah Surakarta
            </p>
            <div className="flex items-center gap-1.5">
              <GraduationCap size={12} className="text-gold-500" />
              <span className="text-white/35 text-[11px]">UMS © 2026</span>
            </div>
          </div>
        </div>
      </footer>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            boxShadow: '0 4px 24px rgba(45,62,168,0.15)',
          },
        }}
      />
    </div>
  )
}
