import { useState } from 'react'
import { Layers, CheckSquare, Square, GitMerge, BookOpen, ArrowRight } from 'lucide-react'
import { Btn } from './UI'

export default function SheetPicker({ which, sheetNames, onResolve }) {
  console.log('SheetPicker rendered for:', which, sheetNames)
  const [mode, setMode] = useState('single')
  const [selected, setSelected] = useState([sheetNames[0]])

  function toggleSheet(name) {
    setSelected(prev =>
      prev.includes(name)
        ? prev.filter(s => s !== name)
        : [...prev, name]
    )
  }

  function handleConfirm() {
    if (mode === 'single' && selected.length === 0) return
    if (mode === 'merge_selected' && selected.length < 2) return
    onResolve(which, mode, selected)
  }

  const isSource = which === 'source'

  return (
    <div className="mt-3 border border-ink-100 rounded-xl p-4 bg-ink-50/50">
      <div className="flex items-center gap-2 mb-3">
        <Layers size={14} className="text-ink-500" />
        <p className="text-xs font-medium text-ink-700">
          {sheetNames.length} onglets détectés — comment voulez-vous les lire ?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 mb-4">
        <button
          onClick={() => { setMode('single'); setSelected([sheetNames[0]]) }}
          className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${mode === 'single' ? 'border-ink-900 bg-white' : 'border-ink-200 hover:bg-white'}`}>
          <BookOpen size={14} className={`mt-0.5 flex-shrink-0 ${mode === 'single' ? 'text-ink-900' : 'text-ink-400'}`} />
          <div>
            <p className={`text-xs font-medium ${mode === 'single' ? 'text-ink-900' : 'text-ink-600'}`}>Un seul onglet</p>
            <p className="text-xs text-ink-400">Sélectionner un onglet spécifique</p>
          </div>
        </button>

        {isSource && (
          <>
            <button
              onClick={() => { setMode('merge_all'); setSelected(sheetNames) }}
              className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${mode === 'merge_all' ? 'border-ink-900 bg-white' : 'border-ink-200 hover:bg-white'}`}>
              <GitMerge size={14} className={`mt-0.5 flex-shrink-0 ${mode === 'merge_all' ? 'text-ink-900' : 'text-ink-400'}`} />
              <div>
                <p className={`text-xs font-medium ${mode === 'merge_all' ? 'text-ink-900' : 'text-ink-600'}`}>Fusionner tous les onglets</p>
                <p className="text-xs text-ink-400">Jointure sur Reference_Fabricant</p>
              </div>
            </button>

            <button
              onClick={() => { setMode('merge_selected'); setSelected([sheetNames[0]]) }}
              className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${mode === 'merge_selected' ? 'border-ink-900 bg-white' : 'border-ink-200 hover:bg-white'}`}>
              <CheckSquare size={14} className={`mt-0.5 flex-shrink-0 ${mode === 'merge_selected' ? 'text-ink-900' : 'text-ink-400'}`} />
              <div>
                <p className={`text-xs font-medium ${mode === 'merge_selected' ? 'text-ink-900' : 'text-ink-600'}`}>Fusionner les onglets sélectionnés</p>
                <p className="text-xs text-ink-400">Choisir les onglets à fusionner</p>
              </div>
            </button>
          </>
        )}

        {!isSource && (
          <button
            onClick={() => { setMode('per_sheet'); setSelected(sheetNames) }}
            className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${mode === 'per_sheet' ? 'border-teal-600 bg-teal-50' : 'border-ink-200 hover:bg-white'}`}>
            <Layers size={14} className={`mt-0.5 flex-shrink-0 ${mode === 'per_sheet' ? 'text-teal-700' : 'text-ink-400'}`} />
            <div>
              <p className={`text-xs font-medium ${mode === 'per_sheet' ? 'text-teal-800' : 'text-ink-600'}`}>Mapper onglet par onglet</p>
              <p className="text-xs text-ink-400">Générer un fichier multi-onglets (ex: FAB-DIS)</p>
            </div>
          </button>
        )}
      </div>

      {(mode === 'single' || mode === 'merge_selected') && (
        <div className="mb-4">
          <p className="text-xs font-medium text-ink-600 mb-2">
            {mode === 'single' ? 'Choisir l\'onglet :' : 'Sélectionner les onglets à fusionner :'}
          </p>
          <div className="flex flex-wrap gap-2">
            {sheetNames.map(name => {
              const isSelected = selected.includes(name)
              return (
                <button
                  key={name}
                  onClick={() => mode === 'single' ? setSelected([name]) : toggleSheet(name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isSelected ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-600 hover:bg-ink-50'}`}>
                  {mode === 'merge_selected' && (
                    isSelected ? <CheckSquare size={11} /> : <Square size={11} />
                  )}
                  {name}
                </button>
              )
            })}
          </div>
          {mode === 'merge_selected' && selected.length < 2 && (
            <p className="text-xs text-amber-600 mt-2">Sélectionnez au moins 2 onglets</p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Btn variant="primary" onClick={handleConfirm}
          disabled={
            (mode === 'single' && selected.length === 0) ||
            (mode === 'merge_selected' && selected.length < 2)
          }>
          Confirmer <ArrowRight size={13} />
        </Btn>
      </div>
    </div>
  )
}
