// Logique d'éclatement de grilles croisées (générique).
// Un fichier source superpose plusieurs grilles tarifaires sur deux axes imbriqués :
//   - axe horizontal : une ligne de "labels" répétés (ex: Fenêtre/Volet/Store) + une ligne de "dimensions" (largeurs)
//   - axe vertical   : une colonne de "labels" répétés (ex: Dormant 100/110/120) + une colonne de "dimensions" (hauteurs)
// L'éclatement reconstitue une grille par couple (label horizontal × label vertical).

// data : tableau 2D (lignes de cellules), tel que renvoyé par le parser (valeurs brutes).

function nonEmpty(v) {
  return v !== null && v !== undefined && String(v).trim() !== ''
}

// Détecte la période de répétition d'une séquence de labels.
// Retourne { labels: [...uniques], period, blocks }.
export function detectRepetitions(seq) {
  const vals = seq.filter(nonEmpty)
  const n = vals.length
  if (n === 0) return { labels: [], period: 0, blocks: 0 }
  for (let p = 1; p <= Math.floor(n / 2); p++) {
    if (n % p !== 0) continue
    const block = vals.slice(0, p)
    let ok = true
    for (let i = 0; i < n; i++) {
      if (String(vals[i]) !== String(block[i % p])) { ok = false; break }
    }
    if (ok) return { labels: block, period: p, blocks: n / p }
  }
  return { labels: vals, period: n, blocks: 1 }
}

// Propose une configuration automatique à partir des données brutes.
// Hypothèses par défaut (ajustables ensuite dans l'UI) :
//   - ligne 0 = labels horizontaux, ligne 1 = dimensions horizontales
//   - colonne 0 = labels verticaux, colonne 1 = dimensions verticales
//   - le corps des valeurs commence en (2, 2)
export function autoDetectConfig(data) {
  const hLabelRow = 0
  const hDimRow = 1
  const vLabelCol = 0
  const vDimCol = 1
  const bodyRow = 2
  const bodyCol = 2

  const hSeq = (data[hLabelRow] || []).slice(bodyCol)
  const hRep = detectRepetitions(hSeq)

  const vSeq = []
  for (let r = bodyRow; r < data.length; r++) {
    vSeq.push(data[r] ? data[r][vLabelCol] : null)
  }
  const vRep = detectRepetitions(vSeq)

  return {
    hLabelRow, hDimRow, vLabelCol, vDimCol, bodyRow, bodyCol,
    hLabels: hRep.labels, hPeriod: hRep.period, hBlocks: hRep.blocks,
    vLabels: vRep.labels, vPeriod: vRep.period, vBlocks: vRep.blocks,
  }
}

// Extrait les dimensions (une par bloc) à partir de la ligne/colonne de dimensions.
export function extractDimensions(data, config) {
  const { hDimRow, vDimCol, bodyRow, bodyCol, hPeriod, hBlocks, vPeriod, vBlocks } = config
  const widths = []
  const dimRow = data[hDimRow] || []
  for (let b = 0; b < hBlocks; b++) {
    widths.push(dimRow[bodyCol + b * hPeriod])
  }
  const heights = []
  for (let b = 0; b < vBlocks; b++) {
    const r = data[bodyRow + b * vPeriod]
    heights.push(r ? r[vDimCol] : null)
  }
  return { widths, heights }
}

// Reconstitue toutes les grilles.
// Retourne un tableau d'objets { hLabel, vLabel, name, widths, heights, matrix }.
// matrix[i][j] = valeur pour heights[i] × widths[j].
export function buildGrids(data, config) {
  const { hLabels, vLabels, hPeriod, vPeriod, hBlocks, vBlocks, bodyRow, bodyCol } = config
  const { widths, heights } = extractDimensions(data, config)
  const grids = []
  for (let pi = 0; pi < hLabels.length; pi++) {
    for (let di = 0; di < vLabels.length; di++) {
      const matrix = []
      for (let hb = 0; hb < vBlocks; hb++) {
        const rowVals = []
        for (let wb = 0; wb < hBlocks; wb++) {
          const r = bodyRow + hb * vPeriod + di
          const c = bodyCol + wb * hPeriod + pi
          rowVals.push(data[r] ? data[r][c] : null)
        }
        matrix.push(rowVals)
      }
      grids.push({
        hLabel: hLabels[pi],
        vLabel: vLabels[di],
        name: `${hLabels[pi]} - ${vLabels[di]}`,
        widths,
        heights,
        matrix,
      })
    }
  }
  return grids
}

// Convertit une grille en format "croisé" (AOA prête pour export) :
//   coin vide, puis largeurs en en-tête ; chaque ligne = hauteur + valeurs.
export function gridToCrossAOA(grid) {
  const header = ['', ...grid.widths]
  const rows = grid.heights.map((h, i) => [h, ...grid.matrix[i]])
  return [header, ...rows]
}

// Convertit une grille en format "aplati" (liste) :
//   colonnes : Produit, Dormant, Largeur, Hauteur, Valeur.
export function gridToFlatAOA(grid, hHeader = 'Produit', vHeader = 'Ligne') {
  const header = [hHeader, vHeader, 'Largeur', 'Hauteur', 'Valeur']
  const rows = []
  grid.heights.forEach((h, i) => {
    grid.widths.forEach((w, j) => {
      rows.push([grid.hLabel, grid.vLabel, w, h, grid.matrix[i][j]])
    })
  })
  return [header, ...rows]
}

// Nettoie un nom de grille pour en faire un nom d'onglet Excel valide (<=31 car, sans caractères interdits).
export function sanitizeSheetName(name, index) {
  let clean = String(name).replace(/[\\/?*[\]:]/g, '-').trim()
  if (clean.length > 31) clean = clean.slice(0, 31)
  if (!clean) clean = `Grille ${index + 1}`
  return clean
}
