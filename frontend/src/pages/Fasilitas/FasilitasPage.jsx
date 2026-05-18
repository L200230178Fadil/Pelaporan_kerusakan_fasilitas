import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Search, Package, Edit2, Trash2, Eye } from 'lucide-react'
import { fasilitasService } from '../../services/api'
import { useFetch, useDebounce } from '../../hooks/useData'
import {
  Button, Badge, Input, Select, Textarea, Modal,
  EmptyState, PageLoader, Card
} from '../../components/ui'
import { getKondisiConfig, fmtDate, clsx } from '../../utils/helpers'
import toast from 'react-hot-toast'
// import { useAuth } from '../../contexts/AuthContext'

const KONDISI_OPTIONS = [
  { value: 'baik',         label: 'Baik'         },
  { value: 'rusak-ringan', label: 'Rusak Ringan'  },
  { value: 'rusak-berat',  label: 'Rusak Berat'   },
]

// ─── Row ─────────────────────────────────────────────────────────────────────
function FasilitasRow({ item, onEdit, onDelete, isAdmin }) {
  const kc = getKondisiConfig(item.kondisi)
  return (
    <tr className="hover:bg-surface-50 transition-colors group">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Package size={14} className="text-primary-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-900">{item.nama}</p>
            <p className="text-xs text-surface-400">{item.kode}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 text-sm text-surface-600">{item.kategori}</td>
      <td className="px-4 py-3.5 text-sm text-surface-600">{item.lokasi}</td>
      <td className="px-4 py-3.5"><Badge className={kc.class}>{kc.label}</Badge></td>
      <td className="px-4 py-3.5 text-sm text-surface-400">{fmtDate(item.created_at)}</td>
      {isAdmin && (
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-primary-50 rounded-lg text-surface-400 hover:text-primary-600 transition-colors">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(item)} className="p-1.5 hover:bg-red-50 rounded-lg text-surface-400 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      )}
    </tr>
  )
}

// ─── Form Modal ───────────────────────────────────────────────────────────────
function FasilitasModal({ open, onClose, item, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: item || {}
  })

  const onSubmit = async (data) => {
    try {
      if (item?.id) {
        await fasilitasService.update(item.id, data)
        toast.success('Fasilitas berhasil diperbarui.')
      } else {
        await fasilitasService.create(data)
        toast.success('Fasilitas berhasil ditambahkan.')
      }
      onSuccess()
      onClose()
      reset()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Gagal menyimpan data.')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit Fasilitas' : 'Tambah Fasilitas'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nama Fasilitas" placeholder="cth. Kursi Kuliah" error={errors.nama?.message}
            {...register('nama', { required: 'Nama wajib diisi.' })} />
          <Input label="Kode Fasilitas" placeholder="cth. KRS-001" error={errors.kode?.message}
            {...register('kode', { required: 'Kode wajib diisi.' })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Kategori" placeholder="cth. Meubelair" {...register('kategori')} />
          <Input label="Lokasi" placeholder="cth. Gedung A Lt.2" {...register('lokasi')} />
        </div>
        <Select label="Kondisi" options={KONDISI_OPTIONS} error={errors.kondisi?.message}
          {...register('kondisi', { required: 'Kondisi wajib dipilih.' })} />
        <Textarea label="Keterangan" placeholder="Deskripsi tambahan..." rows={3} {...register('keterangan')} />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" loading={isSubmitting}>{item ? 'Simpan Perubahan' : 'Tambah Fasilitas'}</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FasilitasPage() {
  const isAdmin = true
  const [search,   setSearch]   = useState('')
  const [kondisi,  setKondisi]  = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem,  setEditItem]  = useState(null)
  const debouncedSearch = useDebounce(search)

  const { data, loading, refetch } = useFetch(
    useCallback((p) => fasilitasService.getAll(p), []),
    { search: debouncedSearch, kondisi }
  )

  const items = data?.data || []

  const handleEdit   = (item) => { setEditItem(item); setModalOpen(true) }
  const handleAdd    = () => { setEditItem(null); setModalOpen(true) }
  const handleDelete = async (item) => {
    if (!confirm(`Hapus fasilitas "${item.nama}"?`)) return
    try {
      await fasilitasService.delete(item.id)
      toast.success('Fasilitas dihapus.')
      refetch()
    } catch { toast.error('Gagal menghapus.') }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div data-animate="1" className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-xl text-surface-900">Inventaris Fasilitas</h2>
          <p className="text-sm text-surface-500 mt-0.5">Data seluruh fasilitas kampus</p>
        </div>
        {isAdmin && (
          <Button onClick={handleAdd}>
            <Plus size={16} /> Tambah Fasilitas
          </Button>
        )}
      </div>

      {/* Filters */}
      <div data-animate="2" className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, kode, lokasi..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-surface-200 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
          />
        </div>
        <select
          value={kondisi} onChange={e => setKondisi(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
        >
          <option value="">Semua Kondisi</option>
          {KONDISI_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="text-xs text-surface-400">{data?.total ?? 0} fasilitas</span>
      </div>

      {/* Table */}
      <div data-animate="3" className="card overflow-hidden">
        {loading ? <PageLoader /> : items.length === 0 ? (
          <EmptyState icon={Package} title="Tidak ada fasilitas" description="Belum ada fasilitas yang sesuai filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100">
                  {['Fasilitas', 'Kategori', 'Lokasi', 'Kondisi', 'Ditambahkan', isAdmin ? 'Aksi' : ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {items.map(item => (
                  <FasilitasRow key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} isAdmin={isAdmin} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FasilitasModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editItem}
        onSuccess={refetch}
      />
    </div>
  )
}
