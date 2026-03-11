'use client'

import { signIn, signUp } from '@/lib/auth-client'

export async function signInAction(
  values: Record<string, string>,
): Promise<{ error?: { message?: string } | null }> {
  return signIn.email({ email: values.email!, password: values.password! })
}

export async function signUpAction(
  values: Record<string, string>,
): Promise<{ error?: { message?: string } | null }> {
  return signUp.email({
    name: values.name!,
    email: values.email!,
    password: values.password!,
  })
}
