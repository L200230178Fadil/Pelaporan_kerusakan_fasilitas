import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Wrench, Clock, CheckCircle2, XCircle, ChevronDown, MessageSquare } from 'lucide-react'
import { perbaikanService } from '../../services/api'
import { useFetch } from '../../hooks/useData'
import { Button, Badge, Select, Textarea, Modal, PageLoader, EmptyState } from '../../components/ui'
import { getStatusConfig, fmtDate, fmtRelative, truncate } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

// ─── Kanban Column config ─────────────────────────────────────────────────────
const COLUMNS = [
  { key: 'menunggu', label: 'Menunggu',  icon: Clock,        color: 'text-amber-500',  bg: 'bg-amber-50'  },
  { key: 'diproses', label: 'Diproses',  icon: Wrench,       color: 'text-blue-500',   bg: 'bg-blue-50'   },
  { key: 'selesai',  label: 'Selesai',   icon: CheckCircle2, color: 'text-green-500',  bg: 'bg-green-50'  },
  { key: 'ditolak',  label: 'Ditolak',   icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-50'    },
]

const STATUS_OPTIONS = [
  { value: 'menunggu', label: 'Menunggu'  },
  { value: 'diproses', label: 'Diproses'  },
  { value: 'selesai',  label: 'Selesai'   },
  { value: 'ditolak',  label: 'Ditolak'   },
]

// ─── Update Status Modal ──────────────────────────────────────────────────────
function UpdateStatusModal({ open, onClose, item, onSuccess }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await perbaikanService.updateStatus(item.id, data)
      toast.success('Status berhasil diperbarui.')
      onSuccess()
      onClose()
    } catch { toast.error('Gagal memperbarui status.') }
  }

  return (
    <Modal open={open} onClose={onClose} title="Update Status Perbaikan" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded-xl bg-surface-50 p-3 text-sm text-surface-600">
          <strong className="text-surface-800">{item?.laporan?.fasilitas?.nama}</strong>
          <p className="mt-1 text-xs">{item?.laporan?.deskripsi}</p>
        </div>
        <Select label="Status Baru" options={STATUS_OPTIONS} defaultValue={item?.status}
          {...register('status', { required: true })} />
        <Textarea label="Catatan Teknisi" rows={3} placeholder="Jelaskan progres perbaikan..."
          {...register('catatan')} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" loading={isSubmitting}>Simpan</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Perbaikan Card ───────────────────────────────────────────────────────────
function PerbaikanCard({ item, onUpdate, isAdmin }) {
  const sc = getStatusConfig(item.status || item.laporan?.status)

  return (
    <div className="bg-white rounded-xl border border-surface-100 p-3.5 shadow-sm hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-medium text-sm text-surface-900 flex-1 leading-snug">
          {item.laporan?.fasilitas?.nama || item.fasilitas_nama}
        </p>
        <Badge className={sc.class}>{sc.label}</Badge>
      </div>
      <p className="text-xs text-surface-500 mb-2.5 leading-relaxed">
        {truncate(item.laporan?.deskripsi || item.deskripsi, 80)}
      </p>
      {item.laporan?.fasilitas?.lokasi && (
        <p className="text-xs text-surface-400 mb-2">📍 {item.laporan.fasilitas.lokasi}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-surface-300">{fmtRelative(item.updated_at || item.created_at)}</span>
        {isAdmin && (
          <button onClick={() => onUpdate(item)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:underline">
            Update <ChevronDown size={11} />
          </button>
        )}
      </div>
      {item.catatan && (
        <div className="mt-2.5 pt-2.5 border-t border-surface-50 flex items-start gap-2">
          <MessageSquare size={12} className="text-surface-300 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-surface-400 italic">{truncate(item.catatan, 60)}</p>
        </div>
      )}
    </div>
  )
}

// ─── Kanban Column ────────────────────────────────────────────────────────────
function KanbanColumn({ col, items, onUpdate, isAdmin }) {
  const Icon = col.icon
  return (
    <div className="flex flex-col min-w-[260px] flex-1">
      {/* Column header */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3 ${col.bg}`}>
        <Icon size={15} className={col.color} />
        <span className="text-sm font-semibold text-surface-700">{col.label}</span>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 ${col.color}`}>
          {items.length}
        </span>
      </div>
      {/* Cards */}
      <div className="space-y-2.5 flex-1">
        {items.length === 0 ? (
          <div className="border-2 border-dashed border-surface-100 rounded-xl py-8 text-center">
            <p className="text-xs text-surface-300">Tidak ada item</p>
          </div>
        ) : (
          items.map(item => (
            <PerbaikanCard key={item.id} item={item} onUpdate={onUpdate} isAdmin={isAdmin} />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MonitoringPage() {
  // const { isAdmin } = useAuth()
  const [updateModal, setUpdateModal] = useState(false)
  const [activeItem,  setActiveItem]  = useState(null)

  const { data, loading, refetch } = useFetch(
    useCallback(() => perbaikanService.getAll({ per_page: 999 }), [])
  )

  const items = data?.data || []

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = items.filter(i => (i.status || i.laporan?.status) === col.key)
    return acc
  }, {})

  const handleUpdate = (item) => { setActiveItem(item); setUpdateModal(true) }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div data-animate="1" className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-surface-900">Monitoring Perbaikan</h2>
          <p className="text-sm text-surface-500 mt-0.5">Pantau status perbaikan fasilitas kampus</p>
        </div>
        {/* Summary pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {COLUMNS.map(col => (
            <div key={col.key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${col.bg} ${col.color}`}>
              <col.icon size={12} />
              {grouped[col.key]?.length ?? 0} {col.label}
            </div>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      {loading ? <PageLoader /> : items.length === 0 ? (
        <div className="card">
          <EmptyState icon={Wrench} title="Belum ada data perbaikan" description="Data perbaikan akan muncul setelah ada laporan yang masuk." />
        </div>
      ) : (
        <div data-animate="2" className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.key}
              col={col}
              items={grouped[col.key] || []}
              onUpdate={handleUpdate}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {activeItem && (
        <UpdateStatusModal
          open={updateModal}
          onClose={() => setUpdateModal(false)}
          item={activeItem}
          onSuccess={refetch}
        />
      )}
    </div>
  )
}
