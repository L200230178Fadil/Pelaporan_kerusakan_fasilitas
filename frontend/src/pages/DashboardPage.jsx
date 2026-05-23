import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, Clock, Wrench, CheckCircle2,
  Search, Plus, ArrowRight, RefreshCw,
  Building2, Users, Award, TrendingUp,
  ChevronRight, FileText, MapPin
} from 'lucide-react'
import { laporanService } from '../services/api'
import { getStatus, fmtDate, fmtRelative, truncate } from '../utils/helpers'
import { Badge, EmptyState, PageLoader } from '../components/ui'

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, delay, suffix = '' }) {
  const palette = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-brand-600 text-white',    val: 'text-brand-700',   border: 'border-brand-100'  },
    amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-500 text-white',    val: 'text-amber-700',   border: 'border-amber-100'  },
    green:  { bg: 'bg-emerald-50',icon: 'bg-emerald-500 text-white',  val: 'text-emerald-700', border: 'border-emerald-100'},
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500 text-white',   val: 'text-purple-700',  border: 'border-purple-100' },
  }
  const p = palette[color] || palette.blue
  return (
    <div data-anim={delay}
      className={`card card-hover p-5 flex items-center gap-4 border ${p.border} ${p.bg}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${p.icon}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className={`text-2xl font-display font-bold leading-none ${p.val}`}>
          {value}<span className="text-base">{suffix}</span>
        </p>
        <p className="text-xs text-ink-500 mt-1 leading-tight">{label}</p>
      </div>
    </div>
  )
}

// ─── Info Highlight Card ───────────────────────────────────────────────────────
function HighlightCard({ icon: Icon, title, desc, color, delay }) {
  const palette = {
    brand:  'from-brand-600 to-brand-700',
    gold:   'from-gold-500 to-gold-600',
    green:  'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
  }
  return (
    <div data-anim={delay}
      className="card card-hover p-5 group overflow-hidden relative">
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${palette[color] || palette.brand} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${palette[color] || palette.brand} flex items-center justify-center mb-3 shadow-sm`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="font-display font-bold text-ink-900 text-sm leading-tight">{title}</p>
      <p className="text-xs text-ink-500 mt-1.5 leading-relaxed">{desc}</p>
    </div>
  )
}

