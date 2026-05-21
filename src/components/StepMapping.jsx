import { ArrowLeft, ArrowRight } from 'lucide-react'
import { TypeBadge, CompatBadge, Alert, Btn } from './UI'

export default function StepMapping({ enrichedRules, source, target, updateRule, updateTransform, onBack, onNext }) {
  const warnCount = enrichedRules.filter(r => r.compat === 'warn').length

  return (
    <div>
      <Alert type="info">
        Les types sont détectés automatiquement. Des transformations sont proposées en cas d'incompatibilité.
      </Alert>

      {warnCount > 0 && (
        <Alert type="warn">
          {warnCount} champ(s) avec des types incompatibles — des transformations sont recommandées.
        </Alert>
      )}

      <div className="border border-ink-100 rounded-xl overflow-hidden mb-4">
        <div className="overflow-y-auto max-h-96">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-ink-50 z-10">
              <tr>
                <th className="text-left text-xs font-medium text-ink-500 uppercase tracking-wide px-3 py-2.5 border-b border-ink-100 w-[22%]">Champ cible</th>
                <th className="text-left text-xs font-medium text-ink-500 uppercase tracking-wide px-3 py-2.5 border-b border-ink-100 w-[10%]">Type cible</th>
                <th className="text-left text-xs font-medium text-ink-500 uppercase tracking-wide px-3 py-2.5 border-b border-ink-100 w-[22%]">Champ source</th>
                <th className="text-left text-xs font-medium text-ink-500 uppercase tracking-wide px-3 py-2.5 border-b border-ink-100 w-[10%]">Type source</th>
                <th className="text-left text-xs font-medium text-ink-500 uppercase tracking-wide px-3 py-2.5 border-b border-ink-100 w-[10%]">Compat.</th>
                <th className="text-left text-xs font-medium text-ink-500 uppercase tracking-wide px-3 py-2.5 border-b border-ink-100 w-[26%]">Transformation</th>
              </tr>
            </thead>
            <tbody>
              {enrichedRules.map((rule, i) => (
                <tr key={rule.targetField} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50/40'}>
                  <td className="px-3 py-2 font-medium text-ink-800 border-b border-ink-50">
                    {rule.targetField}
                  </td>
                  <td className="px-3 py-2 border-b border-ink-50">
                    <TypeBadge type={rule.tgtType} />
                  </td>
                  <td className="px-3 py-2 border-b border-ink-50">
                    <select
                      value={rule.sourceField}
                      onChange={e => updateRule(rule.targetField, e.target.value)}
                      className={`w-full text-xs rounded-md border px-2 py-1.5 h-7 bg-white font-sans
                        focus:outline-none focus:ring-1 focus:ring-ink-400
                        ${rule.sourceField ? 'border-teal-400 bg-teal-50 text-teal-900' : 'border-ink-200 text-ink-700'}`}>
                      <option value="">— aucun —</option>
                      {source.headers.map(h => (
                        <option key={h} value={h}>{h} ({source.types[h]})</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 border-b border-ink-50">
                    {rule.srcType && <TypeBadge type={rule.srcType} />}
                  </td>
                  <td className="px-3 py-2 border-b border-ink-50">
                    <CompatBadge compat={rule.compat} />
                  </td>
                  <td className="px-3 py-2 border-b border-ink-50">
                    {rule.transformOptions.length > 0 ? (
                      <select
                        value={rule.transform}
                        onChange={e => updateTransform(rule.targetField, e.target.value)}
                        className="w-full text-xs rounded-md border border-ink-200 px-2 py-1.5 h-7 bg-white font-sans focus:outline-none focus:ring-1 focus:ring-ink-400 text-ink-700">
                        <option value="none">Aucune</option>
                        {rule.transformOptions.map(([val, lbl]) => (
                          <option key={val} value={val}>{lbl}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-ink-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between">
        <Btn variant="outline" onClick={onBack}>
          <ArrowLeft size={14} /> Retour
        </Btn>
        <Btn variant="primary" onClick={onNext}>
          Aperçu & export <ArrowRight size={14} />
        </Btn>
      </div>
    </div>
  )
}
