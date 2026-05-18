import { useState, useEffect, useCallback } from 'react'

// ─── Generic data fetcher ───────────────────────────────────────────────────
export function useFetch(fetchFn, params = {}) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFn(params)
      setData(res.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal memuat data.')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { load() }, [load])

  return { data, loading, error, refetch: load }
}

// ─── Pagination helper ──────────────────────────────────────────────────────
export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage)
  const next = () => setPage(p => p + 1)
  const prev = () => setPage(p => Math.max(1, p - 1))
  return { page, setPage, next, prev }
}

// ─── Debounced search ───────────────────────────────────────────────────────
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
