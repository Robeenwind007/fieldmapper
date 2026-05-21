import * as XLSX from 'xlsx'

export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary', cellDates: true })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
        if (!rows.length) return resolve({ headers: [], data: [] })
        const headers = rows[0].map(h => String(h).trim()).filter(h => h !== '')
        const data = rows.slice(1).map(row => {
          const obj = {}
          headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
          return obj
        }).filter(row => Object.values(row).some(v => v !== ''))
        resolve({ headers, data })
      } catch (err) {
        reject(new Error(`Impossible de lire le fichier : ${err.message}`))
      }
    }
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
    reader.readAsBinaryString(file)
  })
}

export function exportFile(targetHeaders, sourceData, mappingRules, outputExt) {
  const rows = [targetHeaders]
  sourceData.forEach(row => {
    rows.push(
      targetHeaders.map(tgt => {
        const rule = mappingRules.find(r => r.targetField === tgt)
        if (!rule || !rule.sourceField) return ''
        const { applyTransform } = require('./types')
        return applyTransform(row[rule.sourceField] ?? '', rule.transform)
      })
    )
  })
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(rows)
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  return { wb, ws }
}

export function downloadWorkbook(wb, filename, ext) {
  if (ext === 'csv' || ext === 'txt') {
    const ws = wb.Sheets[wb.SheetNames[0]]
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
    triggerDownload(URL.createObjectURL(blob), filename)
  } else {
    XLSX.writeFile(wb, filename)
  }
}

function triggerDownload(url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
