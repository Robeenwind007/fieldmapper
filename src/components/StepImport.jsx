import { useRef, useState } from 'react'
import { ArrowRight, BookOpen, AlertTriangle, FileCog, FileJson } from 'lucide-react'
import { UploadZone, Btn } from './UI'
import SheetPicker from './SheetPicker'

const WARN_SIZE = 5 * 1024 * 1024
const MAX_SIZE = 20 * 1024 * 1024

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
}

function FileSizeWarning({ file }) {
  if (!file) return null
  if (file.size > MAX_SIZE) return (
    <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
      <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-red-700">
        Fichier trop volumineux ({formatSize(file.size)}) — risque de crash au-dessus de 20 Mo. Découpez-le en plusieurs fichiers.
      </p>
    </div>
  )
  if (file.size > WARN_SIZE) return (
    <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
      <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-700">
        Fichier volumineux ({formatSize(file.size)}) — le traitement peut être lent sur certains appareils.
      </p>
    </div>
  )
  return null
}

export default function StepImport({ source, target, loading, errors, loadFile, onNext, savedMappingName, onOpenLibrary, pendingSheet, resolveSheetChoice, targetOnlyMode, enableTargetOnlyMode, disableTargetOnlyMode, onImportMapping, justReset, onDismissReset }) {
  const hasTarget = target.headers.length > 0
  const hasPending = !!pendingSheet
  const canProceed = hasTarget && !hasPending && (targetOnlyMode || source.headers.length > 0)
  const isBlocked = source.file && source.file.size > MAX_SIZE
  const importJsonRef = useRef()
  const [importError, setImportError] = useState(null)

  function handleLoadFile(which, file) {
    onDismissReset?.()
    loadFile(which, file)
  }

  function handleImportJson(e) {
    const file = e.target.files[0]
    if (!file) return
    setImportError(null)
    onDismissReset?.()
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        if (!data.name || !data.rules) throw new Error('Format invalide')
        onImportMapping(data)
      } catch (err) {
        setImportError('Fichier de mapping invalide : ' + err.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div>
      {justReset && (source.file || target.file || savedMappingName) && (
        <div className="mb-4 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Les fichiers précédents sont toujours chargés. Cliquez sur « Changer de fichier » si vous voulez en utiliser d'autres.
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4 items-start">
        <div>
          <p className="text-sm font-medium text-ink-700 mb-2">Fichier source</p>
          {targetOnlyMode ? (
            <div className="border-2 border-dashed border-bordeaux-200 bg-bordeaux-50 rounded-xl p-6 text-center">
              <div className="text-2xl mb-2 flex justify-center text-bordeaux-600">
                <FileCog size={28} />
              </div>
              <p className="text-sm font-medium text-bordeaux-800 mb-1">Mode gabarit — sans fichier source</p>
              <p className="text-xs text-bordeaux-600 mb-3">
                Vous créez un mapping basé uniquement sur la structure cible
              </p>
              <button
                onClick={disableTargetOnlyMode}
                className="text-xs text-bordeaux-600 underline hover:text-bordeaux-800">
                Annuler — charger un fichier source
              </button>
            </div>
          ) : (
            <>
              <UploadZone
                label="Fichier à convertir"
                hint="XLS, XLSX, CSV, TXT & FabDis"
                file={source.file || (pendingSheet?.which === 'source' ? pendingSheet.file : null)}
                loading={loading.source}
                error={errors.source}
                onChange={f => handleLoadFile('source', f)}
              />
              <FileSizeWarning file={source.file} />
              {pendingSheet?.which === 'source' && (
                <SheetPicker
                  which="source"
                  sheetNames={pendingSheet.sheetNames}
                  onResolve={resolveSheetChoice}
                />
              )}
              {source.headers.length > 0 && !isBlocked && !hasPending && (
                <p className="text-xs text-ink-400 mt-2 text-center">
                  {source.selectedSheet && (
                    <span className="mr-1 font-medium text-ink-500">[{source.selectedSheet}]</span>
                  )}
                  {source.headers.length} colonnes - {source.data.length} lignes
                </p>
              )}
            </>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-ink-700 mb-2">
            Fichier cible
            {savedMappingName && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                {savedMappingName}
              </span>
            )}
          </p>

          {savedMappingName ? (
            <div className="border-2 border-teal-400 bg-teal-50 rounded-xl p-6 text-center">
              <div className="text-2xl mb-2 flex justify-center text-teal-600">OK</div>
              <p className="text-sm font-medium text-teal-800 mb-1">Structure chargée depuis le mapping</p>
              <p className="text-xs text-teal-600">{target.headers.length} colonnes définies</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-xs text-teal-600 underline hover:text-teal-800">
                Changer de fichier
              </button>
            </div>
          ) : (
            <>
              <UploadZone
                label="Fichier cible si fichier modèle mapping absent"
                hint="XLS, XLSX, CSV, TXT & FabDis"
                file={target.file || (pendingSheet?.which === 'target' ? pendingSheet.file : null)}
                loading={loading.target}
                error={errors.target}
                onChange={f => handleLoadFile('target', f)}
              />
              {!target.file && !hasPending && (
                <div className="mt-2 text-center">
                  <input type="file" accept=".json" ref={importJsonRef} onChange={handleImportJson} className="hidden" />
                  <button
                    onClick={() => importJsonRef.current.click()}
                    className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-bordeaux-600 transition-colors">
                    <FileJson size={12} /> ou importer un mapping (.json) à la place du fichier
                  </button>
                  {importError && (
                    <p className="text-xs text-red-500 mt-1">{importError}</p>
                  )}
                </div>
              )}
            </>
          )}

          {pendingSheet?.which === 'target' && (
            <SheetPicker
              which="target"
              sheetNames={pendingSheet.sheetNames}
              onResolve={resolveSheetChoice}
            />
          )}

          {target.headers.length > 0 && !savedMappingName && !hasPending && (
            <p className="text-xs text-ink-400 mt-2 text-center">
              {target.selectedSheet && (
                <span className="mr-1 font-medium text-ink-500">[{target.selectedSheet}]</span>
              )}
              {target.headers.length} colonnes - {target.data.length} lignes
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div>
          {hasTarget && !source.headers.length && !targetOnlyMode && !hasPending && (
            <button
              onClick={enableTargetOnlyMode}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 hover:text-bordeaux-600 transition-colors">
              <FileCog size={13} /> Créer un mapping cible seule (gabarit, sans fichier source)
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLibrary}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{
              color: '#c02226',
              borderColor: '#c02226',
              background: savedMappingName ? '#e4b9ba' : 'transparent',
            }}
            onMouseEnter={e => { if (!savedMappingName) e.currentTarget.style.background = '#fdf2f2' }}
            onMouseLeave={e => { if (!savedMappingName) e.currentTarget.style.background = 'transparent' }}>
            <BookOpen size={14} /> Mappings sauvegardés
          </button>
          <Btn variant="primary" onClick={onNext} disabled={!canProceed || isBlocked}>
            Configurer le mapping <ArrowRight size={14} />
          </Btn>
        </div>
      </div>
    </div>
  )
}
