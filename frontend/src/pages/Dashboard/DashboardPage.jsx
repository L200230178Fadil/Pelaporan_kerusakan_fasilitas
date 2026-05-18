import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Package, AlertTriangle, Wrench, CheckCircle2,
  Clock, ArrowRight, TrendingUp
} from 'lucide-react'
import { dashboardService, laporanService } from '../../services/api'
import { Card, Badge, PageLoader } from '../../components/ui'
import { fmtDate, fmtRelative, getStatusConfig } from '../../utils/helpers'
// import { useAuth } from '../../contexts/AuthContext'

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub, delay }) {
  const colors = {
    blue:   'bg-primary-50 text-primary-600',
    amber:  'bg-amber-50 text-amber-600',
    green:  'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  return (
    <div data-animate={delay} className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-surface-500">{label}</p>
        <p className="font-display font-bold text-2xl text-surface-900 mt-0.5">{value ?? '—'}</p>
        {sub && <p className="text-xs text-surface-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-surface-100 rounded-xl px-4 py-3 shadow-card text-sm">
      <p className="font-medium text-surface-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  // const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [trend,   setTrend]   = useState([])
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardService.getSummary(),
      dashboardService.getTrend(),
      laporanService.getAll({ per_page: 5, sort: 'latest' }),
    ]).then(([s, t, l]) => {
      setSummary(s.data)
      setTrend(t.data?.data || [])
      setRecent(l.data?.data || [])
    }).catch(() => {
      // Use mock data saat API belum tersedia
      setSummary({ total_fasilitas: 142, laporan_aktif: 18, perbaikan_selesai: 95, menunggu_tindak: 7 })
      setTrend([
        { bulan: 'Nov', laporan: 12, selesai: 9  },
        { bulan: 'Des', laporan: 18, selesai: 14 },
        { bulan: 'Jan', laporan: 22, selesai: 17 },
        { bulan: 'Feb', laporan: 15, selesai: 13 },
        { bulan: 'Mar', laporan: 28, selesai: 22 },
        { bulan: 'Apr', laporan: 20, selesai: 18 },
      ])
      setRecent([
        { id:1, fasilitas_nama:'Kursi Ruang A201', deskripsi:'Sandaran kursi patah', status:'menunggu',  created_at: new Date().toISOString() },
        { id:2, fasilitas_nama:'Proyektor Lab B',  deskripsi:'Tidak bisa menyala',  status:'diproses',  created_at: new Date(Date.now()-86400000).toISOString() },
        { id:3, fasilitas_nama:'AC Ruang Dosen',   deskripsi:'Bocor dan bising',    status:'selesai',   created_at: new Date(Date.now()-172800000).toISOString() },
      ])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <div data-animate="1">
        <h2 className="font-display font-bold text-xl text-surface-900">
          Selamat datang 👋
        </h2>
        <p className="text-sm text-surface-500 mt-0.5">
          {new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard delay="1" label="Total Fasilitas"     value={summary?.total_fasilitas}    icon={Package}       color="blue"   />
        <StatCard delay="2" label="Laporan Aktif"       value={summary?.laporan_aktif}       icon={AlertTriangle} color="amber"  sub="Perlu perhatian" />
        <StatCard delay="3" label="Perbaikan Selesai"   value={summary?.perbaikan_selesai}   icon={CheckCircle2}  color="green"  sub="Bulan ini" />
        <StatCard delay="4" label="Menunggu Tindak"     value={summary?.menunggu_tindak}     icon={Clock}         color="purple" />
      </div>

      {/* Chart + Recent */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Trend Chart */}
        <div data-animate="5" className="card p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-surface-900">Tren Laporan</h3>
              <p className="text-xs text-surface-400 mt-0.5">6 bulan terakhir</p>
            </div>
            <TrendingUp size={18} className="text-primary-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gLaporan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2d68ff" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2d68ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSelesai" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#a8b4d0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a8b4d0' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="laporan" name="Laporan" stroke="#2d68ff" strokeWidth={2} fill="url(#gLaporan)" dot={false} />
              <Area type="monotone" dataKey="selesai" name="Selesai" stroke="#22c55e" strokeWidth={2} fill="url(#gSelesai)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent laporan */}
        <div data-animate="6" className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-surface-900">Laporan Terkini</h3>
            <Link to="/laporan" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              Lihat semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recent.length === 0 && (
              <p className="text-sm text-surface-400 text-center py-6">Belum ada laporan.</p>
            )}
            {recent.map(lap => {
              const sc = getStatusConfig(lap.status)
              return (
                <div key={lap.id} className="flex items-start gap-3 pb-3 border-b border-surface-50 last:border-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle size={14} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800 truncate">{lap.fasilitas_nama || lap.fasilitas?.nama}</p>
                    <p className="text-xs text-surface-400 truncate">{lap.deskripsi}</p>
                    <p className="text-[10px] text-surface-300 mt-0.5">{fmtRelative(lap.created_at)}</p>
                  </div>
                  <Badge className={sc.class}>{sc.label}</Badge>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
