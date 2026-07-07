import { useState } from 'react'
import { ArrowLeft, Download, RotateCcw } from 'lucide-react'
import * as XLSX from 'xlsx'
import { gridToCrossAOA, gridToFlatAOA, sanitizeSheetName } from '../lib/gridSplitter'
import { Btn, Alert, StatCard } from './UI'

function OptionCard({ active, onClick, title, desc }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-left p-3 rounded-xl border transition-colors ${active ? 'border-bordeaux-500 bg-bordeaux-50' : 'border-ink-200 hover:bg-ink-50'}`}>
      <p className={`text-xs font-medium ${active ? 'text-bordeaux-800' : 'text-ink-700'}`}>{title}</p>
      <p className="text-[11px] text-ink-400 mt-0.5">{desc}</p>
    </button>
  )
}

export default function GridStepExport({ source, config, grids, onBack, onReset }) {
  const [structure, setStructure] = useState('sheets') // 'sheets' | 'files'
  const [format, setFormat] = useState('cross')         // 'cross' | 'flat'
  const [selectedGrid, setSelectedGrid] = useState(0)
  const [exported, setExported] = useState(false)

  const grid = grids[selectedGrid]
  const baseName = source.file ? source.file.name.replace(/\.[^.]+$/, '') : 'grilles'

  function aoaFor(g) {
    return format === 'cross' ? gridToCrossAOA(g) : gridToFlatAOA(g)
  }

  function download(blob, filename) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function doExport() {
    if (structure === 'sheets') {
      const wb = XLSX.utils.book_new()
      grids.forEach((g, i) => {
        const ws = XLSX.utils.aoa_to_sheet(aoaFor(g))
        XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(g.name, i))
      })
      XLSX.writeFile(wb, `${baseName}_grilles.xlsx`)
    } else {
      // Un fichier par grille — on déclenche un téléchargement par grille.
      grids.forEach((g, i) => {
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(aoaFor(g))
        XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(g.name, i))
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        download(new Blob([wbout], { type: 'application/octet-stream' }), `${sanitizeSheetName(g.name, i)}.xlsx`)
      })
    }
    setExported(true)
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Grilles générées" value={grids.length} />
        <StatCard label="Largeurs / grille" value={grid ? grid.widths.length : 0} />
        <StatCard label="Hauteurs / grille" value={grid ? grid.heights.length : 0} />
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-ink-600 mb-2">Structure de sortie</p>
        <div className="flex gap-2">
          <OptionCard active={structure === 'sheets'} onClick={() => setStructure('sheets')}
            title="Un seul fichier, un onglet par grille" desc={`${grids.length} onglets dans un XLSX`} />
          <OptionCard active={structure === 'files'} onClick={() => setStructure('files')}
            title="Un fichier séparé par grille" desc={`${grids.length} fichiers XLSX`} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-ink-600 mb-2">Format de chaque grille</p>
        <div className="flex gap-2">
          <OptionCard active={format === 'cross'} onClick={() => setFormat('cross')}
            title="Grille croisée" desc="Largeurs en colonnes, hauteurs en lignes" />
          <OptionCard active={format === 'flat'} onClick={() => setFormat('flat')}
            title="Liste aplatie" desc="Une ligne par valeur (Produit, Type, Largeur, Hauteur, Valeur)" />
        </div>
      </div>

      <div className="border border-ink-100 rounded-xl overflow-hidden mb-4">
        <div className="px-4 py-2.5 bg-ink-50 border-b border-ink-100 flex items-center justify-between">
          <p className="text-xs font-medium text-ink-500">Aperçu</p>
          <select
            value={selectedGrid}
            onChange={e => setSelectedGrid(Number(e.target.value))}
            className="text-xs rounded-md border border-ink-200 px-2 py-1 bg-white text-ink-700 focus:outline-none">
            {grids.map((g, i) => <option key={i} value={i}>{g.name}</option>)}
          </select>
        </div>
        <div className="overflow-auto max-h-80">
          {grid && (
            <table className="text-xs border-collapse">
              <tbody>
                {aoaFor(grid).map((row, ri) => (
                  <tr key={ri} className={ri === 0 ? 'bg-ink-50 font-medium' : (ri % 2 === 0 ? 'bg-white' : 'bg-ink-50/40')}>
                    {row.map((cell, ci) => {
                      const isHeaderCell = ri === 0 || (format === 'cross' && ci === 0)
                      const disp = typeof cell === 'number' ? Math.round(cell * 100) / 100 : cell
                      return (
                        <td key={ci} className={`border border-ink-100 px-3 py-1.5 min-w-[70px] ${isHeaderCell ? 'text-ink-800 font-medium bg-ink-50/60' : 'text-ink-700'}`}>
                          {disp !== null && disp !== undefined ? String(disp) : ''}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {exported && (
        <Alert type="success">
          {structure === 'sheets'
            ? `Fichier téléchargé — ${grids.length} grilles dans un classeur.`
            : `${grids.length} fichiers téléchargés — une grille par fichier.`}
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <Btn variant="outline" onClick={onBack}>
          <ArrowLeft size={14} /> Retour
        </Btn>
        <Btn variant="ghost" onClick={onReset}>
          <RotateCcw size={14} /> Recommencer
        </Btn>
        <div className="flex-1" />
        <Btn variant="primary" onClick={doExport}>
          <Download size={14} /> Télécharger
        </Btn>
      </div>
    </div>
  )
}
