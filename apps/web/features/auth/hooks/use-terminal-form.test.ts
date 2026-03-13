import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { z } from 'zod'

import type { FieldDef } from '../types'
import { useTerminalForm } from './use-terminal-form'

const schema = z.object({
  email: z.email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

const fields: FieldDef[] = [
  { name: 'email', inputType: 'email' },
  { name: 'password', masked: true, inputType: 'password' },
]

afterEach(() => {
  vi.useRealTimers()
})

type SubmitFn = (
  values: Record<string, string>,
) => Promise<{ error?: { message?: string } | null }>

function setup(opts?: { onSubmit?: SubmitFn; onSuccess?: () => void }) {
  vi.useFakeTimers()
  const onSubmit: SubmitFn =
    opts?.onSubmit ?? vi.fn().mockResolvedValue({ error: null })
  const onSuccess = opts?.onSuccess ?? vi.fn()
  const { result } = renderHook(() =>
    useTerminalForm({ fields, schema, onSubmit, onSuccess }),
  )
  return { result, onSubmit, onSuccess }
}

async function advancePastIntro(result: ReturnType<typeof setup>['result']) {
  await act(async () => vi.advanceTimersByTime(2200))
  expect(result.current.phase).toBe('email')
}

async function fillAndSubmit(result: ReturnType<typeof setup>['result']) {
  await advancePastIntro(result)
  act(() => result.current.handleDraftChange('test@example.com'))
  act(() => result.current.handleEnter())
  act(() => result.current.handleDraftChange('password123'))
  await act(async () => {
    result.current.handleEnter()
  })
}

describe('useTerminalForm', () => {
  describe('initial state', () => {
    it('starts in intro phase', () => {
      const { result } = setup()
      expect(result.current.phase).toBe('intro')
    })

    it('draft is empty', () => {
      const { result } = setup()
      expect(result.current.draft).toBe('')
    })

    it('lines is empty', () => {
      const { result } = setup()
      expect(result.current.lines).toHaveLength(0)
    })

    it('fieldError is null', () => {
      const { result } = setup()
      expect(result.current.fieldError).toBeNull()
    })

    it('isFieldActive is false', () => {
      const { result } = setup()
      expect(result.current.isFieldActive).toBe(false)
    })
  })

  describe('phase transitions', () => {
    it('transitions to first field after 2200ms', async () => {
      const { result } = setup()
      await advancePastIntro(result)
    })

    it('isFieldActive is true after intro', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      expect(result.current.isFieldActive).toBe(true)
    })
  })

  describe('handleDraftChange', () => {
    it('updates the draft value', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      act(() => result.current.handleDraftChange('hello'))
      expect(result.current.draft).toBe('hello')
    })

    it('clears fieldError on input change', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      // trigger a field error first
      act(() => result.current.handleDraftChange('bad'))
      act(() => result.current.handleEnter())
      expect(result.current.fieldError).not.toBeNull()
      // typing again should clear it
      act(() => result.current.handleDraftChange('still bad'))
      expect(result.current.fieldError).toBeNull()
    })
  })

  describe('handleEnter', () => {
    it('does nothing when draft is empty', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      act(() => result.current.handleEnter())
      expect(result.current.phase).toBe('email')
      expect(result.current.lines).toHaveLength(0)
    })

    it('does nothing when draft is only whitespace', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      act(() => result.current.handleDraftChange('   '))
      act(() => result.current.handleEnter())
      expect(result.current.phase).toBe('email')
    })

    it('shows field error for invalid email', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      act(() => result.current.handleDraftChange('not-an-email'))
      act(() => result.current.handleEnter())
      expect(result.current.fieldError).toBe('Invalid email address.')
      expect(result.current.phase).toBe('email')
    })

    it('commits line and advances to next field on valid input', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      act(() => result.current.handleDraftChange('test@example.com'))
      act(() => result.current.handleEnter())
      expect(result.current.lines).toHaveLength(1)
      expect(result.current.lines[0]).toEqual({
        prompt: 'email',
        value: 'test@example.com',
        masked: false,
      })
      expect(result.current.phase).toBe('password')
      expect(result.current.draft).toBe('')
    })

    it('committed password line is marked masked', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      act(() => result.current.handleDraftChange('test@example.com'))
      act(() => result.current.handleEnter())
      act(() => result.current.handleDraftChange('secret'))
      act(() => result.current.handleEnter())
      expect(result.current.lines[1]?.masked).toBe(true)
    })
  })

  describe('displayDraft', () => {
    it('shows plain text for unmasked fields', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      act(() => result.current.handleDraftChange('hello'))
      expect(result.current.displayDraft).toBe('hello')
    })

    it('shows bullet characters for masked fields', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      act(() => result.current.handleDraftChange('test@example.com'))
      act(() => result.current.handleEnter())
      act(() => result.current.handleDraftChange('secret'))
      expect(result.current.displayDraft).toBe('••••••')
    })
  })

  describe('handleEnter outside a field phase', () => {
    it('does nothing when called during submitting phase', async () => {
      const onSubmit: SubmitFn = vi.fn().mockResolvedValue({ error: null })
      const { result } = setup({ onSubmit })
      await advancePastIntro(result)
      act(() => result.current.handleDraftChange('test@example.com'))
      act(() => result.current.handleEnter()) // email → password
      act(() => result.current.handleDraftChange('secret'))
      // last field: triggers submitting + async onSubmit
      await act(async () => result.current.handleEnter())
      // now in success phase — handleEnter should be a no-op
      act(() => result.current.handleDraftChange('ignored'))
      act(() => result.current.handleEnter())
      expect(onSubmit).toHaveBeenCalledOnce()
    })
  })

  describe('handleReset', () => {
    it('clears state and returns to first field', async () => {
      const { result } = setup()
      await advancePastIntro(result)
      act(() => result.current.handleDraftChange('test@example.com'))
      act(() => result.current.handleEnter()) // email committed → password
      act(() => result.current.handleDraftChange('halfway'))
      act(() => result.current.handleReset())
      expect(result.current.phase).toBe('email')
      expect(result.current.lines).toHaveLength(0)
      expect(result.current.draft).toBe('')
      expect(result.current.fieldError).toBeNull()
    })

    it('is blocked during intro', () => {
      const { result } = setup()
      act(() => result.current.handleReset())
      expect(result.current.phase).toBe('intro')
    })

    it('cancels the success timer when called during success', async () => {
      const onSuccess = vi.fn()
      const { result } = setup({
        onSubmit: vi.fn().mockResolvedValue({ error: null }),
        onSuccess,
      })
      await fillAndSubmit(result)
      expect(result.current.phase).toBe('success')
      act(() => result.current.handleReset())
      await act(async () => vi.advanceTimersByTime(1800))
      expect(onSuccess).not.toHaveBeenCalled()
      expect(result.current.phase).toBe('email')
      expect(result.current.lines).toHaveLength(0)
    })
  })

  describe('submission', () => {
    it('transitions to success after successful submission', async () => {
      const { result } = setup({
        onSubmit: vi.fn().mockResolvedValue({ error: null }),
      })
      await fillAndSubmit(result)
      expect(result.current.phase).toBe('success')
    })

    it('calls onSubmit with all collected field values', async () => {
      const onSubmit: SubmitFn = vi.fn().mockResolvedValue({ error: null })
      const { result } = setup({ onSubmit })
      await fillAndSubmit(result)
      expect(onSubmit).toHaveBeenCalledOnce()
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123',
        }),
      )
    })

    it('calls onSuccess after the 1800ms success delay', async () => {
      const onSuccess = vi.fn()
      const { result } = setup({
        onSubmit: vi.fn().mockResolvedValue({ error: null }),
        onSuccess,
      })
      await fillAndSubmit(result)
      expect(onSuccess).not.toHaveBeenCalled()
      await act(async () => vi.advanceTimersByTime(1800))
      expect(onSuccess).toHaveBeenCalledOnce()
    })

    it('transitions to error phase on failed submission', async () => {
      const { result } = setup({
        onSubmit: vi
          .fn()
          .mockResolvedValue({ error: { message: 'Invalid credentials.' } }),
      })
      await fillAndSubmit(result)
      expect(result.current.phase).toBe('error')
      expect(result.current.submitError).toBe('Invalid credentials.')
    })

    it('auto-resets after the 1800ms error recovery delay', async () => {
      const { result } = setup({
        onSubmit: vi
          .fn()
          .mockResolvedValue({ error: { message: 'Invalid credentials.' } }),
      })
      await fillAndSubmit(result)
      await act(async () => vi.advanceTimersByTime(1800))
      expect(result.current.phase).toBe('email')
      expect(result.current.lines).toHaveLength(0)
    })

    it('clears the success timer on unmount so onSuccess is not called', async () => {
      vi.useFakeTimers()
      const onSuccess = vi.fn()
      const { result, unmount } = renderHook(() =>
        useTerminalForm({
          fields,
          schema,
          onSubmit: vi.fn().mockResolvedValue({ error: null }),
          onSuccess,
        }),
      )
      await act(async () => vi.advanceTimersByTime(2200))
      act(() => result.current.handleDraftChange('test@example.com'))
      act(() => result.current.handleEnter())
      act(() => result.current.handleDraftChange('password123'))
      await act(async () => result.current.handleEnter())
      expect(result.current.phase).toBe('success')
      unmount()
      await act(async () => vi.advanceTimersByTime(1800))
      expect(onSuccess).not.toHaveBeenCalled()
    })
  })
})
