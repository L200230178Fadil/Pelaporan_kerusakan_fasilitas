import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  ChevronLeft, User, GraduationCap, Briefcase,
  MapPin, FileText, ImagePlus, X, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { laporanService } from '../services/api'
import { FAKULTAS_LIST, PRODI_MAP } from '../utils/helpers'
import { FieldGroup, Spinner } from '../components/ui'
import toast from 'react-hot-toast'

// ─── Role selector card ───────────────────────────────────────────────────────
function RoleCard({ role, icon: Icon, label, desc, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all w-full ${
        selected
          ? 'border-brand-500 bg-brand-50'
          : 'border-ink-200 bg-ink-50 hover:border-ink-300 hover:bg-ink-100'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        selected ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'
      }`}>
        <Icon size={18} />
      </div>
      <div>
        <p className={`font-medium text-sm ${selected ? 'text-brand-700' : 'text-ink-800'}`}>{label}</p>
        <p className="text-xs text-ink-400 mt-0.5">{desc}</p>
      </div>
    </button>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-5 text-center max-w-sm mx-auto"
         style={{ animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards' }}>
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={40} className="text-green-600" />
      </div>
      <div>
        <h2 className="font-display font-bold text-2xl text-ink-900">Laporan Terkirim!</h2>
        <p className="text-ink-500 mt-2 text-sm leading-relaxed">
          Terima kasih. Laporan Anda telah diterima dan akan segera ditindaklanjuti oleh tim pemeliharaan.
        </p>
      </div>
      <div className="flex gap-3 mt-2">
        <button onClick={onReset} className="btn-secondary">Buat Laporan Lain</button>
        <Link to="/" className="btn-primary bg-accent-500 text-ink-900 hover:bg-accent-600 border-none shadow-sm font-bold transition-transform hover:-translate-y-0.5">Lihat Dashboard</Link>
      </div>
    </div>
  )
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function FormLaporanPage() {
  const navigate = useNavigate()
  const [role,      setRole]      = useState('')        // 'mahasiswa' | 'dosen' | 'staf'
  const [fakultas,  setFakultas]  = useState('')
  const [foto,      setFoto]      = useState(null)
  const [fotoURL,   setFotoURL]   = useState(null)
  const [success,   setSuccess]   = useState(false)
  const [submitting,setSubmitting]= useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()

  const prodiList = PRODI_MAP[fakultas] || []

  const handleFoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Ukuran foto maksimal 2MB.'); return }
    setFoto(file)
    setFotoURL(URL.createObjectURL(file))
  }

  const removeFoto = () => { setFoto(null); setFotoURL(null) }

  const onSubmit = async (data) => {
    if (!role) { toast.error('Pilih jenis pelapor terlebih dahulu.'); return }

    const fd = new FormData()
    fd.append('role',           role)
    fd.append('nama',           data.nama)
    fd.append('nama_fasilitas', data.nama_fasilitas)
    fd.append('tempat',         data.tempat)
    fd.append('deskripsi',      data.deskripsi)

    if (role === 'mahasiswa') {
      fd.append('fakultas', data.fakultas)
      fd.append('prodi',    data.prodi)
    }

    if (foto) fd.append('foto', foto)

    setSubmitting(true)
    try {
      await laporanService.create(fd)
      setSuccess(true)
      reset()
      setRole('')
      setFoto(null)
      setFotoURL(null)
    } catch (e) {
      const errs = e.response?.data?.errors
      if (errs) {
        Object.values(errs).flat().forEach(msg => toast.error(msg))
      } else {
        toast.error(e.response?.data?.message || 'Gagal mengirim laporan.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSuccess(false)
    reset()
    setRole('')
    setFoto(null)
    setFotoURL(null)
    setFakultas('')
  }

  if (success) return (
    <div>
      {/* Mini hero */}
      <div className="ums-header-bg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display font-bold text-white text-2xl">Buat Laporan</h1>
          <p className="text-white/60 text-sm mt-1">Fakultas Komunikasi dan Teknik Informatika — UMS</p>
        </div>
      </div>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <SuccessScreen onReset={handleReset} />
      </div>
    </div>
  )

  return (
    <div>
      {/* Mini hero */}
      <div className="ums-header-bg py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-3 transition-colors">
            <ChevronLeft size={15} /> Kembali ke Dashboard
          </Link>
          <h1 className="font-display font-bold text-white text-2xl sm:text-3xl">Lapor Kerusakan Fasilitas</h1>
          <p className="text-white/60 text-sm mt-1.5 max-w-md">
            Isi formulir berikut untuk melaporkan kerusakan fasilitas di lingkungan Gedung FKI — UMS.
          </p>
        </div>
      </div>

    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Step 1: Pilih Role */}
        <div data-anim="2" className="card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="font-semibold text-ink-800">Anda adalah...</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <RoleCard role="mahasiswa" icon={GraduationCap} label="Mahasiswa"
              desc="Input nama, fakultas, & prodi"
              selected={role === 'mahasiswa'} onClick={() => setRole('mahasiswa')} />
            <RoleCard role="dosen" icon={User} label="Dosen"
              desc="Input nama saja"
              selected={role === 'dosen'} onClick={() => setRole('dosen')} />
            <RoleCard role="staf" icon={Briefcase} label="Staf"
              desc="Input nama saja"
              selected={role === 'staf'} onClick={() => setRole('staf')} />
          </div>
        </div>

        {/* Step 2: Identitas — muncul setelah role dipilih */}
        {role && (
          <div data-anim="1" className="card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="font-semibold text-ink-800">Identitas Pelapor</h2>
            </div>

            {/* Nama */}
            <FieldGroup label="Nama Lengkap" required error={errors.nama?.message}>
              <input
                className={`field ${errors.nama ? 'field-error' : ''}`}
                placeholder={role === 'mahasiswa' ? 'cth. Budi Santoso' : 'cth. Dr. Hendra Wijaya'}
                {...register('nama', { required: 'Nama wajib diisi.' })}
              />
            </FieldGroup>

            {/* Mahasiswa: Fakultas + Prodi */}
            {role === 'mahasiswa' && (
              <>
                <FieldGroup label="Fakultas" required error={errors.fakultas?.message}>
                  <select
                    className={`field ${errors.fakultas ? 'field-error' : ''}`}
                    {...register('fakultas', { required: 'Pilih fakultas.' })}
                    onChange={e => { setFakultas(e.target.value) }}
                  >
                    <option value="">-- Pilih Fakultas --</option>
                    {FAKULTAS_LIST.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </FieldGroup>

                <FieldGroup label="Program Studi" required error={errors.prodi?.message}>
                  <select
                    className={`field ${errors.prodi ? 'field-error' : ''}`}
                    {...register('prodi', { required: 'Pilih program studi.' })}
                    disabled={!fakultas}
                  >
                    <option value="">-- Pilih Prodi --</option>
                    {prodiList.length > 0
                      ? prodiList.map(p => <option key={p} value={p}>{p}</option>)
                      : <option disabled>Pilih fakultas dulu</option>
                    }
                  </select>
                </FieldGroup>
              </>
            )}
          </div>
        )}

        {/* Step 3: Detail Kerusakan */}
        {role && (
          <div data-anim="2" className="card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h2 className="font-semibold text-ink-800">Detail Kerusakan</h2>
            </div>

            {/* Nama fasilitas */}
            <FieldGroup label="Nama Fasilitas yang Rusak" required error={errors.nama_fasilitas?.message}>
              <select
                className={`field ${errors.nama_fasilitas ? 'field-error' : ''}`}
                {...register('nama_fasilitas', { required: 'Pilih nama fasilitas.' })}
              >
                <option value="">-- Pilih Fasilitas --</option>
                <option value="kursi">kursi</option>
                <option value="Meja">Meja</option>
                <option value="Monitor">Monitor</option>
                <option value="Proyektor">Proyektor</option>
                <option value="Papan tulis">Papan tulis</option>
                <option value="pintu Kelas">pintu Kelas</option>
                <option value="AC">AC</option>
                <option value="smart tv">smart tv</option>
                <option value="LCD">LCD</option>
              </select>
            </FieldGroup>

            {/* Tempat */}
            <FieldGroup label="Lokasi / Tempat" required error={errors.tempat?.message}>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  className={`field pl-9 ${errors.tempat ? 'field-error' : ''}`}
                  placeholder="cth. Ruang J403, Depan ruang J302, Lorong Lt.2..."
                  {...register('tempat', { required: 'Lokasi wajib diisi.' })}
                />
              </div>
            </FieldGroup>

            {/* Deskripsi */}
            <FieldGroup label="Deskripsi Kerusakan" required error={errors.deskripsi?.message}>
              <div className="relative">
                <FileText size={15} className="absolute left-3.5 top-3.5 text-ink-400" />
                <textarea
                  rows={4}
                  className={`field pl-9 resize-none ${errors.deskripsi ? 'field-error' : ''}`}
                  placeholder="Jelaskan kondisi kerusakan secara detail. Misalnya: sandaran kursi patah dan berbahaya jika diduduki..."
                  {...register('deskripsi', {
                    required: 'Deskripsi wajib diisi.',
                    minLength: { value: 20, message: 'Minimal 20 karakter.' }
                  })}
                />
              </div>
              <p className="text-xs text-ink-400">Minimal 20 karakter. Semakin detail semakin baik.</p>
            </FieldGroup>

            {/* Upload foto */}
            <FieldGroup label="Foto Kerusakan (Opsional)">
              {fotoURL ? (
                <div className="relative inline-block">
                  <img src={fotoURL} alt="preview" className="h-40 w-full object-cover rounded-xl border border-ink-200" />
                  <button type="button" onClick={removeFoto}
                    className="absolute top-2 right-2 w-7 h-7 bg-ink-900/70 hover:bg-red-600 rounded-full text-white flex items-center justify-center transition-colors">
                    <X size={13} />
                  </button>
                  <p className="text-xs text-ink-400 mt-1.5">{foto?.name}</p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-ink-200 rounded-2xl p-6 cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-ink-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                    <ImagePlus size={20} className="text-ink-400 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-ink-600">Klik untuk upload foto</p>
                    <p className="text-xs text-ink-400 mt-0.5">JPG, PNG, WebP — maks. 2MB</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
                </label>
              )}
            </FieldGroup>
          </div>
        )}

        {/* Disclaimer + Submit */}
        {role && (
          <div data-anim="3" className="space-y-3">
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
              <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Pastikan data yang Anda isi sudah benar. Laporan palsu atau tidak valid dapat menghambat proses perbaikan fasilitas kampus.
              </p>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl text-base font-bold transition-all
                         bg-brand-600 hover:bg-brand-700 text-white shadow-ums
                         hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2">
              {submitting ? (
                <><Spinner size="sm" className="text-white" /> Mengirim Laporan...</>
              ) : (
                '🚀 Kirim Laporan'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
    </div>
  )
}
