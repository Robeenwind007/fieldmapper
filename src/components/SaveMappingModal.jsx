import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { saveMapping } from '../lib/api'
import { CONSTANT_FIELD } from '../hooks/useMapper'
import { Btn } from './UI'

export default function SaveMappingModal({ source, target, rules, onClose }) {
  const [name, setName]         = useState('')
  const [description, setDesc]  = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)
  const [saved, setSaved]       = useState(false)

  const constantRules = rules.filter(r => r.sourceField === CONSTANT_FIELD && r.constantValue)
  const [keepConstantValues, setKeepConstantValues] = useState(false)

  async function handleSave() {
    if (!name.trim()) return setError('Le nom est obligatoire')
    setSaving(true); setError(null)
    try {
      await saveMapping({
        name: name.trim(),
        description: description.trim(),
        source_file: source.file.name,
        target_file: target.file.name,
        rules: rules.map(r => ({
          targetField: r.targetField,
          sourceField: r.sourceField,
          transform:   r.transform || 'none',
          constantValue: (r.sourceField === CONSTANT_FIELD && keepConstantValues) ? (r.constantValue || '') : '',
        })),
      })
      setSaved(true)
      setTimeout(onClose, 1200)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-ink-100 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-ink-900">Sauvegarder le mapping</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 p-1 rounded-lg hover:bg-ink-50">
            <X size={16} />
          </button>
        </div>

        {saved ? (
          <div className="text-center py-4">
            <p className="text-teal-700 font-medium">Mapping sauvegardé !</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-ink-600 mb-1">Nom *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: CRM vers ERP clients"
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-ink-600 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDesc(e.target.value)}
                placeholder="Optionnel — contexte ou notes"
                rows={2}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ink-400"
              />
            </div>
            {constantRules.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepConstantValues}
                    onChange={e => setKeepConstantValues(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span className="text-xs text-amber-900">
                    Mémoriser aussi {constantRules.length > 1 ? 'les valeurs fixes saisies' : 'la valeur fixe saisie'} ({constantRules.map(r => `${r.targetField} = "${r.constantValue}"`).join(', ')}).
                    <br />
                    Par défaut, seul le champ reste marqué « valeur fixe » — la saisie sera à refaire à chaque réutilisation du mapping.
                  </span>
                </label>
              </div>
            )}

            <div className="text-xs text-ink-400 mb-4">
              Source : <span className="text-ink-600">{source.file.name}</span>
              {' → '}
              Cible : <span className="text-ink-600">{target.file.name}</span>
              {' · '}
              {rules.filter(r => r.sourceField).length} règles
            </div>
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
