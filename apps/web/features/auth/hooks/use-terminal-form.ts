'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { type ZodObject, type ZodRawShape, type ZodType } from 'zod'

import type { CommittedLine, FieldDef } from '../types'

const INTRO_DURATION_MS = 2200

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
  const firstField = fields[0]!.name
  const defaultValues = useMemo(
    () =>
      Object.fromEntries(fields.map((f) => [f.name, ''])) as Record<
        string,
        string
      >,
    [fields],
  )

  const [phase, setPhase] = useState('intro')
  const [draft, setDraft] = useState('')
  const [lines, setLines] = useState<CommittedLine[]>([])
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    },
    [],
  )

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
        setPhase('error')
        timeoutRef.current = setTimeout(() => {
          setLines([])
          setDraft('')
          form.reset()
          setPhase(firstField)
        }, 1800)
      } else {
        setPhase('success')
        timeoutRef.current = setTimeout(onSuccess, 1800)
      }
    },
  })

  // Transition from intro animation to the first field
  useEffect(() => {
    const t = setTimeout(() => setPhase(firstField), INTRO_DURATION_MS)
    return () => clearTimeout(t)
  }, [firstField])

  // Focus the hidden input whenever a field is active
  useEffect(() => {
    if (fields.some((f) => f.name === phase)) inputRef.current?.focus()
  }, [phase, fields])

  function handleDraftChange(value: string) {
    if (fieldError) setFieldError(null)
    setDraft(value)
  }

  function handleReset() {
    if (phase === 'submitting' || phase === 'intro') return
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setLines([])
    setDraft('')
    setFieldError(null)
    setSubmitError('')
    form.reset()
    setPhase(firstField)
  }

  function handleEnter() {
    if (!draft.trim()) return

    const fieldIndex = fields.findIndex((f) => f.name === phase)
    if (fieldIndex === -1) return

    const field = fields[fieldIndex]!

    const fieldSchema = schema.shape[field.name] as ZodType | undefined
    const result = fieldSchema?.safeParse(draft)
    if (result && !result.success) {
      setFieldError(result.error.issues[0]?.message ?? 'Invalid value.')
      return
    }

    form.setFieldValue(field.name, draft)

    setLines((prev) => [
      ...prev,
      { prompt: field.name, value: draft, masked: !!field.masked },
    ])
    setDraft('')

    const nextField = fields[fieldIndex + 1]
    if (nextField) {
      setPhase(nextField.name)
    } else {
      setPhase('submitting')
      void form.handleSubmit()
    }
  }

  const isFieldActive = fields.some((f) => f.name === phase)
  const currentField = fields.find((f) => f.name === phase) ?? null
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
