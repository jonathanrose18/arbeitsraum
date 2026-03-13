'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { type ZodObject, type ZodRawShape, type ZodType } from 'zod'

import type { CommittedLine, FieldDef } from '../types'
import { useFormPhases } from './use-form-phases'

interface Options {
  fields: FieldDef[]
  schema: ZodObject<ZodRawShape>
  onSubmit: (
    values: Record<string, string>,
  ) => Promise<{ error?: { message?: string } | null }>
  onSuccess: () => void
}

export function useTerminalForm({
  fields,
  schema,
  onSubmit,
  onSuccess,
}: Options) {
  const defaultValues = useMemo(
    () =>
      Object.fromEntries(fields.map((f) => [f.name, ''])) as Record<
        string,
        string
      >,
    [fields],
  )

  const [draft, setDraft] = useState('')
  const [lines, setLines] = useState<CommittedLine[]>([])
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (successTimerRef.current !== null)
        clearTimeout(successTimerRef.current)
    }
  }, [])

  const {
    phase,
    currentField,
    isFieldActive,
    canReset,
    advanceField,
    setSuccess,
    setError,
    reset: resetPhase,
  } = useFormPhases({ fields })

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ({ value }) => {
        const result = schema.safeParse(value)
        if (!result.success) {
          return result.error.issues[0]?.message ?? 'Validation failed.'
        }
      },
    },
    onSubmit: async ({ value }) => {
      const result = await onSubmit(value)
      if (result?.error) {
        setSubmitError(result.error.message ?? 'An error occurred.')
        setError(() => {
          setLines([])
          setDraft('')
          setFieldError(null)
          setSubmitError('')
          form.reset()
        })
      } else {
        setSuccess()
        successTimerRef.current = setTimeout(onSuccess, 1800)
      }
    },
  })

  useEffect(() => {
    if (isFieldActive) inputRef.current?.focus()
  }, [isFieldActive, phase])

  function handleDraftChange(value: string) {
    if (fieldError) setFieldError(null)
    setDraft(value)
  }

  function handleReset() {
    if (!canReset) return
    if (successTimerRef.current !== null) {
      clearTimeout(successTimerRef.current)
      successTimerRef.current = null
    }
    setLines([])
    setDraft('')
    setFieldError(null)
    setSubmitError('')
    form.reset()
    resetPhase()
  }

  function handleEnter() {
    if (!draft.trim()) return
    if (!currentField) return

    const fieldSchema = schema.shape[currentField.name] as ZodType | undefined
    const result = fieldSchema?.safeParse(draft)
    if (result && !result.success) {
      setFieldError(result.error.issues[0]?.message ?? 'Invalid value.')
      return
    }

    form.setFieldValue(currentField.name, draft)
    setLines((prev) => [
      ...prev,
      {
        prompt: currentField.name,
        value: draft,
        masked: !!currentField.masked,
      },
    ])
    setDraft('')

    const isLastField = advanceField()
    if (isLastField) {
      void form.handleSubmit()
    }
  }

  const displayDraft = currentField?.masked ? '•'.repeat(draft.length) : draft

  return {
    draft,
    currentField,
    displayDraft,
    fieldError,
    inputRef,
    isFieldActive,
    lines,
    phase,
    submitError,
    handleDraftChange,
    handleEnter,
    handleReset,
  }
}
