import 'server-only'

import { createElement, type JSX } from 'react'
import { redirect, RedirectType } from 'next/navigation'

import { getAuth, type User } from '@/lib/auth'

export function withAuth<P>(
  Component: (
    props: P & { user: User },
  ) => Promise<JSX.Element | null> | JSX.Element | null,
  options: {
    redirectTo?: string
    redirectType?: RedirectType
  } = {},
) {
  const { redirectTo = '/sign-in', redirectType = RedirectType.replace } =
    options

  return async function AuthenticatedComponent(props: P) {
    const auth = await getAuth()

    if (!auth) {
      redirect(redirectTo, redirectType)
    }

    return createElement(Component, {
      ...props,
      user: auth.user,
    })
  }
}
