import { ArrowLeft, Save, Pin } from 'lucide-react'
import { TypeBadge, Btn, Alert } from './UI'
import { CONSTANT_FIELD } from '../hooks/useMapper'

export default function StepMappingTargetOnly({ target, rules, updateRule, updateConstant, onBack, onSave }) {
  return (
    <div>
      <Alert type="info">
        Mode gabarit — ce mapping ne définit que la structure du fichier cible. Chaque client qui le réutilisera devra associer ses propres colonnes source.
        Vous pouvez, si besoin, pré-remplir une valeur fixe pour certains champs (elle sera proposée mais pas imposée à la sauvegarde).
      </Alert>

      <div className="border border-ink-100 rounded-xl overflow-hidden mb-4">
        <div className="overflow-y-auto max-h-96">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-ink-50 z-10">
              <tr>
                <th className="text-left text-xs font-medium text-ink-500 uppercase tracking-wide px-3 py-2.5 border-b border-ink-100 w-[30%]">Champ cible</th>
                <th className="text-left text-xs font-medium text-ink-500 uppercase tracking-wide px-3 py-2.5 border-b border-ink-100 w-[15%]">Type</th>
                <th className="text-left text-xs font-medium text-ink-500 uppercase tracking-wide px-3 py-2.5 border-b border-ink-100 w-[55%]">Valeur fixe (optionnel)</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, i) => {
                const isConstant = rule.sourceField === CONSTANT_FIELD
                return (
                  <tr key={rule.targetField} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50/40'}>
                    <td className="px-3 py-2 font-medium text-ink-800 border-b border-ink-50">
                      {rule.targetField}
                    </td>
                    <td className="px-3 py-2 border-b border-ink-50">
                      <TypeBadge type={target.types[rule.targetField]} />
                    </td>
                    <td className="px-3 py-2 border-b border-ink-50">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateRule(rule.targetField, isConstant ? '' : CONSTANT_FIELD)}
                          title={isConstant ? 'Retirer la valeur fixe' : 'Activer une valeur fixe pour ce champ'}
                          className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors
                            ${isConstant ? 'border-amber-300 bg-amber-100 text-amber-800' : 'border-ink-200 text-ink-400 hover:bg-ink-50'}`}>
                          <Pin size={11} /> {isConstant ? 'fixe' : 'activer'}
                        </button>
                        {isConstant && (
                          <input
                            type="text"
                            autoFocus
                            value={rule.constantValue}
                            onChange={e => updateConstant(rule.targetField, e.target.value)}
                            placeholder="Valeur fixe…"
                            className="flex-1 text-xs rounded-md border border-amber-300 bg-amber-50 text-amber-900 px-2 py-1.5 h-7 font-sans
                              focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder:text-amber-400"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between">
        <Btn variant="outline" onClick={onBack}>
          <ArrowLeft size={14} /> Retour
        </Btn>
        <Btn variant="primary" onClick={onSave}>
          <Save size={14} /> Sauvegarder ce mapping
        </Btn>
      </div>
    </div>
  )
}
