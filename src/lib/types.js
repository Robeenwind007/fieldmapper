export const TYPES = ['text', 'number', 'date', 'bool', 'empty']

export const TYPE_LABELS = {
  text:   'texte',
  number: 'nombre',
  date:   'date',
  bool:   'booléen',
  empty:  'vide',
}

const BOOL_SET = new Set(['true','false','oui','non','yes','no','1','0','vrai','faux'])

export function detectType(values) {
  const nonEmpty = values.filter(v => v !== '' && v != null)
  if (!nonEmpty.length) return 'empty'
  let nums = 0, dates = 0, bools = 0
  nonEmpty.forEach(v => {
    const s = String(v).trim().toLowerCase()
    if (BOOL_SET.has(s)) bools++
    else if (!isNaN(Number(String(v).replace(',', '.')))) nums++
    else if (!isNaN(Date.parse(String(v)))) dates++
  })
  const n = nonEmpty.length
  if (bools / n > 0.7) return 'bool'
  if (nums  / n > 0.7) return 'number'
  if (dates / n > 0.7) return 'date'
  return 'text'
}

export function detectFileTypes(headers, data) {
  const types = {}
  headers.forEach(h => {
    types[h] = detectType(data.map(r => r[h] ?? ''))
  })
  return types
}

export function getCompatibility(srcType, tgtType) {
  if (!srcType || srcType === 'empty') return null
  if (srcType === tgtType) return 'ok'
  return 'warn'
}

export function getTransformOptions(srcType, tgtType) {
  if (!srcType || srcType === 'empty' || srcType === tgtType) return []
  const opts = []
  if (tgtType === 'number' && srcType === 'text') {
    opts.push(['parse_num',     'Extraire le nombre'])
    opts.push(['strip_non_num', 'Supprimer non-numériques'])
  }
  if (tgtType === 'text' && srcType === 'number') {
    opts.push(['to_str',    'Convertir en texte'])
    opts.push(['format_fr', 'Format FR (virgule décimale)'])
    opts.push(['format_en', 'Format EN (point décimal)'])
  }
  if (tgtType === 'date' && srcType === 'text') {
    opts.push(['parse_date', 'Parser la date'])
    opts.push(['iso_date',   'Forcer ISO (AAAA-MM-JJ)'])
  }
  if (tgtType === 'text' && srcType === 'date') {
    opts.push(['date_fr',  'Format FR (JJ/MM/AAAA)'])
    opts.push(['date_iso', 'Format ISO'])
    opts.push(['date_en',  'Format EN (MM/DD/YYYY)'])
  }
  if (tgtType === 'text' && srcType === 'bool') {
    opts.push(['bool_oui_non',    'Oui / Non'])
    opts.push(['bool_true_false', 'True / False'])
    opts.push(['bool_1_0',        '1 / 0'])
  }
  if (tgtType === 'bool' && srcType === 'number') {
    opts.push(['num_bool', '0=faux, autre=vrai'])
  }
  if (tgtType === 'text') {
    opts.push(['uppercase', 'MAJUSCULES'])
    opts.push(['lowercase', 'minuscules'])
    opts.push(['trim',      'Trim espaces'])
  }
  if (tgtType === 'number' || srcType === 'number') {
    opts.push(['round',  'Arrondir entier'])
    opts.push(['round2', 'Arrondir 2 décimales'])
  }
  return opts
}

export function applyTransform(val, transform) {
  if (!transform || transform === 'none') return val
  const s = String(val ?? '').trim()
  switch (transform) {
    case 'parse_num': {
      const n = parseFloat(s.replace(',', '.'))
      return isNaN(n) ? '' : n
    }
    case 'strip_non_num': {
      const n = parseFloat(s.replace(/[^0-9.,-]/g, '').replace(',', '.'))
      return isNaN(n) ? '' : n
    }
    case 'to_str':    return s
    case 'format_fr': { const n = parseFloat(s); return isNaN(n) ? s : n.toString().replace('.', ',') }
    case 'format_en': { const n = parseFloat(s.replace(',', '.')); return isNaN(n) ? s : n.toString() }
    case 'parse_date': { const d = new Date(s); return isNaN(d) ? s : d.toLocaleDateString('fr-FR') }
    case 'iso_date':   { const d = new Date(s); return isNaN(d) ? s : d.toISOString().split('T')[0] }
    case 'date_fr':    { const d = new Date(s); return isNaN(d) ? s : d.toLocaleDateString('fr-FR') }
    case 'date_iso':   { const d = new Date(s); return isNaN(d) ? s : d.toISOString().split('T')[0] }
    case 'date_en':    { const d = new Date(s); return isNaN(d) ? s : d.toLocaleDateString('en-US') }
    case 'bool_oui_non': {
      const b = s === '1' || ['true','vrai','oui','yes'].includes(s.toLowerCase())
      return b ? 'Oui' : 'Non'
    }
    case 'bool_true_false': {
      const b = s === '1' || ['true','vrai','oui'].includes(s.toLowerCase())
      return b ? 'True' : 'False'
    }
    case 'bool_1_0': {
      const b = s === '1' || ['true','vrai','oui','yes'].includes(s.toLowerCase())
      return b ? '1' : '0'
    }
    case 'num_bool':  return (parseFloat(s) || 0) !== 0 ? 'true' : 'false'
    case 'uppercase': return s.toUpperCase()
    case 'lowercase': return s.toLowerCase()
    case 'trim':      return s.trim()
    case 'round': {
      const n = parseFloat(s.replace(',', '.'))
      return isNaN(n) ? s : Math.round(n)
    }
    case 'round2': {
      const n = parseFloat(s.replace(',', '.'))
      return isNaN(n) ? s : Number(n.toFixed(2))
    }
    default: return val
  }
}
