import { useState } from 'react'
import { X, Save, Lock, Globe } from 'lucide-react'
import { saveMapping, saveLocalMapping, checkSecretCode } from '../lib/api'
import { Btn } from './UI'

export default function SaveMappingModal({ source, target, rules, onClose }) {
  const [name, setName] = useState('')
  const [description, setDesc] = useState('')
  const [type, setType] = useState('local')
  const [code, setCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!name.trim()) return setError('Le nom est obligatoire')
    if (type === 'public' && !checkSecretCode(code)) {
      return setError('Code incorrect')
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        source_file: source.file?.name || 'inconnu',
        target_file: target.file?.name || target.filename || 'inconnu',
        rules: rules.map(r => ({
          targetField: r.targetField,
          targetType: target.types[r.targetField] || 'text',
          sourceField: r.sourceField,
          transform: r.transform || 'none',
        })),
      }
      if (type === 'public') {
        await saveMapping(payload)
      } else {
        saveLocalMapping(payload)
      }
      setSaved(true)
      setTimeout(onClose, 1200)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:'1rem'}}>
      <div className="bg-white rounded-2xl border border-ink-100 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-ink-900">Sauvegarder le mapping</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 p-1 rounded-lg hover:bg-ink-50">
            <X size={16} />
          </button>
        </div>

        {saved ? (
          <div className="text-center py-4">
            <p className="text-teal-700 font-medium">Mapping sauvegarde !</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-ink-600 mb-1">Nom</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: CRM vers ERP clients"
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-ink-600 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDesc(e.target.value)}
                placeholder="Optionnel"
                rows={2}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-ink-600 mb-2">Visibilite</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setType('local')}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-colors ${type === 'local' ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-600 hover:bg-ink-50'}`}>
                  <Lock size={14} />
                  <div className="text-left">
                    <p className="font-medium text-xs">Prive</p>
                    <p className={`text-xs ${type === 'local' ? 'text-ink-300' : 'text-ink-400'}`}>Cet appareil</p>
                  </div>
                </button>
                <button
                  onClick={() => setType('public')}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-colors ${type === 'public' ? 'border-teal-600 bg-teal-600 text-white' : 'border-ink-200 text-ink-600 hover:bg-ink-50'}`}>
                  <Globe size={14} />
                  <div className="text-left">
                    <p className="font-medium text-xs">Public</p>
                    <p className={`text-xs ${type === 'public' ? 'text-teal-100' : 'text-ink-400'}`}>Tous les utilisateurs</p>
                  </div>
                </button>
              </div>
            </div>

            {type === 'public' && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-ink-600 mb-1">Code de publication</label>
                <input
                  type="password"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Code requis pour publier"
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            )}

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            <div className="flex gap-2 justify-end">
              <Btn variant="outline" onClick={onClose}>Annuler</Btn>
              <Btn variant="primary" onClick={handleSave} disabled={saving || !name.trim()}>
                <Save size={14} />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
