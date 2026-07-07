import { ArrowLeft } from 'lucide-react'
import { useGridSplitter, GRID_STEPS } from '../hooks/useGridSplitter'
import { StepNav } from './UI'
import GridStepImport from './GridStepImport'
import GridStepConfig from './GridStepConfig'
import GridStepExport from './GridStepExport'

export default function GridSplitter({ onClose }) {
  const g = useGridSplitter()

  return (
    <div className="min-h-screen bg-ink-50/40 flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-ink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-bordeaux-600 border border-bordeaux-200 hover:bg-bordeaux-50 transition-colors">
            <ArrowLeft size={14} /> Retour à l'application
          </button>
          <span className="text-base font-medium text-ink-900">Éclatement de grilles croisées</span>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="bg-white rounded-2xl border border-ink-100 p-6 max-w-7xl mx-auto">
          <GridNav current={g.step} />

          {g.step === GRID_STEPS.IMPORT && (
            <GridStepImport
              source={g.source}
              loading={g.loading}
              error={g.error}
              loadFile={g.loadFile}
              onNext={() => g.setStep(GRID_STEPS.CONFIG)}
              canProceed={g.canProceed}
            />
          )}

          {g.step === GRID_STEPS.CONFIG && (
            <GridStepConfig
              source={g.source}
              config={g.config}
              grids={g.grids}
              updateConfig={g.updateConfig}
              onBack={() => g.setStep(GRID_STEPS.IMPORT)}
              onNext={() => g.setStep(GRID_STEPS.EXPORT)}
            />
          )}

          {g.step === GRID_STEPS.EXPORT && (
            <GridStepExport
              source={g.source}
              config={g.config}
              grids={g.grids}
              onBack={() => g.setStep(GRID_STEPS.CONFIG)}
              onReset={g.reset}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function GridNav({ current }) {
  const steps = [
    { n: 1, label: 'Fichier' },
    { n: 2, label: 'Axes & aperçu' },
    { n: 3, label: 'Export' },
  ]
  return (
    <div className="flex items-center gap-3 mb-6">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-3 flex-1 last:flex-none">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 border transition-colors
            ${current > s.n ? 'bg-teal-400 border-teal-400 text-white' :
              current === s.n ? 'bg-ink-900 border-ink-900 text-white' :
              'border-ink-200 text-ink-400'}`}>
            {s.n}
          </div>
          <span className={`text-xs whitespace-nowrap ${current === s.n ? 'text-ink-900 font-medium' : 'text-ink-400'}`}>
            {s.label}
          </span>
          {i < steps.length - 1 && <div className="flex-1 h-px bg-ink-100" />}
        </div>
      ))}
    </div>
  )
}
