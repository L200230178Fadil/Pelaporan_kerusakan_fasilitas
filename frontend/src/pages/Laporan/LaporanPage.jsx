import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Search, AlertTriangle, ImagePlus, X } from 'lucide-react'
import { laporanService, fasilitasService } from '../../services/api'
import { useFetch, useDebounce } from '../../hooks/useData'
import {
  Button, Badge, Input, Select, Textarea, Modal,
  EmptyState, PageLoader
} from '../../components/ui'
import { getStatusConfig, fmtDate, fmtRelative, truncate } from '../../utils/helpers'
import toast from 'react-hot-toast'
// import { useAuth } from '../../contexts/AuthContext'

const STATUS_OPTIONS = [
  { value: 'menunggu', label: 'Menunggu'  },
  { value: 'diproses', label: 'Diproses'  },
  { value: 'selesai',  label: 'Selesai'   },
  { value: 'ditolak',  label: 'Ditolak'   },
]

const PRIORITAS_OPTIONS = [
  { value: 'rendah',  label: 'Rendah'  },
  { value: 'sedang',  label: 'Sedang'  },
  { value: 'tinggi',  label: 'Tinggi'  },
  { value: 'darurat', label: 'Darurat' },
]

// ─── Form Laporan Modal ───────────────────────────────────────────────────────
function FormLaporanModal({ open, onClose, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  const [preview, setPreview]   = useState(null)
  const { data: fasData } = useFetch(useCallback(() => fasilitasService.getAll({ per_page: 999 }), []))
  const fasOptions = (fasData?.data || []).map(f => ({ value: f.id, label: `${f.nama} (${f.lokasi})` }))

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v) form.append(k, v) })
    const file = document.getElementById('foto-input')?.files?.[0]
    if (file) form.append('foto', file)
    try {
      await laporanService.create(form)
      toast.success('Laporan berhasil dikirim!')
      onSuccess()
      onClose()
      reset()
      setPreview(null)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal mengirim laporan.')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Buat Laporan Kerusakan" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select label="Fasilitas yang Rusak" options={fasOptions} error={errors.fasilitas_id?.message}
          {...register('fasilitas_id', { required: 'Pilih fasilitas terlebih dahulu.' })} />
        <Textarea label="Deskripsi Kerusakan" rows={3} placeholder="Jelaskan kerusakan secara detail..."
          error={errors.deskripsi?.message}
          {...register('deskripsi', { required: 'Deskripsi wajib diisi.', minLength: { value: 20, message: 'Minimal 20 karakter.' } })} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Prioritas" options={PRIORITAS_OPTIONS} {...register('prioritas')} />
          <Input label="Lokasi Spesifik" placeholder="cth. Baris 3 bangku 5"
            {...register('lokasi_detail')} />
        </div>

        {/* File upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-surface-700">Foto Kerusakan (opsional)</label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-surface-200 rounded-xl p-5 cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition-all group">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview" className="h-32 rounded-lg object-cover" />
                <button type="button" onClick={(e) => { e.preventDefault(); setPreview(null) }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <>
                <ImagePlus size={24} className="text-surface-300 group-hover:text-primary-400 transition-colors" />
                <p className="text-sm text-surface-400">Klik atau seret foto ke sini</p>
                <p className="text-xs text-surface-300">JPG, PNG maks. 5MB</p>
              </>
            )}
            <input id="foto-input" type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" loading={isSubmitting}>Kirim Laporan</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Laporan Card ─────────────────────────────────────────────────────────────
function LaporanCard({ item, delay }) {
  const sc = getStatusConfig(item.status)
  const PRIORITAS_COLOR = {
    rendah:  'text-green-600 bg-green-50',
    sedang:  'text-blue-600 bg-blue-50',
    tinggi:  'text-amber-600 bg-amber-50',
    darurat: 'text-red-600 bg-red-50',
  }
  return (
    <div data-animate={delay} className="card p-4 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-surface-900 text-sm">{item.fasilitas?.nama || item.fasilitas_nama}</p>
            <p className="text-xs text-surface-500 mt-0.5">{item.fasilitas?.lokasi || item.lokasi}</p>
            <p className="text-sm text-surface-600 mt-2">{truncate(item.deskripsi, 100)}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-surface-400">{fmtRelative(item.created_at)}</span>
              {item.pelapor?.name && <span className="text-xs text-surface-400">oleh {item.pelapor.name}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <Badge className={sc.class}>{sc.label}</Badge>
          {item.prioritas && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${PRIORITAS_COLOR[item.prioritas] || 'text-surface-500 bg-surface-100'}`}>
              {item.prioritas}
            </span>
          )}
        </div>
      </div>
      {item.foto_url && (
        <img src={item.foto_url} alt="kerusakan" className="mt-3 h-40 w-full object-cover rounded-xl" />
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LaporanPage() {
  const isAdmin = true
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')
  const [modal,    setModal]    = useState(false)
  const debouncedSearch = useDebounce(search)

  const { data, loading, refetch } = useFetch(
    useCallback((p) => laporanService.getAll(p), []),
    { search: debouncedSearch, status }
  )
  const items = data?.data || []

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div data-animate="1" className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-xl text-surface-900">Laporan Kerusakan</h2>
          <p className="text-sm text-surface-500 mt-0.5">Laporkan kerusakan fasilitas kampus</p>
        </div>
        <Button onClick={() => setModal(true)}>
          <Plus size={16} /> Buat Laporan
        </Button>
      </div>

      {/* Filters */}
      <div data-animate="2" className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari fasilitas, deskripsi..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-surface-200 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
          />
        </div>
        <select
          value={status} onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
        >
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="text-xs text-surface-400">{data?.total ?? 0} laporan</span>
      </div>

      {/* List */}
      {loading ? <PageLoader /> : items.length === 0 ? (
        <div className="card">
          <EmptyState icon={AlertTriangle} title="Tidak ada laporan" description="Belum ada laporan kerusakan yang sesuai filter."
            action={<Button onClick={() => setModal(true)}><Plus size={16}/> Buat Laporan</Button>} />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <LaporanCard key={item.id} item={item} delay={String((i % 5) + 1)} />
          ))}
        </div>
      )}

      <FormLaporanModal open={modal} onClose={() => setModal(false)} onSuccess={refetch} />
    </div>
  )
}
