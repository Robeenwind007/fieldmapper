import { useState, useCallback } from 'react'
import { parseFile } from '../lib/parser'
import { detectFileTypes, getCompatibility, getTransformOptions } from '../lib/types'

export const STEPS = { IMPORT: 1, MAPPING: 2, EXPORT: 3 }
export const CONSTANT_FIELD = '__constant__'

const emptyFile = () => ({ file: null, headers: [], data: [], types: {} })

export function useMapper() {
  const [step, setStep]     = useState(STEPS.IMPORT)
  const [source, setSource] = useState(emptyFile())
  const [target, setTarget] = useState(emptyFile())
  const [rules, setRules]   = useState([])
  const [loading, setLoading] = useState({ source: false, target: false })
  const [errors, setErrors]   = useState({ source: null, target: null })

  const loadFile = useCallback(async (which, file) => {
    setLoading(l => ({ ...l, [which]: true }))
    setErrors(e => ({ ...e, [which]: null }))
    try {
      const { headers, data } = await parseFile(file)
      const types = detectFileTypes(headers, data)
      const state = { file, headers, data, types }
      if (which === 'source') setSource(state)
      else setTarget(state)
    } catch (err) {
      setErrors(e => ({ ...e, [which]: err.message }))
    } finally {
      setLoading(l => ({ ...l, [which]: false }))
    }
  }, [])

  const buildRules = useCallback(() => {
    const newRules = target.headers.map(tgtField => {
      const existing = rules.find(r => r.targetField === tgtField)
      if (existing) return existing
      const autoMatch = source.headers.find(
        s => s.toLowerCase().trim() === tgtField.toLowerCase().trim()
      )
      return {
        targetField: tgtField,
        sourceField: autoMatch || '',
        transform:   'none',
        constantValue: '',
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

  const updateTransform = useCallback((targetField, transform) => {
    setRules(prev => prev.map(r =>
      r.targetField === targetField ? { ...r, transform } : r
    ))
  }, [])

  const updateConstant = useCallback((targetField, constantValue) => {
    setRules(prev => prev.map(r =>
      r.targetField === targetField ? { ...r, constantValue } : r
    ))
  }, [])

  const loadSavedMapping = useCallback((savedRules) => {
    setRules(savedRules.map(r => ({
      targetField: r.targetField,
      sourceField: r.sourceField === CONSTANT_FIELD
        ? CONSTANT_FIELD
        : (source.headers.includes(r.sourceField) ? r.sourceField : ''),
      transform:   r.transform || 'none',
      constantValue: r.constantValue || '',
    })))
  }, [source.headers])

  const isRuleFilled = r => {
    if (!r.sourceField) return false
    if (r.sourceField === CONSTANT_FIELD) return r.constantValue !== '' && r.constantValue != null
    return true
  }

  const stats = {
    rows:    source.data.length,
    mapped:  rules.filter(isRuleFilled).length,
    total:   rules.length,
    transf:  rules.filter(r => r.sourceField && r.sourceField !== CONSTANT_FIELD && r.transform && r.transform !== 'none').length,
    warns:   rules.filter(r => {
      if (!r.sourceField || r.sourceField === CONSTANT_FIELD) return false
      return getCompatibility(source.types[r.sourceField], target.types[r.targetField]) === 'warn'
    }).length,
  }

  const enrichedRules = rules.map(r => {
    const isConstant = r.sourceField === CONSTANT_FIELD
    return {
      ...r,
      isConstant,
      srcType:    (r.sourceField && !isConstant) ? source.types[r.sourceField] : null,
      tgtType:    target.types[r.targetField],
      compat:     (r.sourceField && !isConstant)
        ? getCompatibility(source.types[r.sourceField], target.types[r.targetField])
        : null,
      transformOptions: (r.sourceField && !isConstant)
        ? getTransformOptions(source.types[r.sourceField], target.types[r.targetField])
        : [],
    }
  })

  const canProceed = source.headers.length > 0 && target.headers.length > 0

  return {
    step, setStep,
    source, target,
    rules, enrichedRules,
    loading, errors,
    stats,
    canProceed,
    loadFile,
    buildRules,
    updateRule,
    updateTransform,
    updateConstant,
    loadSavedMapping,
  }
}
