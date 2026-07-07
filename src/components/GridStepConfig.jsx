import { ArrowLeft, ArrowRight, Grid3x3 } from 'lucide-react'
import { Btn, Alert } from './UI'

function colLetter(i) {
  let s = ''
  i += 1
  while (i > 0) {
    const m = (i - 1) % 26
    s = String.fromCharCode(65 + m) + s
    i = Math.floor((i - 1) / 26)
  }
  return s
}

function NumberControl({ label, value, onChange, min = 0, max, help }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-700">{label}</p>
        {help && <p className="text-[11px] text-ink-400">{help}</p>}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-6 h-6 rounded border border-ink-200 text-ink-600 hover:bg-ink-50 text-sm leading-none">−</button>
        <span className="w-8 text-center text-sm font-medium text-ink-900">{value}</span>
        <button
          onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
          className="w-6 h-6 rounded border border-ink-200 text-ink-600 hover:bg-ink-50 text-sm leading-none">+</button>
      </div>
    </div>
  )
}

export default function GridStepConfig({ source, config, grids, updateConfig, onBack, onNext }) {
  if (!config) return null
  const data = source.data
  const maxRow = data.length - 1
  const maxCol = Math.max(...data.map(r => (r ? r.length : 0))) - 1

  const previewRows = Math.min(data.length, 16)
  const previewCols = Math.min(maxCol + 1, 16)

  // Classe de fond selon le rôle de la cellule
  function cellClass(r, c) {
    if (r === config.hLabelRow && c >= config.bodyCol) return 'bg-cobalt-100 text-cobalt-900'
    if (r === config.hDimRow && c >= config.bodyCol) return 'bg-cobalt-50 text-cobalt-700'
    if (c === config.vLabelCol && r >= config.bodyRow) return 'bg-teal-100 text-teal-900'
    if (c === config.vDimCol && r >= config.bodyRow) return 'bg-teal-50 text-teal-700'
    if (r >= config.bodyRow && c >= config.bodyCol) return 'bg-white text-ink-700'
    return 'bg-ink-50/50 text-ink-300'
  }

  const nbGrids = config.hLabels.length * config.vLabels.length

  return (
    <div>
      <Alert type="info">
        Vérifiez les axes détectés automatiquement. Les <span className="font-medium text-cobalt-700">colonnes</span> portent les produits (ligne d'étiquettes) et leurs largeurs ; les <span className="font-medium text-teal-700">lignes</span> portent les types (colonne d'étiquettes) et leurs hauteurs. Ajustez si nécessaire.
      </Alert>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 border border-ink-100 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-ink-50 border-b border-ink-100 flex items-center justify-between">
            <p className="text-xs font-medium text-ink-500">Aperçu de la structure</p>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-cobalt-100 inline-block" /> Produits / largeurs</span>
              <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-teal-100 inline-block" /> Types / hauteurs</span>
            </div>
          </div>
          <div className="overflow-auto max-h-96">
            <table className="text-xs border-collapse">
              <thead>
                <tr>
                  <th className="sticky top-0 left-0 z-20 bg-ink-100 border border-ink-200 w-8 h-6" />
                  {Array.from({ length: previewCols }).map((_, c) => (
                    <th key={c} className="sticky top-0 z-10 bg-ink-100 border border-ink-200 px-2 py-1 text-ink-500 font-medium min-w-[70px]">
                      {colLetter(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: previewRows }).map((_, r) => (
                  <tr key={r}>
                    <td className="sticky left-0 z-10 bg-ink-100 border border-ink-200 px-2 py-1 text-ink-500 font-medium text-center">{r + 1}</td>
                    {Array.from({ length: previewCols }).map((_, c) => {
                      const v = data[r] ? data[r][c] : null
                      const disp = typeof v === 'number' ? Math.round(v * 100) / 100 : v
                      return (
                        <td key={c} className={`border border-ink-100 px-2 py-1 truncate max-w-[110px] ${cellClass(r, c)}`}>
                          {disp !== null && disp !== undefined ? String(disp) : ''}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-ink-100 rounded-xl p-4 space-y-1">
          <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide mb-2">Colonnes (produits)</p>
          <NumberControl label="Ligne des étiquettes" value={config.hLabelRow + 1}
            onChange={v => updateConfig({ hLabelRow: v - 1 })} min={1} max={maxRow + 1}
            help="Ex: Fenêtre / Volet / Store" />
          <NumberControl label="Ligne des dimensions" value={config.hDimRow + 1}
            onChange={v => updateConfig({ hDimRow: v - 1 })} min={1} max={maxRow + 1}
            help="Largeurs" />

          <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide mb-2 mt-4">Lignes (types)</p>
          <NumberControl label="Colonne des étiquettes" value={config.vLabelCol + 1}
            onChange={v => updateConfig({ vLabelCol: v - 1 })} min={1} max={maxCol + 1}
            help="Ex: Dormant 100 / 110 / 120" />
          <NumberControl label="Colonne des dimensions" value={config.vDimCol + 1}
            onChange={v => updateConfig({ vDimCol: v - 1 })} min={1} max={maxCol + 1}
            help="Hauteurs" />

          <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide mb-2 mt-4">Début des valeurs</p>
          <NumberControl label="Première ligne" value={config.bodyRow + 1}
            onChange={v => updateConfig({ bodyRow: v - 1 })} min={1} max={maxRow + 1} />
          <NumberControl label="Première colonne" value={config.bodyCol + 1}
            onChange={v => updateConfig({ bodyCol: v - 1 })} min={1} max={maxCol + 1} />

          <div className="mt-4 pt-3 border-t border-ink-100">
            <div className="flex items-center gap-2 text-bordeaux-700">
              <Grid3x3 size={15} />
              <span className="text-sm font-semibold">{nbGrids} grilles</span>
            </div>
            <p className="text-[11px] text-ink-400 mt-1">
              {config.hLabels.length} produit(s) × {config.vLabels.length} type(s)
            </p>
          </div>
        </div>
      </div>

      {nbGrids === 0 && (
        <Alert type="warn">
          Aucune grille détectée avec cette configuration. Vérifiez les lignes et colonnes d'étiquettes.
        </Alert>
      )}

      <div className="flex justify-between">
        <Btn variant="outline" onClick={onBack}>
          <ArrowLeft size={14} /> Retour
        </Btn>
        <Btn variant="primary" onClick={onNext} disabled={nbGrids === 0}>
          Aperçu et export <ArrowRight size={14} />
        </Btn>
      </div>
    </div>
  )
}
