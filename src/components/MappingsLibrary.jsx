import { useState, useEffect } from 'react'
import { BookOpen, Trash2, X, ChevronRight } from 'lucide-react'
import { fetchMappings, deleteMapping } from '../lib/api'
import { Btn } from './UI'

export default function MappingsLibrary({ onLoad }) {
  const [open, setOpen]         = useState(false)
  const [mappings, setMappings] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const { mappings: data } = await fetchMappings()
      setMappings(data || [])
    } catch (e) {
      setError('Impossible de charger les mappings sauvegardés')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (open) load() }, [open])

  async function handleDelete(id, e) {
    e.stopPropagation()
    if (!confirm('Supprimer ce mapping ?')) return
    await deleteMapping(id)
    setMappings(m => m.filter(x => x.id !== id))
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-800 transition-colors">
        <BookOpen size={13} /> Mappings sauvegardés
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/20 flex items-start justify-end z-50 p-4">
          <div className="bg-white rounded-2xl border border-ink-100 w-80 max-h-[80vh] flex flex-col mt-8">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
              <h2 className="text-sm font-medium text-ink-900">Mappings sauvegardés</h2>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700 p-1 rounded-lg hover:bg-ink-50">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {loading && <p className="text-xs text-ink-400 p-3 text-center">Chargement...</p>}
              {error && <p className="text-xs text-red-500 p-3 text-center">{error}</p>}
              {!loading && !error && mappings.length === 0 && (
                <p className="text-xs text-ink-400 p-3 text-center">Aucun mapping sauvegardé</p>
              )}
              {mappings.map(m => (
                <div key={m.id}
                  className="flex items-start gap-2 p-3 rounded-xl hover:bg-ink-50 cursor-pointer group"
                  onClick={() => { onLoad(m); setOpen(false) }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-800 truncate">{m.name}</p>
                    <p className="text-xs text-ink-400 truncate mt-0.5">
                      {m.source_file} → {m.target_file}
                    </p>
                    <p className="text-xs text-ink-300 mt-0.5">
                      {new Date(m.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => handleDelete(m.id, e)}
                      className="p-1 rounded-lg text-ink-300 hover:text-red-500 hover:bg-red-50">
                      <Trash2 size={13} />
                    </button>
                    <ChevronRight size={13} className="text-ink-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
