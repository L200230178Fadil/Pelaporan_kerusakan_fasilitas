import { clsx } from '../../utils/helpers'

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', className }) {
  const s = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' }
  return (
    <svg className={clsx('animate-spin', s[size], className ?? 'text-brand-600')} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path  className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, className }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', className)}>
      {children}
    </span>
  )
}

// ─── Field + Label wrapper ────────────────────────────────────────────────────
export function FieldGroup({ label, error, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-700">
          {label} {required && <span className="text-brand-500">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
      {Icon && <Icon size={36} className="text-ink-300" />}
      <p className="font-display font-semibold text-ink-600 text-lg">{title}</p>
      {desc && <p className="text-sm text-ink-400 max-w-xs">{desc}</p>}
      {action}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const w = { sm: 'max-w-sm', md: 'max-w-xl', lg: 'max-w-2xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative bg-ink-50 rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto border border-ink-200 dark:border-ink-800', w[size])}
           style={{ animation: 'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) forwards' }}>
        <div className="sticky top-0 bg-ink-50 flex items-center justify-between px-6 py-4 border-b border-ink-100 dark:border-ink-800 z-10">
          <h3 className="font-display font-semibold text-ink-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors text-ink-500">
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Page loader ──────────────────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  )
}
