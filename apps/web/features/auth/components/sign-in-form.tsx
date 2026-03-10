'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { signIn } from '@/lib/auth-client'
import { TerminalForm } from './terminal-form'
import type { FieldDef } from '../types'

const schema = z.object({
  email: z.email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

const fields: FieldDef[] = [
  { name: 'email', inputType: 'email', autoComplete: 'email' },
  {
    name: 'password',
    masked: true,
    inputType: 'password',
    autoComplete: 'current-password',
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

  async function submit(values: Record<string, string>) {
    return signIn.email({ email: values.email!, password: values.password! })
  }

  return (
    <TerminalForm
      title='arbeitsraum — login'
      command='> arbeitsraum --login'
      introLines={introLines}
      fields={fields}
      schema={schema}
      statusMessages={{
        submitting: 'Authenticating...',
        success: '✓ Access granted. Redirecting...',
      }}
      onSubmit={submit}
      onSuccess={() => router.push('/')}
    />
  )
}
