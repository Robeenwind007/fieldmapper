import { useState } from 'react'
import { ArrowLeft, Download, RotateCcw, Save, BookOpen } from 'lucide-react'
import * as XLSX from 'xlsx'
import { applyTransform } from '../lib/types'
import { StatCard, Alert, Btn } from './UI'
import SaveMappingModal from './SaveMappingModal'

function buildOutputRows(targetHeaders, sourceData, rules) {
  return sourceData.map(row =>
    targetHeaders.map(tgt => {
      const rule = rules.find(r => r.targetField === tgt)
      if (!rule || !rule.sourceField) return ''
      return applyTransform(row[rule.sourceField] ?? '', rule.transform)
    })
  )
}

export default function StepExport({ source, target, rules, stats, onBack, onReset }) {
  const [exported, setExported] = useState(false)
  const [showSave, setShowSave] = useState(false)

  const preview = buildOutputRows(target.headers, source.data.slice(0, 5), rules)
  const transformedCount = rules.filter(r => r.sourceField && r.transform && r.transform !== 'none').length

  function doExport() {
    const allRows = buildOutputRows(target.headers, source.data, rules)
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([target.headers, ...allRows])
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const ext = target.file.name.split('.').pop().toLowerCase()
    const basename = source.file.name.replace(/\.[^.]+$/, '')
    const filename = `converti_${basename}.${ext}`
    if (ext === 'csv' || ext === 'txt') {
      const csv = XLSX.utils.sheet_to_csv(ws)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
    } else {
      XLSX.writeFile(wb, filename)
    }
    setExported(true)
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard label="Lignes converties"  value={stats.rows} />
        <StatCard label="Champs mappés"      value={`${stats.mapped}/${stats.total}`} />
        <StatCard label="Transformations"    value={transformedCount} />
        <StatCard label="Avertissements"     value={stats.warns} />
      </div>

      <div className="border border-ink-100 rounded-xl overflow-hidden mb-4">
        <div className="px-4 py-2.5 bg-ink-50 border-b border-ink-100">
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wide">Aperçu — 5 premières lignes</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {target.headers.map(h => {
                  const rule = rules.find(r => r.targetField === h)
                  return (
                    <th key={h} className={`px-3 py-2 text-left font-medium border-b border-ink-100 truncate
                      ${rule?.sourceField ? 'text-ink-800' : 'text-ink-300'}`}
                      style={{ minWidth: 80 }}>
                      {h}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-ink-50/40'}>
                  {row.map((cell, ci) => {
                    const rule = rules.find(r => r.targetField === target.headers[ci])
                    const transformed = rule?.transform && rule.transform !== 'none'
                    return (
                      <td key={ci}
                        className={`px-3 py-1.5 border-b border-ink-50 truncate
                          ${transformed ? 'bg-teal-50 text-teal-900' :
                            !rule?.sourceField ? 'text-ink-300' : 'text-ink-800'}`}
                        style={{ minWidth: 80 }}>
                        {rule?.sourceField ? String(cell) : '—'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {exported && (
        <Alert type="success">
          Fichier téléchargé — {stats.rows} lignes converties, {stats.mapped} champs mappés.
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <Btn variant="outline" onClick={onBack}>
          <ArrowLeft size={14} /> Modifier
        </Btn>
        <Btn variant="ghost" onClick={onReset}>
          <RotateCcw size={14} /> Recommencer
        </Btn>
        <div className="flex-1" />
        <Btn variant="outline" onClick={() => setShowSave(true)}>
          <Save size={14} /> Sauvegarder le mapping
        </Btn>
        <Btn variant="primary" onClick={doExport}>
          <Download size={14} /> Télécharger
        </Btn>
      </div>

      {showSave && (
        <SaveMappingModal
          source={source}
          target={target}
          rules={rules}
          onClose={() => setShowSave(false)}
        />
      )}
    </div>
  )
}
