'use client'

import { Roboto_Mono } from 'next/font/google'
import { motion, AnimatePresence } from 'motion/react'
import type { ZodObject, ZodRawShape } from 'zod'

import { AnimatedSpan, TypingAnimation } from '@/components/ui/terminal'
import { cn } from '@/lib/utils'

import { useTerminalForm } from '../hooks/use-terminal-form'
import type { FieldDef } from '../types'

const robotoMono = Roboto_Mono()

interface IntroLine {
  delay: number
  className: string
  text: string
}

export function TerminalForm({
  title,
  command,
  introLines,
  fields,
  schema,
  statusMessages,
  onSubmit,
  onSuccess,
}: {
  title: string
  command: string
  introLines: IntroLine[]
  fields: FieldDef[]
  schema: ZodObject<ZodRawShape>
  statusMessages: { submitting: string; success: string }
  onSubmit: (
    values: Record<string, string>,
  ) => Promise<{ error?: { message?: string } | null }>
  onSuccess: () => void
}) {
  const {
    currentField,
    displayDraft,
    draft,
    fieldError,
    inputRef,
    isFieldActive,
    lines,
    phase,
    submitError,
    handleDraftChange,
    handleEnter,
    handleReset,
  } = useTerminalForm({ fields, schema, onSubmit, onSuccess })

  return (
    <div
      className={cn(
        'border-border bg-background w-full max-w-md rounded-xl border shadow-2xl',
        robotoMono.className,
      )}
    >
      <div className='border-border flex items-center border-b px-4 py-3'>
        <div className='flex gap-2'>
          <span className='h-3 w-3 rounded-full bg-[#ff5f57]' />
          <span className='h-3 w-3 rounded-full bg-[#febc2e]' />
          <span className='h-3 w-3 rounded-full bg-[#28c840]' />
        </div>
        <span className='text-muted-foreground mx-auto text-xs tracking-widest'>
          {title}
        </span>
      </div>

      <div
        className='relative min-h-40 cursor-text space-y-1.5 p-5 text-sm'
        onClick={() => inputRef.current?.focus()}
        onKeyDown={(e) => e.ctrlKey && e.key === 'c' && handleReset()}
      >
        <TypingAnimation startOnView={false} className='text-primary'>
          {command}
        </TypingAnimation>

        {introLines.map((line, i) => (
          <AnimatedSpan key={i} delay={line.delay} className={line.className}>
            {line.text}
          </AnimatedSpan>
        ))}

        {lines.map((line, i) => (
          <div key={i} className='flex gap-2'>
            <span className='text-muted-foreground shrink-0'>
              {line.prompt} ▸
            </span>
            <span className='text-foreground break-all'>
              {line.masked ? '•'.repeat(line.value.length) : line.value}
            </span>
          </div>
        ))}

        {currentField && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex gap-2'
          >
            <span className='text-muted-foreground shrink-0'>
              {currentField.name} ▸
            </span>
            <span className='text-foreground min-w-0 whitespace-pre-wrap break-all'>
              {displayDraft}
              <span className='animate-cursor bg-foreground ml-px inline-block h-[1em] w-[0.55ch] translate-y-[0.05em]' />
            </span>
          </motion.div>
        )}

        <AnimatePresence>
          {fieldError && (
            <motion.p
              key='field-error'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='text-destructive'
            >
              ✗ {fieldError}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode='wait'>
          {(() => {
            const status = {
              submitting: { text: statusMessages.submitting, className: 'text-muted-foreground', exit: true },
              error: { text: `✗ ${submitError}`, className: 'text-destructive', exit: false },
              success: { text: statusMessages.success, className: 'text-green-500', exit: false },
            }[phase]
            return status ? (
              <motion.p
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={status.exit ? { opacity: 0 } : undefined}
                className={status.className}
              >
                {status.text}
              </motion.p>
            ) : null
          })()}
        </AnimatePresence>

        {phase !== 'intro' && phase !== 'submitting' && phase !== 'success' && (
          <button
            onClick={handleReset}
            className='text-muted-foreground/40 hover:text-muted-foreground/70 pt-1 text-xs transition-colors'
          >
            <span className='hidden sm:inline'>^C </span>restart
          </button>
        )}

        <input
          ref={inputRef}
          type={currentField?.inputType ?? 'text'}
          value={draft}
          onChange={(e) => isFieldActive && handleDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleEnter()
            if (e.ctrlKey && e.key === 'c') handleReset()
          }}
          autoComplete={currentField?.autoComplete}
          className='sr-only'
        />
      </div>
    </div>
  )
}
