import { useState } from 'react'
import { ArrowLeft, Download, RotateCcw, Save } from 'lucide-react'
import * as XLSX from 'xlsx'
import { applyTransform } from '../lib/types'
import { CONSTANT_FIELD } from '../hooks/useMapper'
import { StatCard, Alert, Btn } from './UI'
import SaveMappingModal from './SaveMappingModal'

function buildOutputRows(targetHeaders, sourceData, rules) {
  return sourceData.map(row =>
    targetHeaders.map(tgt => {
      const rule = rules.find(r => r.targetField === tgt)
      if (!rule || !rule.sourceField) return ''
      if (rule.sourceField === CONSTANT_FIELD) return rule.constantValue ?? ''
      return applyTransform(row[rule.sourceField] ?? '', rule.transform)
    })
  )
}

function incrementConversionCount() {
  try {
    const current = parseInt(localStorage.getItem('fieldmapper_conversion_count') || '0', 10)
    localStorage.setItem('fieldmapper_conversion_count', String(current + 1))
  } catch {}
}

export default function StepExport({ source, target, rules, stats, sheetRules, onBack, onReset, onExported }) {
  const [exported, setExported] = useState(false)
  const [showSave, setShowSave] = useState(false)

  const isMultiSheet = target.perSheet && target.sheetNames?.length > 0
  const previewCount = Math.min(100, source.data.length)
  const preview = buildOutputRows(target.headers, source.data.slice(0, previewCount), rules)
  const transformedCount = rules.filter(r => r.sourceField && r.transform && r.transform !== 'none').length

  function doExport() {
    const ext = target.file ? target.file.name.split('.').pop().toLowerCase() : 'xlsx'
    const basename = source.file.name.replace(/\.[^.]+$/, '')
    const filename = `converti_${basename}.${ext}`
    const wb = XLSX.utils.book_new()

    if (isMultiSheet && target.wb) {
      target.sheetNames.forEach(sheetName => {
        const sheetRuleSet = sheetRules[sheetName] || []
        const sheetResult = parseSheetForExport(target.wb, sheetName)
        const rows = buildOutputRows(sheetResult.headers, source.data, sheetRuleSet)
        const ws = XLSX.utils.aoa_to_sheet([sheetResult.headers, ...rows])
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
      })
    } else {
      const allRows = buildOutputRows(target.headers, source.data, rules)
      const ws = XLSX.utils.aoa_to_sheet([target.headers, ...allRows])
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    }

    if (ext === 'csv' || ext === 'txt') {
      const ws = wb.Sheets[wb.SheetNames[0]]
      const csv = XLSX.utils.sheet_to_csv(ws)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
    } else {
      XLSX.writeFile(wb, filename)
    }

    incrementConversionCount()
    setExported(true)
    onExported?.()
  }

  function parseSheetForExport(wb, sheetName) {
    const ws = wb.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
    if (!rows.length) return { headers: [], data: [] }
    const headers = rows[0].map(h => String(h).trim()).filter(h => h !== '')
    return { headers }
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard label="Lignes converties" value={stats.rows} />
        <StatCard label="Champs mappés" value={`${stats.mapped}/${stats.total}`} />
        <StatCard label="Transformations" value={transformedCount} />
        <StatCard label="Avertissements" value={stats.warns} />
      </div>

      {isMultiSheet && (
        <div className="mb-4 p-3 bg-cobalt-50 border border-cobalt-200 rounded-lg">
          <p className="text-xs font-medium text-cobalt-800 mb-2">Onglets à exporter</p>
          <div className="flex flex-wrap gap-2">
            {target.sheetNames.map(name => {
              const sr = sheetRules[name] || []
              const mapped = sr.filter(r => r.sourceField).length
              return (
                <span key={name}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border
                    ${mapped > 0 ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-ink-50 border-ink-200 text-ink-500'}`}>
                  {name}
                  <span className="opacity-60">({mapped} champs)</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="border border-ink-100 rounded-xl overflow-hidden mb-4">
        <div className="px-4 py-2.5 bg-ink-50 border-b border-ink-100">
          <p className="text-xs font-medium text-ink-500">
            Aperçu — {source.data.length > previewCount
              ? `${previewCount} premières lignes sur ${source.data.length}`
              : `${previewCount} ligne${previewCount > 1 ? 's' : ''}`}
            {target.selectedSheet && !isMultiSheet && (
              <span className="ml-2 text-ink-400">[{target.selectedSheet}]</span>
            )}
          </p>
        </div>
        <div className="overflow-auto max-h-96">
          <table className="w-full text-xs border-collapse" style={{ tableLayout: 'auto', minWidth: '100%' }}>
            <thead className="sticky top-0 bg-ink-50 z-10">
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
                    const isConstant = rule?.sourceField === CONSTANT_FIELD
                    const transformed = !isConstant && rule?.transform && rule.transform !== 'none'
                    return (
                      <td key={ci}
                        className={`px-3 py-1.5 border-b border-ink-50 truncate
                          ${isConstant ? 'bg-amber-50 text-amber-900' :
                            transformed ? 'bg-teal-50 text-teal-900' :
                            !rule?.sourceField ? 'text-ink-300' : 'text-ink-800'}`}
                        style={{ minWidth: 80 }}>
                        {isConstant
                          ? (rule.constantValue ? String(cell) : <span className="italic text-amber-400">vide</span>)
                          : rule?.sourceField ? String(cell) : '—'}
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
