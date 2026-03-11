import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import type { FieldDef } from '../types'
import { useFormPhases } from './use-form-phases'

const emailField: FieldDef = { name: 'email', inputType: 'email' }
const passwordField: FieldDef = { name: 'password', masked: true, inputType: 'password' }
const nameField: FieldDef = { name: 'name', inputType: 'text' }
const twoFields = [emailField, passwordField]
const threeFields = [nameField, emailField, passwordField]

afterEach(() => {
  vi.useRealTimers()
})

// Helper: render with introDuration=0 and advance past intro
async function setupActiveHook(fields = twoFields, errorRecoveryDelay = 0) {
  vi.useFakeTimers()
  const hook = renderHook(() =>
    useFormPhases({ fields, introDuration: 0, errorRecoveryDelay }),
  )
  await act(async () => vi.advanceTimersByTime(0))
  return hook
}

describe('useFormPhases', () => {
  describe('initial state', () => {
    it('starts in intro phase', () => {
      const { result } = renderHook(() => useFormPhases({ fields: twoFields }))
      expect(result.current.phase).toBe('intro')
    })

    it('currentField is null during intro', () => {
      const { result } = renderHook(() => useFormPhases({ fields: twoFields }))
      expect(result.current.currentField).toBeNull()
    })

    it('isFieldActive is false during intro', () => {
      const { result } = renderHook(() => useFormPhases({ fields: twoFields }))
      expect(result.current.isFieldActive).toBe(false)
    })

    it('canReset is false during intro', () => {
      const { result } = renderHook(() => useFormPhases({ fields: twoFields }))
      expect(result.current.canReset).toBe(false)
    })
  })

  describe('intro transition', () => {
    it('transitions to first field after introDuration', async () => {
      vi.useFakeTimers()
      const { result } = renderHook(() =>
        useFormPhases({ fields: twoFields, introDuration: 100 }),
      )
      await act(async () => vi.advanceTimersByTime(100))
      expect(result.current.phase).toBe('email')
    })

    it('does not transition before introDuration elapses', async () => {
      vi.useFakeTimers()
      const { result } = renderHook(() =>
        useFormPhases({ fields: twoFields, introDuration: 100 }),
      )
      await act(async () => vi.advanceTimersByTime(99))
      expect(result.current.phase).toBe('intro')
    })

    it('transitions to the first field of a three-field form', async () => {
      vi.useFakeTimers()
      const { result } = renderHook(() =>
        useFormPhases({ fields: threeFields, introDuration: 100 }),
      )
      await act(async () => vi.advanceTimersByTime(100))
      expect(result.current.phase).toBe('name')
    })
  })

  describe('field state after intro', () => {
    it('currentField matches the first active field', async () => {
      const { result } = await setupActiveHook()
      expect(result.current.currentField?.name).toBe('email')
    })

    it('isFieldActive is true when on a field', async () => {
      const { result } = await setupActiveHook()
      expect(result.current.isFieldActive).toBe(true)
    })

    it('canReset is true on a field', async () => {
      const { result } = await setupActiveHook()
      expect(result.current.canReset).toBe(true)
    })
  })

  describe('advanceField', () => {
    it('moves to the next field and returns false', async () => {
      const { result } = await setupActiveHook()
      let returnValue = false
      act(() => {
        returnValue = result.current.advanceField()
      })
      expect(result.current.phase).toBe('password')
      expect(returnValue).toBe(false)
    })

    it('transitions to submitting on the last field and returns true', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField()) // email → password
      let returnValue = false
      act(() => {
        returnValue = result.current.advanceField() // password → submitting
      })
      expect(result.current.phase).toBe('submitting')
      expect(returnValue).toBe(true)
    })

    it('traverses all fields in a three-field form', async () => {
      const { result } = await setupActiveHook(threeFields)
      act(() => result.current.advanceField()) // name → email
      expect(result.current.phase).toBe('email')
      act(() => result.current.advanceField()) // email → password
      expect(result.current.phase).toBe('password')
      let returnValue = false
      act(() => {
        returnValue = result.current.advanceField() // password → submitting
      })
      expect(result.current.phase).toBe('submitting')
      expect(returnValue).toBe(true)
    })

    it('canReset is false during submitting', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      expect(result.current.canReset).toBe(false)
    })

    it('currentField is null during submitting', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      expect(result.current.currentField).toBeNull()
    })

    it('isFieldActive is false during submitting', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      expect(result.current.isFieldActive).toBe(false)
    })
  })

  describe('setSuccess', () => {
    it('transitions to success phase', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      act(() => result.current.setSuccess())
      expect(result.current.phase).toBe('success')
    })

    it('isFieldActive is false after success', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      act(() => result.current.setSuccess())
      expect(result.current.isFieldActive).toBe(false)
    })
  })

  describe('setError and auto-recovery', () => {
    it('transitions to error phase', async () => {
      const { result } = await setupActiveHook(twoFields, 500)
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      act(() => result.current.setError())
      expect(result.current.phase).toBe('error')
    })

    it('auto-recovers to first field after errorRecoveryDelay', async () => {
      vi.useFakeTimers()
      const { result } = renderHook(() =>
        useFormPhases({ fields: twoFields, introDuration: 0, errorRecoveryDelay: 500 }),
      )
      await act(async () => vi.advanceTimersByTime(0))
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      act(() => result.current.setError())
      await act(async () => vi.advanceTimersByTime(500))
      expect(result.current.phase).toBe('email')
    })

    it('calls onRecovered callback after the delay', async () => {
      vi.useFakeTimers()
      const onRecovered = vi.fn()
      const { result } = renderHook(() =>
        useFormPhases({ fields: twoFields, introDuration: 0, errorRecoveryDelay: 500 }),
      )
      await act(async () => vi.advanceTimersByTime(0))
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      act(() => result.current.setError(onRecovered))
      expect(onRecovered).not.toHaveBeenCalled()
      await act(async () => vi.advanceTimersByTime(500))
      expect(onRecovered).toHaveBeenCalledOnce()
    })

    it('does not call onRecovered before the delay elapses', async () => {
      vi.useFakeTimers()
      const onRecovered = vi.fn()
      const { result } = renderHook(() =>
        useFormPhases({ fields: twoFields, introDuration: 0, errorRecoveryDelay: 500 }),
      )
      await act(async () => vi.advanceTimersByTime(0))
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      act(() => result.current.setError(onRecovered))
      await act(async () => vi.advanceTimersByTime(499))
      expect(onRecovered).not.toHaveBeenCalled()
    })
  })

  describe('advanceField outside a field phase', () => {
    it('returns false without changing phase when called during submitting', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField()) // email → password
      act(() => result.current.advanceField()) // password → submitting
      let returnValue = true
      act(() => {
        returnValue = result.current.advanceField() // submitting → no-op
      })
      expect(returnValue).toBe(false)
      expect(result.current.phase).toBe('submitting')
    })

    it('returns false without changing phase when called during success', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField())
      act(() => result.current.advanceField()) // → submitting
      act(() => result.current.setSuccess()) // → success
      let returnValue = true
      act(() => {
        returnValue = result.current.advanceField()
      })
      expect(returnValue).toBe(false)
      expect(result.current.phase).toBe('success')
    })
  })

  describe('setError called twice (timer replacement)', () => {
    it('cancels the previous recovery timer when setError is called again', async () => {
      vi.useFakeTimers()
      const firstCallback = vi.fn()
      const secondCallback = vi.fn()
      const { result } = renderHook(() =>
        useFormPhases({ fields: twoFields, introDuration: 0, errorRecoveryDelay: 500 }),
      )
      await act(async () => vi.advanceTimersByTime(0))
      act(() => result.current.advanceField())
      act(() => result.current.advanceField()) // → submitting
      act(() => result.current.setError(firstCallback))
      act(() => result.current.setError(secondCallback)) // replaces previous timer
      await act(async () => vi.advanceTimersByTime(500))
      expect(firstCallback).not.toHaveBeenCalled()
      expect(secondCallback).toHaveBeenCalledOnce()
    })
  })

  describe('unmount cleanup', () => {
    it('clears a pending recovery timer on unmount', async () => {
      vi.useFakeTimers()
      const onRecovered = vi.fn()
      const { result, unmount } = renderHook(() =>
        useFormPhases({ fields: twoFields, introDuration: 0, errorRecoveryDelay: 500 }),
      )
      await act(async () => vi.advanceTimersByTime(0))
      act(() => result.current.advanceField())
      act(() => result.current.advanceField()) // → submitting
      act(() => result.current.setError(onRecovered))
      unmount()
      await act(async () => vi.advanceTimersByTime(500))
      expect(onRecovered).not.toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('reset from a field phase returns to first field', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField()) // → password
      act(() => result.current.reset())
      expect(result.current.phase).toBe('email')
    })

    it('reset is blocked during intro phase', () => {
      const { result } = renderHook(() =>
        useFormPhases({ fields: twoFields, introDuration: 5000 }),
      )
      act(() => result.current.reset())
      expect(result.current.phase).toBe('intro')
    })

    it('reset is blocked during submitting phase', async () => {
      const { result } = await setupActiveHook()
      act(() => result.current.advanceField())
      act(() => result.current.advanceField()) // → submitting
      act(() => result.current.reset())
      expect(result.current.phase).toBe('submitting')
    })

    it('reset from error phase goes to first field and cancels recovery timer', async () => {
      vi.useFakeTimers()
      const onRecovered = vi.fn()
      const { result } = renderHook(() =>
        useFormPhases({ fields: twoFields, introDuration: 0, errorRecoveryDelay: 500 }),
      )
      await act(async () => vi.advanceTimersByTime(0))
      act(() => result.current.advanceField())
      act(() => result.current.advanceField())
      act(() => result.current.setError(onRecovered))
      act(() => result.current.reset()) // cancel recovery early
      await act(async () => vi.advanceTimersByTime(500))
      expect(onRecovered).not.toHaveBeenCalled()
      expect(result.current.phase).toBe('email')
    })
  })
})
