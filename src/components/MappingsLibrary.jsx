import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { BookOpen, Trash2, X, ChevronRight, Download, Upload, Lock, Globe } from 'lucide-react'
import { fetchMappings, fetchMapping, deleteMapping, getLocalMappings, saveLocalMapping, deleteLocalMapping } from '../lib/api'
import { Btn, ConfirmModal } from './UI'

const MappingsLibrary = forwardRef(function MappingsLibrary({ onLoad }, ref) {
  const [open, setOpen] = useState(false)
  const [publicMappings, setPublicMappings] = useState([])
  const [localMappings, setLocalMappings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [importMsg, setImportMsg] = useState(null)
  const [tab, setTab] = useState('local')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const importRef = useRef()

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true)
  }))

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { mappings: data } = await fetchMappings()
      setPublicMappings(data || [])
    } catch (e) {
      setError('Impossible de charger les mappings publics')
    } finally {
      setLoading(false)
    }
    const local = getLocalMappings()
    setLocalMappings(local)
    if (local.length === 0) setTab('public')
  }

  useEffect(() => { if (open) load() }, [open])

  function handleDeletePublic(id, e) {
    e.stopPropagation()
    setConfirmDelete({
      id,
      type: 'public',
      message: 'Ce mapping public sera supprimé pour tous les utilisateurs.',
      requireCode: true,
      code: '',
      codeError: false,
    })
  }

  function handleDeleteLocal(id, e) {
    e.stopPropagation()
    setConfirmDelete({
      id,
      type: 'local',
      message: 'Ce mapping personnel sera supprimé de cet appareil.',
      requireCode: false,
      code: '',
      codeError: false,
    })
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return
    if (confirmDelete.requireCode && confirmDelete.code !== '@8Erculepr0@$') {
      setConfirmDelete(c => ({ ...c, codeError: true }))
      return
    }
    if (confirmDelete.type === 'public') {
      await deleteMapping(confirmDelete.id)
      setPublicMappings(m => m.filter(x => x.id !== confirmDelete.id))
    } else {
      deleteLocalMapping(confirmDelete.id)
      setLocalMappings(getLocalMappings())
    }
    setConfirmDelete(null)
  }

  const [fetchingId, setFetchingId] = useState(null)

  async function getFullMapping(m) {
    if (m.isLocal) {
      return { ...m, rules: typeof m.rules === 'string' ? JSON.parse(m.rules) : m.rules }
    }
    setFetchingId(m.id)
    try {
      const { mapping } = await fetchMapping(m.id)
      return mapping
    } finally {
      setFetchingId(null)
    }
  }

  async function handleSelect(m) {
    try {
      const full = await getFullMapping(m)
      onLoad(full)
      setOpen(false)
    } catch (e) {
      setError('Impossible de charger ce mapping')
    }
  }

  async function handleExport(m, e) {
    e.stopPropagation()
    let full
    try {
      full = await getFullMapping(m)
    } catch (err) {
      setImportMsg('Erreur : impossible de récupérer ce mapping')
      return
    }
    const rules = typeof full.rules === 'string' ? JSON.parse(full.rules) : full.rules
    const payload = {
      name: full.name,
      description: full.description,
      source_file: full.source_file,
      target_file: full.target_file,
      rules,
      exported_at: new Date().toISOString(),
      version: '2.1.0',
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `mapping-${full.name.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    setImportMsg(null)
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        if (!data.name || !data.rules) throw new Error('Format invalide')
        saveLocalMapping({
          name: data.name + ' (importé)',
          description: data.description || '',
          source_file: data.source_file || 'inconnu',
          target_file: data.target_file || 'inconnu',
          rules: data.rules,
        })
        setLocalMappings(getLocalMappings())
        setImportMsg('Mapping importé !')
        setTab('local')
      } catch (err) {
        setImportMsg('Erreur : ' + err.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const mappings = tab === 'local' ? localMappings : publicMappings

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-800 transition-colors">
        <BookOpen size={13} /> Mappings sauvegardés
      </button>

      {open && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'flex-start',justifyContent:'flex-end',zIndex:50,padding:'1rem'}}>
          <div className="bg-white rounded-2xl border border-ink-100 w-80 flex flex-col mt-8" style={{maxHeight:'80vh'}}>

            <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
              <h2 className="text-sm font-medium text-ink-900">Mappings</h2>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700 p-1 rounded-lg hover:bg-ink-50">
                <X size={15} />
              </button>
            </div>

            <div className="flex border-b border-ink-100">
              <button
                onClick={() => setTab('local')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${tab === 'local' ? 'text-ink-900 border-b-2 border-ink-900' : 'text-ink-400 hover:text-ink-600'}`}>
                <Lock size={11} /> Personnel
              </button>
              <button
                onClick={() => setTab('public')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${tab === 'public' ? 'text-teal-700 border-b-2 border-teal-600' : 'text-ink-400 hover:text-ink-600'}`}>
                <Globe size={11} /> Publics
              </button>
            </div>

            <div className="px-3 py-2 border-b border-ink-100">
              <input type="file" accept=".json" ref={importRef} onChange={handleImport} className="hidden" />
              <button
                onClick={() => importRef.current.click()}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink-200 text-xs text-ink-600 hover:bg-ink-50 transition-colors">
                <Upload size={12} /> Importer un mapping (.json)
              </button>
              {importMsg && (
                <p className={`text-xs mt-1.5 text-center ${importMsg.startsWith('Erreur') ? 'text-red-500' : 'text-teal-700'}`}>
                  {importMsg}
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {loading && tab === 'public' && <p className="text-xs text-ink-400 p-3 text-center">Chargement...</p>}
              {error && tab === 'public' && <p className="text-xs text-red-500 p-3 text-center">{error}</p>}
              {!loading && mappings.length === 0 && (
                <p className="text-xs text-ink-400 p-3 text-center">
                  {tab === 'local' ? 'Aucun mapping personnel sur cet appareil' : 'Aucun mapping public'}
                </p>
              )}
              {mappings.map(m => {
                const isFetching = fetchingId === m.id
                return (
                <div key={m.id}
                  className={`flex items-start gap-2 p-3 rounded-xl hover:bg-ink-50 group transition-opacity
                    ${isFetching ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                  onClick={() => !isFetching && handleSelect(m)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {m.isLocal
                        ? <Lock size={10} className="text-ink-400 flex-shrink-0" />
                        : <Globe size={10} className="text-teal-500 flex-shrink-0" />}
                      <p className="text-sm font-medium text-ink-800 truncate">{m.name}</p>
                      {isFetching && <span className="text-xs text-ink-400">Chargement…</span>}
                    </div>
                    <p className="text-xs text-ink-400 truncate">
                      {m.source_file} → {m.target_file}
                    </p>
                    <p className="text-xs text-ink-300 mt-0.5">
                      {new Date(m.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => !isFetching && handleExport(m, e)}
                      disabled={isFetching}
                      className="p-1 rounded-lg text-ink-300 hover:text-cobalt-600 hover:bg-cobalt-50 disabled:cursor-wait"
                      title="Exporter en JSON">
                      <Download size={13} />
                    </button>
                    {!m.isLocal && (
                      <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        Public
                      </span>
                    )}
                    <button
                      onClick={e => m.isLocal ? handleDeleteLocal(m.id, e) : handleDeletePublic(m.id, e)}
                      className="p-1 rounded-lg text-ink-300 hover:text-red-500 hover:bg-red-50"
                      title={m.isLocal ? 'Supprimer (cet appareil uniquement)' : 'Supprimer pour tous les utilisateurs (code requis)'}>
                      <Trash2 size={13} />
                    </button>
                    <ChevronRight size={13} className="text-ink-300" />
                  </div>
                </div>
                )
              })}
            </div>

          </div>

          {confirmDelete && (
            <ConfirmModal
              message={confirmDelete.message}
              requireCode={confirmDelete.requireCode}
              code={confirmDelete.code}
              onCodeChange={val => setConfirmDelete(c => ({ ...c, code: val, codeError: false }))}
              onConfirm={handleConfirmDelete}
              onCancel={() => setConfirmDelete(null)}
              codeError={confirmDelete.codeError}
            />
          )}

        </div>
      )}
    </>
  )
})

export default MappingsLibrary