// ─── Laporan Row Card ─────────────────────────────────────────────────────────
function LaporanCard({ item, delay }) {
  const sc = getStatus(item.status)
  const statusColor = {
    menunggu: 'border-l-amber-400',
    diproses:  'border-l-brand-500',
    selesai:   'border-l-emerald-500',
    ditolak:   'border-l-red-400',
  }
  return (
    <div data-anim={delay}
      className={`card card-hover p-4 sm:p-5 flex gap-4 border-l-4 ${statusColor[item.status] || 'border-l-ink-200'}`}>

      {/* foto thumbnail */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-ink-100 border border-ink-200 shadow-sm relative">
          {item.foto_url
            ? <img src={item.foto_url} alt="foto" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center">
                <Building2 size={20} className="text-ink-300" />
              </div>
          }
          <div className="absolute top-0 left-0 bg-ink-900/50 text-[8px] text-white px-1 py-0.5 rounded-br-md font-medium">
            Awal
          </div>
        </div>
        {item.foto_perbaikan_url && (
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-emerald-50 border border-emerald-200 shadow-sm relative">
            <img src={item.foto_perbaikan_url} alt="foto perbaikan" className="w-full h-full object-cover" />
            <div className="absolute top-0 left-0 bg-emerald-600/70 text-[8px] text-white px-1 py-0.5 rounded-br-md font-medium">Fix</div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-ink-900 truncate">{item.nama_fasilitas}</p>
            <p className="text-xs text-ink-500 mt-0.5 flex items-center gap-1">
              <MapPin size={10} className="flex-shrink-0" /> {item.tempat}
            </p>
          </div>
          <Badge className={`${sc.cls} flex-shrink-0 text-xs px-2.5 py-0.5 rounded-full font-semibold`}>
            {sc.label}
          </Badge>
        </div>

        <div className="mt-2.5 space-y-2">
          <p className="text-sm text-ink-600 leading-relaxed italic border-l-2 border-brand-200 pl-3">
            "{truncate(item.deskripsi, 100)}"
          </p>
          {item.keterangan_perbaikan && (
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                ✓ Hasil Perbaikan:
              </p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {item.keterangan_perbaikan}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-2.5 border-t border-ink-100">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
              <span className="text-[9px] font-bold text-brand-700">
                {item.nama?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-xs text-ink-500">
              {item.role === 'mahasiswa'
                ? `${item.nama} · ${item.prodi}`
                : `${item.nama} · ${item.role === 'dosen' ? 'Dosen' : 'Staf'}`}
            </span>
          </div>
          <span className="text-ink-300 text-xs">·</span>
          <span className="text-xs text-ink-400">{fmtRelative(item.created_at)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [items,   setItems]   = useState([])
  const [stats,   setStats]   = useState({ menunggu: 0, diproses: 0, selesai: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('')
  const [page,    setPage]    = useState(1)
  const [meta,    setMeta]    = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await laporanService.getAll({ search, status, page, per_page: 10 })
      const d = res.data
      if (d.data && d.data.data) {
        setItems(d.data.data)
        setMeta(d.data)
      } else {
        setItems(Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []))
        setMeta(d.meta || d)
      }
      if (d.stats) setStats(d.stats)
    } catch {
      const mock = [
        { id:1, nama:'Budi Santoso', role:'mahasiswa', prodi:'Teknik Informatika',
          nama_fasilitas:'Kursi Kuliah', tempat:'Ruang J403',
          deskripsi:'Sandaran kursi patah dan membahayakan pengguna.',
          status:'menunggu', foto_url:null, created_at: new Date().toISOString() },
        { id:2, nama:'Dr. Hendra W.', role:'dosen',
          nama_fasilitas:'Proyektor Epson EB-X51', tempat:'Ruang J302',
          deskripsi:'Proyektor tidak bisa menyala, lampu indikator merah berkedip.',
          status:'diproses', foto_url:null, created_at: new Date(Date.now()-86400000).toISOString() },
        { id:3, nama:'Sari Dewi', role:'staf',
          nama_fasilitas:'AC Daikin 1.5 PK', tempat:'Lobby Gedung J',
          deskripsi:'AC bocor, air menetes ke lantai sehingga licin.',
          status:'selesai', foto_url:null,
          keterangan_perbaikan: 'Filter dibersihkan, pipa drain diperbaiki.',
          created_at: new Date(Date.now()-172800000).toISOString() },
        { id:4, nama:'Ahmad Rizky', role:'mahasiswa', prodi:'Ilmu Komunikasi',
          nama_fasilitas:'Toilet Lantai 3', tempat:'Gedung J Lt.3',
          deskripsi:'Keran air tidak bisa mati otomatis, air terus mengalir.',
          status:'menunggu', foto_url:null, created_at: new Date(Date.now()-3600000).toISOString() },
      ]
      const filtered = mock.filter(m =>
        (!search || m.nama_fasilitas.toLowerCase().includes(search.toLowerCase()) ||
         m.deskripsi.toLowerCase().includes(search.toLowerCase())) &&
        (!status || m.status === status)
      )
      setItems(filtered)
      setMeta({ current_page: 1, last_page: 1 })
      setStats({ menunggu: 2, diproses: 1, selesai: 1, total: 4 })
    } finally {
      setLoading(false)
    }
  }, [search, status, page])

  useEffect(() => { load() }, [load])

  const STATUS_FILTERS = [
    { value: '', label: 'Semua' },
    { value: 'menunggu', label: '⏳ Menunggu' },
    { value: 'diproses', label: '🔧 Diproses' },
    { value: 'selesai',  label: '✅ Selesai'  },
  ]

  return (
    <div>
      {/* ── Hero Banner (UMS style) ─────────────────── */}
      <div className="hero-banner">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* Left: text */}
            <div data-anim="1">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15
                              text-gold-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
                Sistem Pelaporan Aktif
              </div>
              <h1 className="font-display font-bold text-white text-3xl sm:text-4xl leading-tight">
                Sistem Pelaporan<br />
                <span className="text-gold-400">Fasilitas Kampus</span>
              </h1>
              <p className="text-white/65 mt-3 text-sm sm:text-base leading-relaxed max-w-md">
                Platform resmi Fakultas Komunikasi dan Teknik Informatika untuk 
                melaporkan, memantau, dan menindaklanjuti kerusakan fasilitas secara transparan.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/laporan"
                  className="btn-gold flex items-center gap-2 shadow-gold text-sm">
                  <Plus size={15} /> Buat Laporan
                </Link>
                <a href="#laporan-list"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm
                             font-semibold text-white border border-white/20 hover:bg-white/10 transition-all">
                  Lihat Semua <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Right: Quick stats preview */}
            <div data-anim="2" className="hidden lg:grid grid-cols-2 gap-3">
              {[
                { label: 'Total Laporan',    val: stats.total,    icon: FileText,      bg: 'bg-white/10 border-white/15' },
                { label: 'Menunggu Proses',  val: stats.menunggu, icon: Clock,         bg: 'bg-amber-500/20 border-amber-400/20' },
                { label: 'Sedang Diproses',  val: stats.diproses, icon: Wrench,        bg: 'bg-blue-500/20 border-blue-400/20' },
                { label: 'Selesai',          val: stats.selesai,  icon: CheckCircle2,  bg: 'bg-emerald-500/20 border-emerald-400/20' },
              ].map(({ label, val, icon: Icon, bg }) => (
                <div key={label} className={`glass ${bg} rounded-2xl p-4 flex items-center gap-3`}>
                  <Icon size={20} className="text-white/70 flex-shrink-0" />
                  <div>
                    <p className="text-white font-display font-bold text-2xl leading-none">{val}</p>
                    <p className="text-white/55 text-xs mt-1">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">

        {/* ── Stats Row (mobile visible) ────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard delay="1" icon={FileText}     label="Total Laporan"   value={stats.total}    color="blue"   />
          <StatCard delay="2" icon={Clock}         label="Menunggu"        value={stats.menunggu} color="amber"  />
          <StatCard delay="3" icon={Wrench}        label="Diproses"        value={stats.diproses} color="purple" />
          <StatCard delay="4" icon={CheckCircle2}  label="Selesai"         value={stats.selesai}  color="green"  />
        </div>

        {/* ── Highlights ────────────────────────────── */}
        <div data-anim="5">
          <div className="flex items-center gap-3 mb-5">
            <div>
              <h2 className="section-title">Layanan FKI</h2>
              <div className="section-title-line" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <HighlightCard delay="5" icon={AlertTriangle} color="brand"
              title="Laporan Kerusakan"
              desc="Sampaikan laporan kerusakan fasilitas gedung dengan mudah dan cepat." />
            <HighlightCard delay="6" icon={TrendingUp} color="gold"
              title="Monitoring Real-time"
              desc="Pantau status perbaikan secara langsung dan transparan setiap saat." />
            <HighlightCard delay="7" icon={Users} color="green"
              title="Untuk Semua Civitas"
              desc="Mahasiswa, dosen, dan staf dapat berpartisipasi dalam pelaporan." />
            <HighlightCard delay="8" icon={Award} color="purple"
              title="Fasilitas Terjaga"
              desc="Memastikan fasilitas kampus selalu dalam kondisi prima untuk kegiatan akademik." />
          </div>
        </div>

        {/* ── CTA Banner ────────────────────────────── */}
        <div data-anim="5"
          className="rounded-2xl overflow-hidden bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500
                     p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5
                     shadow-ums-lg relative">
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-4 w-28 h-28 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              <span className="text-gold-300 text-xs font-semibold uppercase tracking-wider">
                Perlu Bantuan?
              </span>
            </div>
            <p className="font-display font-bold text-xl text-white leading-tight">
              Ada fasilitas yang rusak?
            </p>
            <p className="text-white/65 text-sm mt-1.5 max-w-sm">
              Laporkan sekarang — tim teknisi kami siap menindaklanjuti laporan Anda.
            </p>
          </div>
          <Link to="/laporan"
            className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-gold-500 hover:bg-gold-400 text-white font-bold text-sm
                       transition-all shadow-gold hover:shadow-none hover:-translate-y-0.5
                       flex-shrink-0">
            <Plus size={16} /> Buat Laporan Sekarang
          </Link>
        </div>

        {/* ── Laporan List ──────────────────────────── */}
        <div id="laporan-list">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="section-title">Daftar Laporan</h2>
              <div className="section-title-line" />
            </div>
            <Link to="/laporan"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600
                         hover:text-brand-700 transition-colors group">
              Buat Laporan
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Filter & Search */}
          <div className="card p-4 mb-5">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[180px]">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Cari fasilitas atau deskripsi..."
                  className="field pl-10 py-2.5 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => { setStatus(f.value); setPage(1) }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      status === f.value
                        ? 'bg-brand-600 text-white shadow-ums'
                        : 'bg-ink-100 border border-ink-200 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button onClick={load}
                className="p-2.5 hover:bg-ink-100 rounded-xl transition-colors border border-ink-200"
                title="Refresh">
                <RefreshCw size={14} className="text-ink-400" />
              </button>
            </div>
          </div>

          {/* List */}
          {loading ? <PageLoader /> : items.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={AlertTriangle}
                title="Tidak ada laporan"
                desc="Belum ada laporan yang sesuai filter pencarian Anda."
                action={
                  <Link to="/laporan" className="btn-primary mt-2">
                    <Plus size={15} /> Buat Laporan Pertama
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, i) => (
                <LaporanCard key={item.id} item={item} delay={String((i % 6) + 1)} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-2 text-xs disabled:opacity-40"
              >
                ← Sebelumnya
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      page === p
                        ? 'bg-brand-600 text-white shadow-ums'
                        : 'text-ink-500 hover:bg-ink-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= meta.last_page}
                className="btn-secondary px-4 py-2 text-xs disabled:opacity-40"
              >
                Berikutnya →
              </button>
            </div>
          )}
        </div>

        {/* ── Info Banner UMS ───────────────────────── */}
        <div data-anim="6" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Building2, label: 'Gedung FKI', val: 'Gedung J & K', color: 'text-brand-600 bg-brand-50' },
            { icon: Users,     label: 'Civitas Akademika', val: '5.000+ Pengguna', color: 'text-emerald-600 bg-emerald-50' },
            { icon: Award,     label: 'Akreditasi', val: 'Unggul (A)', color: 'text-gold-600 bg-gold-50' },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs text-ink-400 font-medium">{label}</p>
                <p className="font-display font-bold text-ink-900 text-base leading-tight mt-0.5">{val}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
