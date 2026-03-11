'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { signInAction } from '../actions'
import { TerminalForm } from './terminal-form'
import type { FieldDef } from '../types'

const schema = z.object({
  email: z.email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

const fields: FieldDef[] = [
  { name: 'email', inputType: 'email', autoComplete: 'email' },
  {
    autoComplete: 'current-password',
    inputType: 'password',
    masked: true,
    name: 'password',
  },
]

const introLines = [
  {
    delay: 1400,
    className: 'text-muted-foreground',
    text: 'Initializing secure connection...',
  },
  {
    delay: 1700,
    className: 'text-green-500',
    text: '✓ Connection established.',
  },
]

export function SignInForm() {
  const router = useRouter()

  const onSubmit = async (values: Record<string, string>) =>
    signInAction(values)

  const onSuccess = () => router.push('/')

  return (
    <TerminalForm
      command='> arbeitsraum --login'
      fields={fields}
      introLines={introLines}
      schema={schema}
      title='arbeitsraum — login'
      statusMessages={{
        submitting: 'Authenticating...',
        success: '✓ Access granted. Redirecting...',
      }}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  )
}
