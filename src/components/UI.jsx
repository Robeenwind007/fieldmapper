import { Upload, CheckCircle, AlertTriangle, Check, Info } from 'lucide-react'

export function StepNav({ current }) {
  const steps = [
    { n: 1, label: 'Import' },
    { n: 2, label: 'Mapping & types' },
    { n: 3, label: 'Export' },
  ]
  return (
    <div className="flex items-center gap-3 mb-6">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-3 flex-1 last:flex-none">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 border transition-colors
            ${current > s.n ? 'bg-teal-400 border-teal-400 text-white' :
              current === s.n ? 'bg-ink-900 border-ink-900 text-white' :
              'border-ink-200 text-ink-400'}`}>
            {current > s.n ? <Check size={12} /> : s.n}
          </div>
          <span className={`text-xs whitespace-nowrap ${current === s.n ? 'text-ink-900 font-medium' : 'text-ink-400'}`}>
            {s.label}
          </span>
          {i < steps.length - 1 && <div className="flex-1 h-px bg-ink-100" />}
        </div>
      ))}
    </div>
  )
}

export function UploadZone({ label, hint, file, loading, error, onChange }) {
  const hasFile = !!file
  return (
    <label className={`block border-2 rounded-xl p-6 text-center cursor-pointer transition-colors
      ${hasFile ? 'border-teal-400 bg-teal-50' :
        error ? 'border-red-300 bg-red-50' :
        'border-dashed border-ink-200 hover:bg-ink-50'}`}>
      <input type="file" className="hidden" accept=".csv,.txt,.xls,.xlsx"
        onChange={e => e.target.files[0] && onChange(e.target.files[0])} />
      <div className={`text-2xl mb-2 flex justify-center
        ${hasFile ? 'text-teal-600' : error ? 'text-red-400' : 'text-ink-300'}`}>
        {loading ? (
          <div className="w-7 h-7 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : hasFile ? <CheckCircle size={28} /> : <Upload size={28} />}
      </div>
      <p className={`text-sm font-medium mb-1 ${hasFile ? 'text-teal-800' : 'text-ink-700'}`}>
        {hasFile ? file.name : label}
      </p>
      <p className={`text-xs ${hasFile ? 'text-teal-600' : 'text-ink-400'}`}>
        {error ? error : hint}
      </p>
    </label>
  )
}

export function TypeBadge({ type }) {
  const cfg = {
    text:   'bg-cobalt-50 text-cobalt-800',
    number: 'bg-teal-50 text-teal-800',
    date:   'bg-amber-50 text-amber-800',
    bool:   'bg-purple-100 text-purple-800',
    empty:  'bg-ink-50 text-ink-600',
  }
  const labels = { text: 'texte', number: 'nombre', date: 'date', bool: 'booléen', empty: 'vide' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg[type] || cfg.empty}`}>
      {labels[type] || type}
    </span>
  )
}

export function CompatBadge({ compat }) {
  if (!compat) return null
  if (compat === 'ok') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-800">
      <Check size={10} /> OK
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800">
      <AlertTriangle size={10} /> diff.
    </span>
  )
}

export function Alert({ type = 'info', children }) {
  const cfg = {
    info:    { cls: 'bg-cobalt-50 text-cobalt-800 border-cobalt-200',   Icon: Info },
    warn:    { cls: 'bg-amber-50 text-amber-800 border-amber-200',      Icon: AlertTriangle },
    success: { cls: 'bg-teal-50 text-teal-800 border-teal-200',         Icon: CheckCircle },
  }
  const { cls, Icon } = cfg[type] || cfg.info
  return (
    <div className={`flex gap-2 items-start p-3 rounded-lg border text-sm mb-4 ${cls}`}>
      <Icon size={16} className="flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  )
}

export function StatCard({ label, value }) {
  return (
    <div className="bg-ink-50 rounded-lg p-3">
      <p className="text-xs text-ink-400 mb-1">{label}</p>
      <p className="text-2xl font-medium text-ink-900">{value}</p>
    </div>
  )
}

export function Btn({ onClick, disabled, variant = 'outline', children, className = '' }) {
  const base = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    outline:  'border border-ink-200 text-ink-800 hover:bg-ink-50',
    primary:  'bg-ink-900 text-white border border-ink-900 hover:opacity-85',
    ghost:    'text-ink-600 hover:bg-ink-50',
    danger:   'border border-red-200 text-red-700 hover:bg-red-50',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
