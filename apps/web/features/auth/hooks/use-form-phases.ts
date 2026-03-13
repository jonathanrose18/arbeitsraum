'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { FieldDef } from '../types'

const DEFAULT_INTRO_DURATION = 2200
const DEFAULT_ERROR_RECOVERY_DELAY = 1800

interface Options {
  fields: FieldDef[]
  introDuration?: number
  errorRecoveryDelay?: number
}

export interface FormPhasesApi {
  phase: string
  currentField: FieldDef | null
  isFieldActive: boolean
  canReset: boolean
  /** Advance to the next field. Returns true when transitioning to 'submitting'. */
  advanceField: () => boolean
  setSuccess: () => void
  setError: (onRecovered?: () => void) => void
  reset: () => void
}

export function useFormPhases({
  fields,
  introDuration = DEFAULT_INTRO_DURATION,
  errorRecoveryDelay = DEFAULT_ERROR_RECOVERY_DELAY,
}: Options): FormPhasesApi {
  const firstField = fields[0]!.name
  const [phase, setPhase] = useState<string>('intro')
  const recoveryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (recoveryTimerRef.current !== null)
        clearTimeout(recoveryTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setPhase(firstField), introDuration)
    return () => clearTimeout(t)
  }, [firstField, introDuration])

  const advanceField = useCallback((): boolean => {
    const currentIndex = fields.findIndex((f) => f.name === phase)
    if (currentIndex === -1) return false
    const nextField = fields[currentIndex + 1]
    if (nextField) {
      setPhase(nextField.name)
      return false
    }
    setPhase('submitting')
    return true
  }, [phase, fields])

  const setSuccess = useCallback(() => {
    setPhase('success')
  }, [])

  const setError = useCallback(
    (onRecovered?: () => void) => {
      if (recoveryTimerRef.current !== null)
        clearTimeout(recoveryTimerRef.current)
      setPhase('error')
      recoveryTimerRef.current = setTimeout(() => {
        recoveryTimerRef.current = null
        setPhase(firstField)
        onRecovered?.()
      }, errorRecoveryDelay)
    },
    [firstField, errorRecoveryDelay],
  )

  const reset = useCallback(() => {
    if (phase === 'submitting' || phase === 'intro') return
    if (recoveryTimerRef.current !== null) {
      clearTimeout(recoveryTimerRef.current)
      recoveryTimerRef.current = null
    }
    setPhase(firstField)
  }, [phase, firstField])

  const currentField = fields.find((f) => f.name === phase) ?? null
  const isFieldActive = currentField !== null
  const canReset = phase !== 'submitting' && phase !== 'intro'

  return {
    phase,
    currentField,
    isFieldActive,
    canReset,
    advanceField,
    setSuccess,
    setError,
    reset,
  }
}
