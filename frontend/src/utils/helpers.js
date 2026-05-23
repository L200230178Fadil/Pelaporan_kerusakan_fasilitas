import { format, formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
export { clsx } from 'clsx'

export const fmtDate = (d) => {
  if (!d) return '-'
  const date = new Date(d)
  if (isNaN(date.getTime())) return '-'
  return format(date, 'dd MMM yyyy', { locale: localeId })
}

export const fmtRelative = (d) => {
  if (!d) return '-'
  const date = new Date(d)
  if (isNaN(date.getTime())) return '-'
  return formatDistanceToNow(date, { addSuffix: true, locale: localeId })
}

export const truncate = (s, n = 80) => s?.length > n ? s.slice(0, n) + '…' : s

export const STATUS_MAP = {
  menunggu: { label: 'Menunggu', cls: 'status-menunggu' },
  diproses: { label: 'Diproses', cls: 'status-diproses' },
  selesai: { label: 'Selesai', cls: 'status-selesai' },
  ditolak: { label: 'Ditolak', cls: 'status-ditolak' },
}

export const getStatus = (s) => STATUS_MAP[s] || { label: s, cls: 'status-menunggu' }

export const FAKULTAS_LIST = [
  'Fakultas Komunikasi Dan Teknik Informatika',
]

export const PRODI_MAP = {
  'Fakultas Komunikasi Dan Teknik Informatika': [
    'Teknik Informatika',
    'Ilmu Komunikasi',
    'Sistem Informasi',
  ],
}
