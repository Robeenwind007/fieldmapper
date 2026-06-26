import { X, Sparkles } from 'lucide-react'
import { CHANGELOG_NOTE } from '../lib/changelog'

export default function ChangelogModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
      <div className="bg-white rounded-2xl border border-ink-100 w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-bordeaux-600" />
            <h2 className="text-base font-medium text-ink-900">Nouveautés</h2>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 p-1 rounded-lg hover:bg-ink-50">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs font-medium text-ink-500 mb-3">
          Version {CHANGELOG_NOTE.version} · {CHANGELOG_NOTE.date}
        </p>

        <ul className="space-y-2 mb-4">
          {CHANGELOG_NOTE.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
              <span className="text-bordeaux-500 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-ink-900 text-white hover:opacity-85 transition-colors">
          Compris
        </button>
      </div>
    </div>
  )
}
