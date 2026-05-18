import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, Clock, Wrench, CheckCircle2,
  Search, Plus, ArrowRight, RefreshCw, Filter
} from 'lucide-react'
import { laporanService } from '../services/api'
import { getStatus, fmtDate, fmtRelative, truncate } from '../utils/helpers'
import { Badge, EmptyState, PageLoader } from '../components/ui'

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, delay }) {
  const colorMap = {
    amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
    blue:  'bg-blue-50  text-blue-600  border-blue-100  dark:bg-blue-950/30  dark:text-blue-400  dark:border-blue-900/50',
    green: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50',
    ink:   'bg-ink-100  text-ink-600   border-ink-200  dark:bg-ink-800/30   dark:text-ink-400   dark:border-ink-700/50',
  }
  return (
    <div data-anim={delay}
      className="card p-5 flex items-center gap-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow">
      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-ink-900">{value}</p>
        <p className="text-xs text-ink-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ─── Laporan Row Card ─────────────────────────────────────────────────────────
function LaporanCard({ item, delay }) {
  const sc = getStatus(item.status)
  return (
    <div data-anim={delay}
      className="card p-4 flex gap-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-shadow group">
      
      {/* foto thumbnail */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-ink-100 border border-ink-100 shadow-sm relative">
          {item.foto_url
            ? <img src={item.foto_url} alt="foto" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-ink-300" />
              </div>
          }
          <div className="absolute top-0 left-0 bg-ink-900/40 text-[8px] text-white px-1 rounded-br-md">Awal</div>
        </div>
        {item.foto_perbaikan_url && (
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-green-50 border border-green-200 shadow-sm relative">
            <img src={item.foto_perbaikan_url} alt="foto perbaikan" className="w-full h-full object-cover" />
            <div className="absolute top-0 left-0 bg-green-600/60 text-[8px] text-white px-1 rounded-br-md">Fix</div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-sm text-ink-900 truncate">{item.nama_fasilitas}</p>
            <p className="text-xs text-ink-500 mt-0.5">📍 {item.tempat}</p>
          </div>
          <Badge className={sc.cls + ' flex-shrink-0'}>{sc.label}</Badge>
        </div>
        
        <div className="mt-2 space-y-1.5">
          <p className="text-sm text-ink-600 leading-relaxed italic border-l-2 border-ink-100 pl-3">
            "{truncate(item.deskripsi, 100)}"
          </p>
          {item.keterangan_perbaikan && (
            <div className="bg-green-50/50 p-2 rounded-lg border border-green-100/50">
              <p className="text-[11px] font-bold text-green-700 uppercase tracking-wider mb-0.5">Hasil Perbaikan:</p>
              <p className="text-xs text-green-800 leading-relaxed">
                {item.keterangan_perbaikan}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-ink-50">
          <span className="text-xs text-ink-400">
            {item.role === 'mahasiswa'
              ? `${item.nama} · ${item.prodi}`
              : `${item.nama} · ${item.role === 'dosen' ? 'Dosen' : 'Staf'}`}
          </span>
          <span className="text-ink-200">·</span>
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
      
      // Handle Laravel Paginator Structure: d.data is the paginator, d.data.data is the array
      if (d.data && d.data.data) {
        setItems(d.data.data)
        setMeta(d.data)
      } else {
        setItems(Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []))
        setMeta(d.meta || d)
      }

      if (d.stats) setStats(d.stats)
    } catch (err) {
      console.error('Load error:', err)
      // mock data ketika API belum ada atau error
      const mock = [
        { id:1, nama:'Budi Santoso', role:'mahasiswa', fakultas:'FKI', prodi:'Teknik Informatika',
          nama_fasilitas:'Kursi Kuliah', tempat:'Ruang J403', deskripsi:'Sandaran kursi patah dan membahayakan.',
          status:'menunggu', foto_url:null, created_at: new Date().toISOString() },
        { id:2, nama:'Dr. Hendra', role:'dosen', nama_fasilitas:'Proyektor',
          tempat:'Ruang J302', deskripsi:'Proyektor tidak bisa menyala sejak kemarin pagi.',
          status:'diproses', foto_url:null, created_at: new Date(Date.now()-86400000).toISOString() },
        { id:3, nama:'Sari Dewi', role:'staf', nama_fasilitas:'AC',
          tempat:'Depan Ruang J101', deskripsi:'AC bocor, lantai basah dan licin.',
          status:'selesai', foto_url:null, created_at: new Date(Date.now()-172800000).toISOString() },
      ]
      const filtered = mock.filter(m =>
        (!search || m.nama_fasilitas.toLowerCase().includes(search.toLowerCase()) || m.deskripsi.toLowerCase().includes(search.toLowerCase())) &&
        (!status || m.status === status)
      )
      setItems(filtered)
      setMeta({ current_page: 1, last_page: 1 })
      setStats({ menunggu: 1, diproses: 1, selesai: 1, total: 3 })
    } finally {
      setLoading(false)
    }
  }, [search, status, page])

  useEffect(() => { load() }, [load])

  const STATUS_FILTERS = [
    { value: '', label: 'Semua' },
    { value: 'menunggu', label: 'Menunggu' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'selesai',  label: 'Selesai'  },
  ]

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div data-anim="1">
        <h1 className="font-display text-3xl font-bold text-ink-900 leading-tight">
          Laporan Fasilitas<br />
          <span className="text-brand-600">Gedung J — <span className="text-accent-500">UMS</span></span>
        </h1>
        <p className="text-ink-500 mt-2 text-sm max-w-lg">
          Pantau status laporan kerusakan fasilitas kampus secara transparan.
          Semua warga kampus dapat melaporkan dan memantau progres perbaikan.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard delay="1" icon={AlertTriangle}  label="Total Laporan"    value={stats.total}    color="ink"   />
        <StatCard delay="2" icon={Clock}           label="Menunggu"         value={stats.menunggu} color="amber" />
        <StatCard delay="3" icon={Wrench}          label="Diproses"         value={stats.diproses} color="blue"  />
        <StatCard delay="4" icon={CheckCircle2}    label="Selesai"          value={stats.selesai}  color="green" />
      </div>

      {/* CTA */}
      <div data-anim="5"
        className="rounded-2xl bg-brand-600 text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-brand-500/30 border border-brand-500">
        <div>
          <p className="font-display font-bold text-lg text-accent-400">Ada fasilitas yang rusak?</p>
          <p className="text-brand-100 text-sm mt-0.5">Laporkan sekarang dan kami akan segera menindaklanjuti.</p>
        </div>
        <Link to="/laporan" className="btn-secondary bg-accent-500 text-ink-900 hover:bg-accent-600 border-none shadow-sm flex-shrink-0 font-bold transition-transform hover:-translate-y-0.5">
          <Plus size={16} /> Buat Laporan
        </Link>
      </div>

      {/* Filter & search */}
      <div data-anim="6" className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari fasilitas atau deskripsi..."
            className="field pl-10"
          />
        </div>
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatus(f.value); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                status === f.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-ink-50 border border-ink-200 text-ink-600 hover:bg-ink-100'
              } shadow-sm`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={load} className="p-2.5 hover:bg-ink-100 rounded-xl transition-colors" title="Refresh">
          <RefreshCw size={15} className="text-ink-400" />
        </button>
      </div>

      {/* List */}
      {loading ? <PageLoader /> : items.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={AlertTriangle}
            title="Tidak ada laporan"
            desc="Belum ada laporan yang sesuai dengan pencarian."
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
            <LaporanCard key={item.id} item={item} delay={String((i % 5) + 1)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
            className="btn-secondary px-4 py-2 text-xs disabled:opacity-40">← Sebelumnya</button>
          <span className="text-sm text-ink-500">Halaman {page} / {meta.last_page}</span>
          <button onClick={() => setPage(p => p+1)} disabled={page >= meta.last_page}
            className="btn-secondary px-4 py-2 text-xs disabled:opacity-40">Berikutnya →</button>
        </div>
      )}
    </div>
  )
}
