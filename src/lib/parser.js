import * as XLSX from 'xlsx'

export function parseFile(file, sheetName = null) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary', cellDates: true })
        const sheetNames = wb.SheetNames

        if (sheetNames.length > 1 && !sheetName) {
          resolve({ multiSheet: true, sheetNames, wb, file })
          return
        }

        const targetSheet = sheetName || sheetNames[0]
        const ws = wb.Sheets[targetSheet]
        const { headers, data } = parseSheet(ws)
        resolve({ multiSheet: false, headers, data, sheetNames, selectedSheet: targetSheet })
      } catch (err) {
        reject(new Error(`Impossible de lire le fichier : ${err.message}`))
      }
    }
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
    reader.readAsBinaryString(file)
  })
}

export function parseSheetFromWb(wb, sheetName) {
  const ws = wb.Sheets[sheetName]
  return parseSheet(ws)
}

export function parseAllSheetsFromWb(wb, keyField = 'Reference_Fabricant') {
  const sheetNames = wb.SheetNames
  const allData = {}
  sheetNames.forEach(name => {
    const { headers, data } = parseSheet(wb.Sheets[name])
    allData[name] = { headers, data }
  })

  const baseSheet = sheetNames[0]
  const base = allData[baseSheet]
  const mergedHeaders = [...base.headers]
  const mergedData = base.data.map(row => ({ ...row }))

  sheetNames.slice(1).forEach(name => {
    const sheet = allData[name]
    sheet.headers.forEach(h => {
      if (!mergedHeaders.includes(h) && h !== keyField) {
        mergedHeaders.push(h)
      }
    })
    sheet.data.forEach(row => {
      const key = row[keyField]
      const target = mergedData.find(r => r[keyField] === key)
      if (target) {
        sheet.headers.forEach(h => {
          if (h !== keyField) target[h] = row[h]
        })
      }
    })
  })

  return { headers: mergedHeaders, data: mergedData }
}

export function parseSelectedSheetsFromWb(wb, selectedSheets, keyField = 'Reference_Fabricant') {
  const allData = {}
  selectedSheets.forEach(name => {
    const { headers, data } = parseSheet(wb.Sheets[name])
    allData[name] = { headers, data }
  })

  const base = allData[selectedSheets[0]]
  const mergedHeaders = [...base.headers]
  const mergedData = base.data.map(row => ({ ...row }))

  selectedSheets.slice(1).forEach(name => {
    const sheet = allData[name]
    sheet.headers.forEach(h => {
      if (!mergedHeaders.includes(h) && h !== keyField) {
        mergedHeaders.push(h)
      }
    })
    sheet.data.forEach(row => {
      const key = row[keyField]
      const target = mergedData.find(r => r[keyField] === key)
      if (target) {
        sheet.headers.forEach(h => {
          if (h !== keyField) target[h] = row[h]
        })
      }
    })
  })

  return { headers: mergedHeaders, data: mergedData }
}

function parseSheet(ws) {
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  if (!rows.length) return { headers: [], data: [] }
  const headers = rows[0].map(h => String(h).trim()).filter(h => h !== '')
  const data = rows.slice(1).map(row => {
    const obj = {}
    headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
    return obj
  }).filter(row => Object.values(row).some(v => v !== ''))
  return { headers, data }
}

export function exportMultiSheet(sheets) {
  const wb = XLSX.utils.book_new()
  sheets.forEach(({ name, headers, rows }) => {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    XLSX.utils.book_append_sheet(wb, ws, name)
  })
  return wb
}

export function exportSingleSheet(headers, rows) {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  return wb
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
