import { useCallback } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { useMapper, STEPS } from './hooks/useMapper'
import { StepNav } from './components/UI'
import StepImport  from './components/StepImport'
import StepMapping from './components/StepMapping'
import StepExport  from './components/StepExport'
import MappingsLibrary from './components/MappingsLibrary'

export default function App() {
  const mapper = useMapper()

  const goToMapping = useCallback(() => {
    mapper.buildRules()
    mapper.setStep(STEPS.MAPPING)
  }, [mapper])

  function handleLoadSaved(saved) {
    mapper.loadSavedMapping(JSON.parse(saved.rules || '[]'))
    mapper.setStep(STEPS.MAPPING)
  }

  return (
    <div className="min-h-screen bg-ink-50/40 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ink-900 rounded-lg flex items-center justify-center">
              <ArrowLeftRight size={14} className="text-white" />
            </div>
            <span className="text-base font-medium text-ink-900">FieldMapper</span>
          </div>
          <MappingsLibrary onLoad={handleLoadSaved} />
        </div>

        <div className="bg-white rounded-2xl border border-ink-100 p-6">
          <StepNav current={mapper.step} />

          {mapper.step === STEPS.IMPORT && (
            <StepImport
              source={mapper.source}
              target={mapper.target}
              loading={mapper.loading}
              errors={mapper.errors}
              loadFile={mapper.loadFile}
              onNext={goToMapping}
            />
          )}

          {mapper.step === STEPS.MAPPING && (
            <StepMapping
              enrichedRules={mapper.enrichedRules}
              source={mapper.source}
              target={mapper.target}
              updateRule={mapper.updateRule}
              updateTransform={mapper.updateTransform}
              onBack={() => mapper.setStep(STEPS.IMPORT)}
              onNext={() => mapper.setStep(STEPS.EXPORT)}
            />
          )}

          {mapper.step === STEPS.EXPORT && (
            <StepExport
              source={mapper.source}
              target={mapper.target}
              rules={mapper.rules}
              stats={mapper.stats}
              onBack={() => mapper.setStep(STEPS.MAPPING)}
              onReset={() => { mapper.setStep(STEPS.IMPORT) }}
            />
          )}
        </div>

        <p className="text-center text-xs text-ink-300 mt-4">
          Traitement 100% local — aucun fichier n'est envoyé sur un serveur
        </p>
      </div>
    </div>
  )
}
