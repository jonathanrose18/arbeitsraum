'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { signUp } from '@/lib/auth-client'
import { TerminalForm } from './terminal-form'
import type { FieldDef } from '../types'

const schema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

const fields: FieldDef[] = [
  { name: 'name', inputType: 'text', autoComplete: 'name' },
  { name: 'email', inputType: 'email', autoComplete: 'email' },
  {
    name: 'password',
    masked: true,
    inputType: 'password',
    autoComplete: 'new-password',
  },
]

const introLines = [
  {
    delay: 1400,
    className: 'text-muted-foreground',
    text: 'No users found. Running first-time setup.',
  },
  { delay: 1800, className: 'text-green-500', text: '✓ Database connected.' },
]

export function SignUpForm() {
  const router = useRouter()

  async function submit(values: Record<string, string>) {
    return signUp.email({
      name: values.name!,
      email: values.email!,
      password: values.password!,
    })
  }

  return (
    <TerminalForm
      title='arbeitsraum — setup'
      command='> arbeitsraum --setup'
      introLines={introLines}
      fields={fields}
      schema={schema}
      statusMessages={{
        submitting: 'Creating superuser...',
        success: '✓ Superuser created. Starting arbeitsraum...',
      }}
      onSubmit={submit}
      onSuccess={() => router.push('/')}
    />
  )
}
