import { useState } from 'react'
import { X, Sparkles, ChevronDown } from 'lucide-react'
import { CHANGELOG_HISTORY } from '../lib/changelog'

function VersionEntry({ entry, isLatest, isOpen, onToggle }) {
  return (
    <div className={`rounded-lg border ${isLatest ? 'border-bordeaux-200 bg-bordeaux-50/40' : 'border-ink-100'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left">
        <span className="text-xs font-medium text-ink-500">
          Version {entry.version} · {entry.date}
        </span>
        <ChevronDown
          size={14}
          className={`text-ink-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <ul className="px-3 pb-3 space-y-2">
          {entry.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
              <span className="text-bordeaux-500 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ChangelogModal({ onClose }) {
  const [openVersion, setOpenVersion] = useState(CHANGELOG_HISTORY[0]?.version)

  function toggle(version) {
    setOpenVersion(prev => prev === version ? null : version)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
      <div className="bg-white rounded-2xl border border-ink-100 w-full max-w-sm p-6 flex flex-col" style={{ maxHeight: '80vh' }}>
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-bordeaux-600" />
            <h2 className="text-base font-medium text-ink-900">Nouveautés</h2>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 p-1 rounded-lg hover:bg-ink-50">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {CHANGELOG_HISTORY.map((entry, i) => (
            <VersionEntry
              key={entry.version}
              entry={entry}
              isLatest={i === 0}
              isOpen={openVersion === entry.version}
              onToggle={() => toggle(entry.version)}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full flex-shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-ink-900 text-white hover:opacity-85 transition-colors">
          Compris
        </button>
      </div>
    </div>
  )
}

