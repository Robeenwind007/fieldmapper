import { useState, useCallback } from 'react'
import { parseFile, parseSheetFromWb, parseAllSheetsFromWb, parseSelectedSheetsFromWb } from '../lib/parser'
import { detectFileTypes, getCompatibility, getTransformOptions } from '../lib/types'

export const STEPS = { IMPORT: 1, MAPPING: 2, EXPORT: 3 }
export const CONSTANT_FIELD = '__constant__'

const emptyFile = () => ({ file: null, headers: [], data: [], types: {}, sheetNames: [], selectedSheet: null, multiSheet: false, wb: null })

export function useMapper() {
  const [step, setStep] = useState(STEPS.IMPORT)
  const [source, setSource] = useState(emptyFile())
  const [target, setTarget] = useState(emptyFile())
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState({ source: false, target: false })
  const [errors, setErrors] = useState({ source: null, target: null })
  const [savedMappingName, setSavedMappingName] = useState(null)
  const [pendingSheet, setPendingSheet] = useState(null)
  const [activeTargetSheet, setActiveTargetSheet] = useState(null)
  const [sheetRules, setSheetRules] = useState({})
  const [targetOnlyMode, setTargetOnlyMode] = useState(false)

  const loadFile = useCallback(async (which, file) => {
    setLoading(l => ({ ...l, [which]: true }))
    setErrors(e => ({ ...e, [which]: null }))
    try {
      const result = await parseFile(file)
      if (which === 'source') setTargetOnlyMode(false)
      if (result.multiSheet) {
        if (which === 'source') {
          setSource(emptyFile())
          setPendingSheet({ which: 'source', file, wb: result.wb, sheetNames: result.sheetNames })
        } else {
          setTarget(emptyFile())
          setPendingSheet({ which: 'target', file, wb: result.wb, sheetNames: result.sheetNames })
          setSavedMappingName(null)
        }
      } else {
        const types = detectFileTypes(result.headers, result.data)
        const state = { file, headers: result.headers, data: result.data, types, sheetNames: result.sheetNames, selectedSheet: result.selectedSheet, multiSheet: false, wb: null }
        if (which === 'source') setSource(state)
        else { setTarget(state); setSavedMappingName(null) }
        setPendingSheet(null)
      }
    } catch (err) {
      setErrors(e => ({ ...e, [which]: err.message }))
    } finally {
      setLoading(l => ({ ...l, [which]: false }))
    }
  }, [])

  const resolveSheetChoice = useCallback(async (which, choice, selectedSheets) => {
    const pending = pendingSheet
    if (!pending) return
    setLoading(l => ({ ...l, [which]: true }))
    try {
      let headers, data
      if (choice === 'single') {
        const result = parseSheetFromWb(pending.wb, selectedSheets[0])
        headers = result.headers
        data = result.data
      } else if (choice === 'merge_all') {
        const result = parseAllSheetsFromWb(pending.wb)
        headers = result.headers
        data = result.data
      } else if (choice === 'merge_selected') {
        const result = parseSelectedSheetsFromWb(pending.wb, selectedSheets)
        headers = result.headers
        data = result.data
      } else if (choice === 'per_sheet') {
        const firstSheet = selectedSheets[0]
        const result = parseSheetFromWb(pending.wb, firstSheet)
        headers = result.headers
        data = result.data
        setActiveTargetSheet(firstSheet)
        const newSheetRules = {}
        pending.sheetNames.forEach(name => { newSheetRules[name] = [] })
        setSheetRules(newSheetRules)
      }
      const types = detectFileTypes(headers, data)
      const state = {
        file: pending.file,
        headers,
        data,
        types,
        sheetNames: pending.sheetNames,
        selectedSheet: selectedSheets[0],
        multiSheet: choice === 'per_sheet',
        wb: pending.wb,
        perSheet: choice === 'per_sheet',
      }
      if (which === 'source') setSource(state)
      else { setTarget(state); setSavedMappingName(null) }
      setPendingSheet(null)
    } catch (err) {
      setErrors(e => ({ ...e, [which]: err.message }))
    } finally {
      setLoading(l => ({ ...l, [which]: false }))
    }
  }, [pendingSheet])

  const switchTargetSheet = useCallback((sheetName) => {
    if (!target.wb) return
    const current = rules
    setSheetRules(prev => ({ ...prev, [activeTargetSheet]: current }))
    const result = parseSheetFromWb(target.wb, sheetName)
    const types = detectFileTypes(result.headers, result.data)
    setTarget(t => ({ ...t, headers: result.headers, data: result.data, types, selectedSheet: sheetName }))
    setActiveTargetSheet(sheetName)
    const saved = sheetRules[sheetName] || []
    setRules(saved)
  }, [target, rules, activeTargetSheet, sheetRules])

  const saveCurrentSheetRules = useCallback(() => {
    if (activeTargetSheet) {
      setSheetRules(prev => ({ ...prev, [activeTargetSheet]: rules }))
    }
  }, [activeTargetSheet, rules])

  const restorePendingSheet = useCallback(() => {
    if (source.wb && source.sheetNames.length > 1) {
      setPendingSheet({ which: 'source', file: source.file, wb: source.wb, sheetNames: source.sheetNames })
      setSource(emptyFile())
    }
    if (target.wb && target.sheetNames.length > 1) {
      setPendingSheet({ which: 'target', file: target.file, wb: target.wb, sheetNames: target.sheetNames })
      setTarget(emptyFile())
    }
  }, [source, target])

  const buildRules = useCallback(() => {
    const newRules = target.headers.map(tgtField => {
      const existing = rules.find(r => r.targetField === tgtField)
      if (existing && existing.sourceField) return existing
      const autoMatch = source.headers.find(
        s => s.toLowerCase().trim() === tgtField.toLowerCase().trim()
      )
      return {
        targetField: tgtField,
        sourceField: autoMatch || existing?.sourceField || '',
        transform: existing?.transform || 'none',
        constantValue: existing?.constantValue || '',
      }
    })
    setRules(newRules)
  }, [target.headers, source.headers, rules])

  const updateRule = useCallback((targetField, sourceField) => {
    setRules(prev => prev.map(r =>
      r.targetField === targetField
        ? { ...r, sourceField, transform: 'none', constantValue: sourceField === CONSTANT_FIELD ? r.constantValue : '' }
        : r
    ))
  }, [])

  const updateConstant = useCallback((targetField, constantValue) => {
    setRules(prev => prev.map(r =>
      r.targetField === targetField ? { ...r, constantValue } : r
    ))
  }, [])

  const updateTransform = useCallback((targetField, transform) => {
    setRules(prev => prev.map(r =>
      r.targetField === targetField ? { ...r, transform } : r
    ))
  }, [])

  const loadSavedMapping = useCallback((saved) => {
    const parsedRules = typeof saved.rules === 'string'
      ? JSON.parse(saved.rules)
      : saved.rules
    const targetHeaders = parsedRules.map(r => r.targetField)
    const targetTypes = {}
    parsedRules.forEach(r => {
      if (r.targetType) targetTypes[r.targetField] = r.targetType
    })
    setTarget({
      file: null,
      headers: targetHeaders,
      data: [],
      types: targetTypes,
      fromSaved: true,
      filename: saved.target_file,
      sheetNames: [],
      multiSheet: false,
      wb: null,
    })
    setSavedMappingName(saved.name)
    setRules(parsedRules.map(r => ({
      targetField: r.targetField,
      sourceField: r.sourceField === CONSTANT_FIELD ? CONSTANT_FIELD : '',
      transform: r.transform || 'none',
      constantValue: r.constantValue || '',
    })))
  }, [])

  const isRuleFilled = r => {
    if (!r.sourceField) return false
    if (r.sourceField === CONSTANT_FIELD) return r.constantValue !== '' && r.constantValue != null
    return true
  }

  const stats = {
    rows: source.data.length,
    mapped: rules.filter(isRuleFilled).length,
    total: rules.length,
    transf: rules.filter(r => r.sourceField && r.sourceField !== CONSTANT_FIELD && r.transform && r.transform !== 'none').length,
    warns: rules.filter(r => {
      if (!r.sourceField || r.sourceField === CONSTANT_FIELD) return false
      return getCompatibility(source.types[r.sourceField], target.types[r.targetField]) === 'warn'
    }).length,
  }

  const enrichedRules = rules.map(r => {
    const isConstant = r.sourceField === CONSTANT_FIELD
    return {
      ...r,
      isConstant,
      srcType: (r.sourceField && !isConstant) ? source.types[r.sourceField] : null,
      tgtType: target.types[r.targetField],
      compat: (r.sourceField && !isConstant)
        ? getCompatibility(source.types[r.sourceField], target.types[r.targetField])
        : null,
      transformOptions: (r.sourceField && !isConstant)
        ? getTransformOptions(source.types[r.sourceField], target.types[r.targetField])
        : [],
    }
  })

  return {
    step, setStep,
    source, target,
    rules, enrichedRules,
    loading, errors,
    stats,
    savedMappingName,
    pendingSheet,
    activeTargetSheet,
    sheetRules,
    targetOnlyMode,
    enableTargetOnlyMode: () => setTargetOnlyMode(true),
    disableTargetOnlyMode: () => setTargetOnlyMode(false),
    canProceed: target.headers.length > 0 && !pendingSheet && (targetOnlyMode || source.headers.length > 0),
    loadFile,
    resolveSheetChoice,
    switchTargetSheet,
    saveCurrentSheetRules,
    restorePendingSheet,
    buildRules,
    updateRule,
    updateTransform,
    updateConstant,
    loadSavedMapping,
  }
}
