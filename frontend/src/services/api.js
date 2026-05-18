import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: { Accept: 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 500) toast.error('Terjadi kesalahan pada server.')
    return Promise.reject(err)
  }
)

// ─── Laporan ─────────────────────────────────────────────────────────────────
export const laporanService = {
  // GET /api/laporan?page=1&status=&search=
  getAll: (params) => api.get('/laporan', { params }),

  // GET /api/laporan/:id
  getById: (id) => api.get(`/laporan/${id}`),

  // POST /api/laporan  (multipart/form-data karena ada foto)
  create: (formData) =>
    api.post('/laporan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export default api
