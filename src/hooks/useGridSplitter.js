import { useState, useCallback, useMemo } from 'react'
import { parseFileRaw } from '../lib/parser'
import { autoDetectConfig, buildGrids, detectRepetitions } from '../lib/gridSplitter'

export const GRID_STEPS = { IMPORT: 1, CONFIG: 2, EXPORT: 3 }

const emptyData = () => ({ file: null, data: [], sheetNames: [], selectedSheet: null })

export function useGridSplitter() {
  const [step, setStep] = useState(GRID_STEPS.IMPORT)
  const [source, setSource] = useState(emptyData())
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadFile = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    try {
      const result = await parseFileRaw(file)
      const data = result.data
      const cfg = autoDetectConfig(data)
      setSource({ file, data, sheetNames: result.sheetNames, selectedSheet: result.selectedSheet })
      setConfig(cfg)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateConfig = useCallback((patch) => {
    setConfig(prev => {
      const next = { ...prev, ...patch }
      return recomputeRepetitions(source.data, next)
    })
  }, [source.data])

  const grids = useMemo(() => {
    if (!config || !source.data.length) return []
    try {
      return buildGrids(source.data, config)
    } catch {
      return []
    }
  }, [source.data, config])

  const reset = useCallback(() => {
    setSource(emptyData())
    setConfig(null)
    setStep(GRID_STEPS.IMPORT)
    setError(null)
  }, [])

  return {
    step, setStep,
    source, config, grids,
    loading, error,
    loadFile, updateConfig, reset,
    canProceed: !!config && config.hLabels.length > 0 && config.vLabels.length > 0,
  }
}

// Recalcule les répétitions détectées quand l'utilisateur change une ligne/colonne de référence.
function recomputeRepetitions(data, cfg) {
  const hSeq = (data[cfg.hLabelRow] || []).slice(cfg.bodyCol)
  const hRep = detectRepetitions(hSeq)
  const vSeq = []
  for (let r = cfg.bodyRow; r < data.length; r++) {
    vSeq.push(data[r] ? data[r][cfg.vLabelCol] : null)
  }
  const vRep = detectRepetitions(vSeq)
  return {
    ...cfg,
    hLabels: hRep.labels, hPeriod: hRep.period, hBlocks: hRep.blocks,
    vLabels: vRep.labels, vPeriod: vRep.period, vBlocks: vRep.blocks,
  }
}
