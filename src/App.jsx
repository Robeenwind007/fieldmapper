import { useCallback, useRef, useState, useEffect } from 'react'
import { Sparkles, BookOpen } from 'lucide-react'
import { useMapper, STEPS } from './hooks/useMapper'
import { StepNav } from './components/UI'
import StepImport  from './components/StepImport'
import StepMapping from './components/StepMapping'
import StepMappingTargetOnly from './components/StepMappingTargetOnly'
import StepExport  from './components/StepExport'
import MappingsLibrary from './components/MappingsLibrary'
import ChangelogModal from './components/ChangelogModal'
import DocumentationPage from './components/DocumentationPage'
import SaveMappingModal from './components/SaveMappingModal'
import { CURRENT_VERSION } from './lib/changelog'

export default function App() {
  const mapper = useMapper()
  const libraryRef = useRef()
  const [conversionCount, setConversionCount] = useState(0)
  const [showChangelog, setShowChangelog] = useState(false)
  const [showDoc, setShowDoc] = useState(false)
  const [showSaveTargetOnly, setShowSaveTargetOnly] = useState(false)

  useEffect(() => {
    try {
      const count = parseInt(localStorage.getItem('fieldmapper_conversion_count') || '0', 10)
      setConversionCount(count)
    } catch {}
  }, [mapper.step])

  const goToMapping = useCallback(() => {
    mapper.buildRules()
    mapper.setStep(STEPS.MAPPING)
  }, [mapper])

  function handleLoadSaved(saved) {
    mapper.loadSavedMapping(saved)
    mapper.setStep(STEPS.IMPORT)
  }

  function handleBackToImport() {
    mapper.restorePendingSheet()
    mapper.setStep(STEPS.IMPORT)
  }

  if (showDoc) {
    return <DocumentationPage onClose={() => setShowDoc(false)} />
  }

  return (
    <div className="min-h-screen bg-ink-50/40 flex flex-col">
      <div className="flex flex-col items-center pt-8 pb-4">
        <img src="/logo.png" alt="HerculePro FieldMapper" className="h-24 mb-1" />
      </div>

      <div className="flex-1 px-6 pb-10">
        <div className="bg-white rounded-2xl border border-ink-100 p-6 max-w-7xl mx-auto">
          <StepNav current={mapper.step} />
          {mapper.step === STEPS.IMPORT && (
            <StepImport
              source={mapper.source}
              target={mapper.target}
              loading={mapper.loading}
              errors={mapper.errors}
              loadFile={mapper.loadFile}
              onNext={goToMapping}
              savedMappingName={mapper.savedMappingName}
              onOpenLibrary={() => libraryRef.current?.open()}
              pendingSheet={mapper.pendingSheet}
              resolveSheetChoice={mapper.resolveSheetChoice}
              targetOnlyMode={mapper.targetOnlyMode}
              enableTargetOnlyMode={mapper.enableTargetOnlyMode}
              disableTargetOnlyMode={mapper.disableTargetOnlyMode}
            />
          )}
          {mapper.step === STEPS.MAPPING && mapper.targetOnlyMode && (
            <StepMappingTargetOnly
              target={mapper.target}
              rules={mapper.rules}
              updateRule={mapper.updateRule}
              updateConstant={mapper.updateConstant}
              onBack={handleBackToImport}
              onSave={() => setShowSaveTargetOnly(true)}
            />
          )}
          {mapper.step === STEPS.MAPPING && !mapper.targetOnlyMode && (
            <StepMapping
              enrichedRules={mapper.enrichedRules}
              source={mapper.source}
              target={mapper.target}
              updateRule={mapper.updateRule}
              updateTransform={mapper.updateTransform}
              updateConstant={mapper.updateConstant}
              onBack={handleBackToImport}
              onNext={() => mapper.setStep(STEPS.EXPORT)}
              activeTargetSheet={mapper.activeTargetSheet}
              sheetRules={mapper.sheetRules}
              switchTargetSheet={mapper.switchTargetSheet}
              saveCurrentSheetRules={mapper.saveCurrentSheetRules}
            />
          )}
          {mapper.step === STEPS.EXPORT && !mapper.targetOnlyMode && (
            <StepExport
              source={mapper.source}
              target={mapper.target}
              rules={mapper.rules}
              stats={mapper.stats}
              sheetRules={mapper.sheetRules}
              onBack={() => mapper.setStep(STEPS.MAPPING)}
              onReset={() => mapper.setStep(STEPS.IMPORT)}
            />
          )}
        </div>

        <div className="flex items-end justify-between mt-4 max-w-7xl mx-auto">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChangelog(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-bordeaux-600 hover:text-bordeaux-800 transition-colors">
                <Sparkles size={12} /> Nouveautés
              </button>
              <button
                onClick={() => setShowDoc(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 hover:text-bordeaux-600 transition-colors">
                <BookOpen size={12} /> Documentation
              </button>
            </div>
            <p className="text-xs text-ink-300">
              Fichiers convertis : <span className="font-medium text-ink-400">{conversionCount}</span>
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-ink-300">Traitement 100% local — aucun fichier n'est envoyé sur un serveur</p>
            <p className="text-xs text-ink-300">v{CURRENT_VERSION} · © Olivier BERNARD pour HerculePro 2026</p>
          </div>
        </div>
      </div>

      <MappingsLibrary ref={libraryRef} onLoad={handleLoadSaved} />
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
      {showSaveTargetOnly && (
        <SaveMappingModal
          source={mapper.source}
          target={mapper.target}
          rules={mapper.rules}
          onClose={() => {
            setShowSaveTargetOnly(false)
            mapper.disableTargetOnlyMode()
            mapper.setStep(STEPS.IMPORT)
          }}
        />
      )}
    </div>
  )
}
